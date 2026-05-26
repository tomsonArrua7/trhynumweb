<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Configuración del servidor de Argentum Online
$serverIp = "149.104.76.210";
$port = 7666;
$timeout = 1.5; // Timeout corto para que la web no se ralentice

$onlines = 0;
$connected = false;

// Intentamos abrir un socket TCP directo al puerto del juego
$fp = @fsockopen($serverIp, $port, $errno, $errstr, $timeout);
if ($fp) {
    // Establecer timeout de lectura
    stream_set_timeout($fp, 1, 500000); // 1.5 segundos
    
    // Enviar comando para solicitar usuarios online
    fwrite($fp, "GETONLINES");
    
    // Recibir respuesta
    $response = fread($fp, 1024);
    fclose($fp);
    
    // Limpiar respuesta de posibles bytes residuales
    $response = trim($response);
    
    // Formato de respuesta esperado: "ONLINES:X"
    if (strpos($response, 'ONLINES:') === 0) {
        $parts = explode(':', $response);
        if (isset($parts[1]) && is_numeric($parts[1])) {
            $onlines = (int)$parts[1];
            $connected = true;
            
            // Guardamos el último valor exitoso en caché local por seguridad y alta disponibilidad
            @file_put_contents(__DIR__ . '/../../onlines.json', json_encode([
                'onlines' => $onlines,
                'timestamp' => time()
            ]));
        }
    }
}

// Si la conexión falla (servidor offline o VPS bloqueado por firewall), 
// recurrimos al último valor guardado en caché local para que la web no rompa el diseño
if (!$connected) {
    $filePath = __DIR__ . '/../../onlines.json';
    if (file_exists($filePath)) {
        $data = json_decode(file_get_contents($filePath), true);
        if (isset($data['onlines'])) {
            $onlines = (int)$data['onlines'];
        }
      }
}

echo json_encode(['onlines' => $onlines]);
