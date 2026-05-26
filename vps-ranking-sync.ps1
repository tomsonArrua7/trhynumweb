<#
.SYNOPSIS
    Sincronizador de Rankings en tiempo real para TrhynumAO.
.DESCRIPTION
    Este script lee los archivos locales del servidor VPS de Argentum Online,
    los procesa y los sincroniza directamente con la base de datos Upstash Redis en la nube.
    Esto permite mantener actualizados los rankings de la web (trhynumao.com.ar) al instante.

.PARAMETER ServerPath
    Ruta a la carpeta raíz del Servidor de Argentum Online. Por defecto apunta al VPS del usuario.
.PARAMETER RedisUrl
    URL REST de Upstash Redis.
.PARAMETER RedisToken
    Token de autenticación de Upstash Redis.
.PARAMETER IntervalSeconds
    Frecuencia de actualización en segundos si se corre en modo bucle. Por defecto es 7200 (2 horas).
.PARAMETER Loop
    Si se especifica, el script correrá de forma contínua en un bucle infinito cada X segundos.
#>

param(
    [string]$ServerPath = "C:\Users\usuario\Desktop\ARGENTUM\TrhynumAO Servidor y Cliente\Servidor",
    [string]$RedisUrl = "https://primary-martin-137072.upstash.io",
    [string]$RedisToken = "gQAAAAAAAhdwAAIgcDFlNGU3MzMxNDE2M2E0MDI4OWJkYzFmMTQ2M2Q3YmZjMA",
    [int]$IntervalSeconds = 300, # Sincronización cada 5 minutos
    [switch]$Loop
)

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

# --- FUNCIONES DE PARSEO DE ARCHIVOS (LIBRES DE POLUCIÓN DE PIPELINE) ---

# Función para parsear archivos en formato alternado de VB6 (Línea Impar = Nombre, Línea Par = Puntos)
function Get-RankingMensual {
    param(
        [string]$FilePath,
        [int]$SkipLines, # 1 para 1v1, 11 para 2v2
        [int]$TakeLines = 10
    )
    if (-not (Test-Path $FilePath)) {
        Write-Warning "  [-] Archivo no encontrado: $FilePath"
        return @() # Retorno puro
    }
    
    try {
        # Leer archivo con codificación Latin1 para preservar caracteres especiales/acentos
        $lines = Get-Content -Path $FilePath -Encoding String -ErrorAction Stop
        if ($null -eq $lines) { return @() }
        
        # Limpiar líneas vacías y espacios
        $lines = $lines | Where-Object { $_.Trim() -ne "" }
        if ($lines.Count -lt 2) { return @() }
        
        # La línea 0 es la fecha de último reset.
        # Las entradas de VB6 se guardan una abajo de la otra debido a dos llamadas consecutivas a Write:
        # Línea 1: Nombre1v1_1, Línea 2: Puntos1v1_1, Línea 3: Nombre1v1_2...
        # Por tanto, el Top 10 de 1v1 ocupa de la línea 1 a la 20 (20 líneas).
        # El Top 10 de 2v2 ocupa de la línea 21 a la 40 (20 líneas).
        
        $startIndex = 1
        if ($SkipLines -gt 1) {
            $startIndex = 21 # 1 (fecha) + 20 (1v1)
        }
        
        $ranking = @()
        $posicion = 1
        
        for ($i = 0; $i -lt $TakeLines; $i++) {
            $nameIdx = $startIndex + ($i * 2)
            $ptsIdx = $nameIdx + 1
            
            if ($nameIdx -lt $lines.Count -and $ptsIdx -lt $lines.Count) {
                $nombre = ($lines[$nameIdx] -replace '"', '').Trim()
                $puntos = [int]($lines[$ptsIdx] -replace '"', '')
                
                if ($nombre -ne "") {
                    $ranking += [PSCustomObject]@{
                        posicion = $posicion
                        nombre   = $nombre
                        puntos   = $puntos
                    }
                    $posicion++
                }
            }
        }
        return $ranking
    } catch {
        Write-Warning "  [ERROR] Fallo al parsear $FilePath : $_"
        return @()
    }
}

# Función para parsear rankings simples alternados (Línea 1 = Nombre/Clan, Línea 2 = Puntos)
function Get-SimpleRanking {
    param(
        [string]$FilePath
    )
    if (-not (Test-Path $FilePath)) {
        Write-Warning "  [-] Archivo no encontrado: $FilePath"
        return @()
    }
    
    try {
        $lines = Get-Content -Path $FilePath -Encoding String -ErrorAction Stop
        if ($null -eq $lines) { return @() }
        
        $lines = $lines | Where-Object { $_.Trim() -ne "" }
        if ($lines.Count -eq 0) { return @() }
        
        # Ignorar si por error se escribe la fecha de reset en la primera línea
        if ($lines[0] -match '^\d{2}/\d{2}/\d{4}') {
            $lines = $lines | Select-Object -Skip 1
        }
        
        # Detectar si el archivo es separado por comas ("Clan", Victorias) o alternado
        $isCommaSeparated = $false
        foreach ($line in $lines) {
            if ($line -match ',') {
                $isCommaSeparated = $true
                break
            }
        }
        
        $ranking = @()
        $posicion = 1
        
        if ($isCommaSeparated) {
            foreach ($line in $lines) {
                $cleanLine = $line -replace '"', ''
                if ($cleanLine -match '^([^,]+),\s*(-?\d+)$') {
                    $nombre = $Matches[1].Trim()
                    $puntos = [int]$Matches[2]
                    
                    if ($nombre -ne "") {
                        $ranking += [PSCustomObject]@{
                            posicion = $posicion
                            nombre   = $nombre
                            puntos   = $puntos
                        }
                        $posicion++
                        if ($posicion -gt 10) { break }
                    }
                }
            }
        } else {
            for ($i = 0; $i -lt 10; $i++) {
                $nameIdx = $i * 2
                $ptsIdx = $nameIdx + 1
                
                if ($nameIdx -lt $lines.Count -and $ptsIdx -lt $lines.Count) {
                    $nombre = ($lines[$nameIdx] -replace '"', '').Trim()
                    $puntos = [int]($lines[$ptsIdx] -replace '"', '')
                    
                    if ($nombre -ne "") {
                        $ranking += [PSCustomObject]@{
                            posicion = $posicion
                            nombre   = $nombre
                            puntos   = $puntos
                        }
                        $posicion++
                    }
                }
            }
        }
        return $ranking
    } catch {
        Write-Warning "  [ERROR] Fallo al parsear $FilePath : $_"
        return @()
    }
}

# Función para parsear el archivo INI de Clanes y calcular el Tiempo de Dominación de Castillos
function Get-GuildsInfo {
    param(
        [string]$FilePath
    )
    if (-not (Test-Path $FilePath)) {
        Write-Warning "  [-] Archivo no encontrado: $FilePath"
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
                if ($currentGuild.ContainsKey("Nombre") -or $currentGuild.ContainsKey("GuildName") -or $currentGuild.ContainsKey("Name")) {
                    $nombre = if ($currentGuild.Nombre) { $currentGuild.Nombre } elseif ($currentGuild.GuildName) { $currentGuild.GuildName } else { $currentGuild.Name }
                    $tiempo = if ($currentGuild.DominionTime) { [int]$currentGuild.DominionTime } elseif ($currentGuild.TiempoDominacion) { [int]$currentGuild.TiempoDominacion } else { 0 }
                    
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
        
        # Procesar último registro
        if ($currentGuild.ContainsKey("Nombre") -or $currentGuild.ContainsKey("GuildName") -or $currentGuild.ContainsKey("Name")) {
            $nombre = if ($currentGuild.Nombre) { $currentGuild.Nombre } elseif ($currentGuild.GuildName) { $currentGuild.GuildName } else { $currentGuild.Name }
            $tiempo = if ($currentGuild.DominionTime) { [int]$currentGuild.DominionTime } elseif ($currentGuild.TiempoDominacion) { [int]$currentGuild.TiempoDominacion } else { 0 }
            
            if ($nombre -and $tiempo -gt 0) {
                $guilds += [PSCustomObject]@{
                    nombre = $nombre
                    tiempo = $tiempo
                }
            }
        }
        
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
            if ($posicion -gt 10) { break }
        }
        return $ranking
    } catch {
        Write-Warning "  [ERROR] Fallo al parsear $FilePath : $_"
        return @()
    }
}

# --- FUNCIÓN DE ENVÍO A REDIS ---

function Send-To-Redis {
    param(
        [string]$Key,
        [object]$Data
    )
    
    # Inicializar como array vacío si es nulo para limpiar el ranking en la web
    $uploadData = $Data
    if ($null -eq $uploadData) {
        $uploadData = @()
    }
    
    try {
        # Convertir a JSON comprimido
        $json = ConvertTo-Json -InputObject $uploadData -Compress -Depth 5
        
        # Endpoint de Upstash REST API
        $endpoint = "$RedisUrl/set/$Key"
        $headers = @{
            "Authorization" = "Bearer $RedisToken"
            "Content-Type"  = "application/json"
        }
        
        $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($json)
        $response = Invoke-RestMethod -Uri $endpoint -Method Post -Headers $headers -Body $bodyBytes -ErrorAction Stop
        
        if ($response.result -eq "OK") {
            Write-Output "  [+] Sincronizado exitosamente '$Key' con $($uploadData.Count) registros."
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
    
    # 4. Ganador de Torneos (TorneosTop10.dat)
    $fileTorneos = Join-Path $ServerPath "Dat\TorneosTop10.dat"
    Write-Output " Procesando Ganador de Torneos..."
    $topTorneos = Get-SimpleRanking -FilePath $fileTorneos
    Send-To-Redis -Key "rankings_4" -Data $topTorneos
    
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
    Sync-All-Rankings
}
