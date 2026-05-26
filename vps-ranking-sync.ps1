<#
.SYNOPSIS
    Sincronizador de Rankings en tiempo real para TrhynumAO.
.DESCRIPTION
    Este script lee los archivos locales del servidor VPS de Argentum Online,
    los procesa y los sincroniza directamente con la base de datos Upstash Redis en la nube.
    Esto permite mantener actualizados los rankings de la web (trhynumao.com.ar) al instante.

.PARAMETER ServerPath
    Ruta a la carpeta raíz del Servidor de Argentum Online. Por defecto es "C:\Servidor".
.PARAMETER RedisUrl
    URL REST de Upstash Redis (ej. https://chosen-slug-12345.upstash.io).
.PARAMETER RedisToken
    Token de autenticación de Upstash Redis.
.PARAMETER IntervalSeconds
    Frecuencia de actualización en segundos si se corre en modo bucle. Por defecto es 7200 (2 horas).
.PARAMETER Loop
    Si se especifica, el script correrá de forma contínua en un bucle infinito cada X segundos.
    Si no se especifica, se ejecutará una única vez (ideal para Tareas Programadas de Windows).
#>

param(
    [string]$ServerPath = "C:\Users\Administrador\Desktop\Servidor",
    [string]$RedisUrl = "https://primary-martin-137072.upstash.io",
    [string]$RedisToken = "gQAAAAAAAhdwAAIgcDFlNGU3MzMxNDE2M2E0MDI4OWJkYzFmMTQ2M2Q3YmZjMA",
    [int]$IntervalSeconds = 7200,
    [switch]$Loop
)

# NOTA: No usamos [Console]::OutputEncoding ni Write-Host para evitar fallos de buffer (0x1F) en Windows Server 2012 R2.
# Toda la salida de consola se hace mediante Write-Output que es 100% inmune a estos errores.

Write-Output "=========================================================="
Write-Output "      SINCRONIZADOR DE RANKINGS - TRHYNUM AO              "
Write-Output "=========================================================="
Write-Output "Ruta del Servidor: $ServerPath"
Write-Output "Intervalo de loop: $IntervalSeconds segundos"
Write-Output "=========================================================="

# Validar parámetros obligatorios si no están en variables de entorno
if (-not $RedisUrl) {
    $RedisUrl = [System.Environment]::GetEnvironmentVariable("UPSTASH_REDIS_REST_URL")
}
if (-not $RedisToken) {
    $RedisToken = [System.Environment]::GetEnvironmentVariable("UPSTASH_REDIS_REST_TOKEN")
}

if (-not $RedisUrl -or -not $RedisToken) {
    Write-Output "[ERROR] Se requiere la URL y el Token de Upstash Redis."
    Write-Output "Por favor provéelos como parámetros o configura las variables de entorno."
    exit 1
}

# --- FUNCIONES DE PARSEO DE ARCHIVOS ---

# Función para parsear archivos en formato clásico VB6 Write ("Nombre", Puntos)
function Get-RankingMensual {
    param(
        [string]$FilePath,
        [int]$SkipLines,
        [int]$TakeLines
    )
    if (-not (Test-Path $FilePath)) {
        Write-Output "  [-] Archivo no encontrado: $FilePath"
        return @()
    }
    
    try {
        # Leer archivo con codificación Latin1 para preservar caracteres especiales/acentos de Windows/VB6
        $lines = Get-Content -Path $FilePath -Encoding String -ErrorAction Stop
        if ($null -eq $lines) { return @() }
        
        # Limpiar líneas vacías y espacios de los bordes
        $lines = $lines | Where-Object { $_.Trim() -ne "" }
        
        # Saltar las líneas indicadas (por ejemplo la fecha de reset en la línea 1)
        $rankingLines = $lines | Select-Object -Skip $SkipLines -First $TakeLines
        
        $ranking = @()
        $posicion = 1
        foreach ($line in $rankingLines) {
            # Remover comillas dobles
            $cleanLine = $line -replace '"', ''
            # Separar por comas
            if ($cleanLine -match '^([^,]+),\s*(\d+)$') {
                $nombre = $Matches[1].Trim()
                $puntos = [int]$Matches[2]
                $ranking += [PSCustomObject]@{
                    posicion = $posicion
                    nombre   = $nombre
                    puntos   = $puntos
                }
                $posicion++
            }
        }
        return $ranking
    } catch {
        Write-Output "  [ERROR] Fallo al parsear $FilePath : $_"
        return @()
    }
}

# Función para parsear rankings genéricos de una sola línea por registro ("Nombre", Puntos)
function Get-SimpleRanking {
    param(
        [string]$FilePath
    )
    if (-not (Test-Path $FilePath)) {
        Write-Output "  [-] Archivo no encontrado: $FilePath"
        return @()
    }
    
    try {
        $lines = Get-Content -Path $FilePath -Encoding String -ErrorAction Stop
        if ($null -eq $lines) { return @() }
        
        $ranking = @()
        $posicion = 1
        foreach ($line in $lines) {
            $trimmed = $line.Trim()
            if ($trimmed -eq "") { continue }
            
            # Ignorar si por error se escribe la fecha de reset al principio
            if ($trimmed -match '^\d{2}/\d{2}/\d{4}') { continue }
            
            # Limpiar comillas
            $cleanLine = $trimmed -replace '"', ''
            if ($cleanLine -match '^([^,]+),\s*(-?\d+)$') {
                $nombre = $Matches[1].Trim()
                $puntos = [int]$Matches[2]
                $ranking += [PSCustomObject]@{
                    posicion = $posicion
                    nombre   = $nombre
                    puntos   = $puntos
                }
                $posicion++
                if ($posicion -gt 10) { break } # Top 10 máximo
            }
        }
        return $ranking
    } catch {
        Write-Output "  [ERROR] Fallo al parsear $FilePath : $_"
        return @()
    }
}

# Función para parsear el archivo INI de Clanes y calcular el Tiempo de Dominación de Castillos
function Get-GuildsInfo {
    param(
        [string]$FilePath
    )
    if (-not (Test-Path $FilePath)) {
        Write-Output "  [-] Archivo no encontrado: $FilePath"
        return @()
    }
    
    try {
        $content = Get-Content -Path $FilePath -Encoding String -ErrorAction Stop
        if ($null -eq $content) { return @() }
        
        $guilds = @()
        $currentGuild = @{}
        
        foreach ($line in $content) {
            $trimmed = $line.Trim()
            if ($trimmed -eq "" -or $trimmed.StartsWith(";")) { continue }
            
            if ($trimmed -match '^\[(.+)\]$') {
                # Se detecta una nueva sección de clan
                if ($currentGuild.ContainsKey("Nombre") -or $currentGuild.ContainsKey("GuildName")) {
                    $nombre = if ($currentGuild.Nombre) { $currentGuild.Nombre } else { $currentGuild.GuildName }
                    $tiempo = if ($currentGuild.TiempoDominacion) { [int]$currentGuild.TiempoDominacion } else { 0 }
                    
                    if ($nombre -and $tiempo -gt 0) {
                        $guilds += [PSCustomObject]@{
                            nombre = $nombre
                            tiempo = $tiempo
                        }
                    }
                }
                $currentGuild = @{}
            } elseif ($trimmed -match '^([^=]+)=(.*)$') {
                $key = $Matches[1].Trim()
                $value = $Matches[2].Trim()
                $currentGuild[$key] = $value
            }
        }
        
        # Procesar el último registro del archivo
        if ($currentGuild.ContainsKey("Nombre") -or $currentGuild.ContainsKey("GuildName")) {
            $nombre = if ($currentGuild.Nombre) { $currentGuild.Nombre } else { $currentGuild.GuildName }
            $tiempo = if ($currentGuild.TiempoDominacion) { [int]$currentGuild.TiempoDominacion } else { 0 }
            
            if ($nombre -and $tiempo -gt 0) {
                $guilds += [PSCustomObject]@{
                    nombre = $nombre
                    tiempo = $tiempo
                }
            }
        }
        
        # Ordenar los clanes descendentemente por su tiempo de dominación
        $sortedGuilds = $guilds | Sort-Object -Property tiempo -Descending
        
        $ranking = @()
        $posicion = 1
        foreach ($g in $sortedGuilds) {
            $ranking += [PSCustomObject]@{
                posicion = $posicion
                nombre   = $g.nombre
                puntos   = $g.tiempo
            }
            $posicion++
            if ($posicion -gt 10) { break } # Top 10 máximo
        }
        return $ranking
    } catch {
        Write-Output "  [ERROR] Fallo al parsear $FilePath : $_"
        return @()
    }
}

# --- FUNCIÓN DE ENVÍO A REDIS ---

function Send-To-Redis {
    param(
        [string]$Key,
        [object]$Data
    )
    
    if ($Data.Count -eq 0 -or $null -eq $Data) {
        Write-Output "  [-] Sin registros para subir a la clave: $Key"
        return
    }
    
    try {
        # Convertir a JSON comprimido
        $json = ConvertTo-Json -InputObject $Data -Compress -Depth 5
        
        # Endpoint de Upstash REST API
        $endpoint = "$RedisUrl/set/$Key"
        $headers = @{
            "Authorization" = "Bearer $RedisToken"
            "Content-Type"  = "application/json"
        }
        
        # Codificar explícitamente en UTF-8 para evitar problemas de codificación de caracteres especiales
        $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($json)
        
        $response = Invoke-RestMethod -Uri $endpoint -Method Post -Headers $headers -Body $bodyBytes -ErrorAction Stop
        
        if ($response.result -eq "OK") {
            Write-Output "  [+] Sincronizado exitosamente '$Key' con $($Data.Count) registros."
        } else {
            Write-Output "  [!] Upstash devolvió un resultado inesperado para '$Key': $($response | ConvertTo-Json)"
        }
    } catch {
        Write-Output "  [ERROR] Error al enviar a Upstash Redis ('$Key'): $_"
    }
}

# --- PROCESO PRINCIPAL DE EJECUCIÓN ---

function Sync-All-Rankings {
    Write-Output "[$(Get-Date -Format 'HH:mm:ss')] Iniciando sincronización de rankings..."
    
    # 1. Ranking 1v1 (RankingMensual.dat - Saltamos 1 línea, tomamos 10 registros)
    $fileRankMensual = Join-Path $ServerPath "Dat\RankingMensual.dat"
    Write-Output " Procesando 1v1 Retos..."
    $top1v1 = Get-RankingMensual -FilePath $fileRankMensual -SkipLines 1 -TakeLines 10
    Send-To-Redis -Key "rankings_1" -Data $top1v1
    
    # 2. Ranking 2v2 (RankingMensual.dat - Saltamos 11 líneas, tomamos 10 registros)
    Write-Output " Procesando 2v2 Retos..."
    $top2v2 = Get-RankingMensual -FilePath $fileRankMensual -SkipLines 11 -TakeLines 10
    Send-To-Redis -Key "rankings_2" -Data $top2v2
    
    # 3. Castillo de Clanes (GuildsInfo.inf)
    $fileGuilds = Join-Path $ServerPath "Guilds\GuildsInfo.inf"
    Write-Output " Procesando Castillo de Clanes (Tiempo de Dominación)..."
    $topCastillos = Get-GuildsInfo -FilePath $fileGuilds
    Send-To-Redis -Key "rankings_3" -Data $topCastillos
    
    # 5. CvC de Clanes (CvCTop10.dat)
    $fileCvC = Join-Path $ServerPath "Dat\CvCTop10.dat"
    Write-Output " Procesando Torneo CvC de Clanes..."
    $topCvC = Get-SimpleRanking -FilePath $fileCvC
    Send-To-Redis -Key "rankings_5" -Data $topCvC
    
    # 6. ELO Clasificatorio (Top10Elo.dat)
    $fileElo = Join-Path $ServerPath "Dat\Top10Elo.dat"
    Write-Output " Procesando ELO Clasificatorio..."
    $topElo = Get-SimpleRanking -FilePath $fileElo
    Send-To-Redis -Key "rankings_6" -Data $topElo
    
    Write-Output "[$(Get-Date -Format 'HH:mm:ss')] Sincronización completada con éxito."
    Write-Output "----------------------------------------------------------"
}

# --- BUCLE PRINCIPAL / MODO LOOP ---

if ($Loop) {
    Write-Output "Corriendo en modo contínuo (Bucle). Presiona Ctrl+C para salir."
    while ($true) {
        Sync-All-Rankings
        Start-Sleep -Seconds $IntervalSeconds
    }
} else {
    # Ejecución única (ideal para Tareas Programadas)
    Sync-All-Rankings
}
