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

.EXAMPLE
    # Ejecución única (ideal para Tareas Programadas de Windows cada 5 minutos):
    .\vps-ranking-sync.ps1 -ServerPath "C:\Trhynum\Servidor" -RedisUrl "https://xxx.upstash.io" -RedisToken "xxx"

.EXAMPLE
    # Ejecución contínua en consola:
    .\vps-ranking-sync.ps1 -ServerPath "C:\Trhynum\Servidor" -RedisUrl "https://xxx.upstash.io" -RedisToken "xxx" -Loop -IntervalSeconds 60
#>

param(
    [string]$ServerPath = "C:\Servidor",
    [string]$RedisUrl = "https://primary-martin-137072.upstash.io",
    [string]$RedisToken = "gQAAAAAAAhdwAAIgcDFlNGU3MzMxNDE2M2E0MDI4OWJkYzFmMTQ2M2Q3YmZjMA",
    [int]$IntervalSeconds = 7200,
    [switch]$Loop
)
# Sobrescribir Write-Host localmente con Write-Output para evitar el error Win32 0x1F de la consola de Windows Server 2012 R2
function Write-Host {
    param(
        [Parameter(ValueFromPipeline = $true, Position = 0)]
        [object]$Object,
        [string]$ForegroundColor,
        [string]$BackgroundColor,
        [switch]$NoNewline
    )
    Write-Output "$Object"
}
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "      SINCRONIZADOR DE RANKINGS - TRHYNUM AO              " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Ruta del Servidor: $ServerPath" -ForegroundColor White
Write-Host "Intervalo de loop: $IntervalSeconds segundos" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan

# Validar parámetros obligatorios si no están en variables de entorno
if (-not $RedisUrl) {
    $RedisUrl = [System.Environment]::GetEnvironmentVariable("UPSTASH_REDIS_REST_URL")
}
if (-not $RedisToken) {
    $RedisToken = [System.Environment]::GetEnvironmentVariable("UPSTASH_REDIS_REST_TOKEN")
}

if (-not $RedisUrl -or -not $RedisToken) {
    Write-Host "[ERROR] Se requiere la URL y el Token de Upstash Redis." -ForegroundColor Red
    Write-Host "Por favor provéelos como parámetros (-RedisUrl y -RedisToken) o configura las" -ForegroundColor Yellow
    Write-Host "variables de entorno UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN." -ForegroundColor Yellow
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
        Write-Host "  [!] Archivo no encontrado: $FilePath" -ForegroundColor Yellow
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
        Write-Host "  [ERROR] Fallo al parsear $FilePath : $_" -ForegroundColor Red
        return @()
    }
}

# Función para parsear rankings genéricos de una sola línea por registro ("Nombre", Puntos)
function Get-SimpleRanking {
    param(
        [string]$FilePath
    )
    if (-not (Test-Path $FilePath)) {
        Write-Host "  [!] Archivo no encontrado: $FilePath" -ForegroundColor Yellow
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
        Write-Host "  [ERROR] Fallo al parsear $FilePath : $_" -ForegroundColor Red
        return @()
    }
}

# Función para parsear el archivo INI de Clanes y calcular el Tiempo de Dominación de Castillos
function Get-GuildsInfo {
    param(
        [string]$FilePath
    )
    if (-not (Test-Path $FilePath)) {
        Write-Host "  [!] Archivo no encontrado: $FilePath" -ForegroundColor Yellow
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
        Write-Host "  [ERROR] Fallo al parsear $FilePath : $_" -ForegroundColor Red
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
        Write-Host "  [-] Sin registros para subir a la clave: $Key" -ForegroundColor Gray
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
            Write-Host "  [+] Sincronizado exitosamente '$Key' con $($Data.Count) registros." -ForegroundColor Green
        } else {
            Write-Host "  [!] Upstash devolvió un resultado inesperado para '$Key': $($response | ConvertTo-Json)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  [ERROR] Error al enviar a Upstash Redis ('$Key'): $_" -ForegroundColor Red
    }
}

# --- PROCESO PRINCIPAL DE EJECUCIÓN ---

function Sync-All-Rankings {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Iniciando sincronización de rankings..." -ForegroundColor Cyan
    
    # 1. Ranking 1v1 (RankingMensual.dat - Saltamos 1 línea, tomamos 10 registros)
    $fileRankMensual = Join-Path $ServerPath "Dat\RankingMensual.dat"
    Write-Host " Procesando 1v1 Retos..." -ForegroundColor White
    $top1v1 = Get-RankingMensual -FilePath $fileRankMensual -SkipLines 1 -TakeLines 10
    Send-To-Redis -Key "rankings_1" -Data $top1v1
    
    # 2. Ranking 2v2 (RankingMensual.dat - Saltamos 11 líneas, tomamos 10 registros)
    Write-Host " Procesando 2v2 Retos..." -ForegroundColor White
    $top2v2 = Get-RankingMensual -FilePath $fileRankMensual -SkipLines 11 -TakeLines 10
    Send-To-Redis -Key "rankings_2" -Data $top2v2
    
    # 3. Castillo de Clanes (GuildsInfo.inf)
    $fileGuilds = Join-Path $ServerPath "Guilds\GuildsInfo.inf"
    Write-Host " Procesando Castillo de Clanes (Tiempo de Dominación)..." -ForegroundColor White
    $topCastillos = Get-GuildsInfo -FilePath $fileGuilds
    Send-To-Redis -Key "rankings_3" -Data $topCastillos
    
    # 5. CvC de Clanes (CvCTop10.dat)
    $fileCvC = Join-Path $ServerPath "Dat\CvCTop10.dat"
    Write-Host " Procesando Torneo CvC de Clanes..." -ForegroundColor White
    $topCvC = Get-SimpleRanking -FilePath $fileCvC
    Send-To-Redis -Key "rankings_5" -Data $topCvC
    
    # 6. ELO Clasificatorio (Top10Elo.dat)
    $fileElo = Join-Path $ServerPath "Dat\Top10Elo.dat"
    Write-Host " Procesando ELO Clasificatorio..." -ForegroundColor White
    $topElo = Get-SimpleRanking -FilePath $fileElo
    Send-To-Redis -Key "rankings_6" -Data $topElo
    
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Sincronización completada con éxito." -ForegroundColor Cyan
    Write-Host "----------------------------------------------------------" -ForegroundColor Gray
}

# --- BUCLE PRINCIPAL / MODO LOOP ---

if ($Loop) {
    Write-Host "Corriendo en modo contínuo (Bucle). Presiona Ctrl+C para salir." -ForegroundColor Yellow
    while ($true) {
        Sync-All-Rankings
        Start-Sleep -Seconds $IntervalSeconds
    }
} else {
    # Ejecución única (ideal para Tareas Programadas)
    Sync-All-Rankings
}
