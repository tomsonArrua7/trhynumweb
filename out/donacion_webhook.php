<?php
/**
 * ==========================================================================================
 * TRHYNUM WEB - WEBHOOK & IPN DE MERCADO PAGO PARA ACREDITACIÓN DE DONACIONES EN VIVO
 * ==========================================================================================
 * 
 * Este script actúa como receptor automático para Mercado Pago (Webhooks y notificaciones IPN).
 * Cuando Mercado Pago notifica un pago aprobado, el script:
 *   1. Extrae y valida el ID de pago.
 *   2. Consulta de forma segura la API de Mercado Pago vía cURL con su Access Token.
 *   3. Si el pago es "approved", extrae el Nickname del personaje desde 'external_reference'.
 *   4. Calcula la cantidad de Trhynum Points según una tasa de conversión configurable.
 *   5. Abre un socket TCP seguro al puerto 7666 del servidor para acreditar los puntos en vivo.
 *   6. Si el servidor de juego está offline, almacena la donación en un log de contingencia
 *      para evitar pérdidas de dinero y permitir la acreditación manual o diferida.
 * 
 * ==========================================================================================
 */

// Estricto reporte de errores para desarrollo controlado
error_reporting(E_ALL);
ini_set('display_errors', 0); // Desactivar salida de errores a pantalla para no corromper respuestas HTTP
ini_set('log_errors', 1);

// Cabecera JSON para la respuesta a Mercado Pago
header('Content-Type: application/json; charset=utf-8');

// ==========================================================================================
// 1. CONFIGURACIÓN DEL SISTEMA (PARAMÉTRICA)
// ==========================================================================================

// Cargar credenciales privadas si existen (entorno local/cPanel), sino usar placeholders (GitHub)
if (file_exists(__DIR__ . '/credentials.php')) {
    require_once __DIR__ . '/credentials.php';
}

if (!defined('MP_ACCESS_TOKEN')) {
    define('MP_ACCESS_TOKEN', 'TU_ACCESS_TOKEN_AQUÍ'); // Tu Access Token de Producción
}

// Información del servidor de juego Fénix AO
define('GAME_SERVER_IP', '149.104.76.210');
define('GAME_SERVER_PORT', 7666);

if (!defined('TCP_SECRET_TOKEN')) {
    define('TCP_SECRET_TOKEN', 'TuClaveSuperSecreta'); // Token que declaraste en el servidor (TCP.bas)
}

define('TCP_TIMEOUT_SECONDS', 3); // Timeout máximo para evitar que el script PHP de cPanel se quede colgado

// Tasa de conversión y mapeo de Packs (Regla: $20 ARS = 1 Trhynum Point, con promociones especiales)
function calcular_puntos($monto) {
    $monto_int = (int)round($monto);
    switch ($monto_int) {
        case 5000:  return 250;
        case 10000: return 500;
        case 15000: return 750;
        case 30000: return 1500;
        case 40000: return 3000; // Pack Promocional
        default:    return (int)floor($monto / 20);
    }
}

// Rutas de archivos de logs locales en tu hosting cPanel
define('LOG_PENDING_FILE', __DIR__ . '/donacion_pendientes.log'); // Archivo de donaciones fallidas en el TCP (contingencia)
define('LOG_AUDIT_FILE', __DIR__ . '/donaciones_audit.log');     // Registro general de auditoría (trazabilidad completa)

// MODO DE DEPURACIÓN MANUAL (SANDBOX LOCAL)
define('DEBUG_MODE', false); 
define('DEBUG_KEY', 'test_trhynum'); // Cambia esto por una clave secreta propia para tus pruebas

// ==========================================================================================
// 2. FUNCIONES DE AUDITORÍA Y UTILERÍA
// ==========================================================================================

/**
 * Registra un mensaje formateado en un archivo de log específico.
 */
function write_log($file_path, $level, $message, $context = []) {
    $date = date('Y-m-d H:i:s');
    $context_str = !empty($context) ? ' | Contexto: ' . json_encode($context, JSON_UNESCAPED_UNICODE) : '';
    $formatted_message = sprintf("[%s] [%s] %s%s%s", $date, strtoupper($level), $message, $context_str, PHP_EOL);
    @file_put_contents($file_path, $formatted_message, FILE_APPEND | LOCK_EX);
}

/**
 * Sanitiza el Nickname para evitar vulnerabilidades de inyección de comandos o rotura de protocolo TCP.
 * Remueve caracteres delimitadores como '|' y limpia espacios y saltos de línea.
 */
function sanitize_nickname($nickname) {
    if ($nickname === null) return '';
    // Eliminar saltos de línea, tabulaciones y el delimitador '|'
    $cleaned = str_replace(['|', "\r", "\n", "\t"], '', $nickname);
    // Remover caracteres extraños, dejar solo letras, números, guiones y espacios básicos
    $cleaned = preg_replace('/[^\w\s\-\[\]]/u', '', $cleaned);
    return trim($cleaned);
}

// ==========================================================================================
// 3. CAPTURA DE LA NOTIFICACIÓN DE MERCADO PAGO
// ==========================================================================================

$payment_id = null;
$notification_source = '';

// A) MODO DEBUG / PRUEBA MANUAL DE TCP
if (DEBUG_MODE && isset($_GET['debug_key']) && $_GET['debug_key'] === DEBUG_KEY) {
    write_log(LOG_AUDIT_FILE, 'info', 'Iniciando simulación de pago en Modo Debug.');
    
    $test_nickname = isset($_GET['nickname']) ? sanitize_nickname($_GET['nickname']) : 'PersonajePrueba';
    $test_amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 150.00;
    $test_payment_id = 'debug_' . time();

    write_log(LOG_AUDIT_FILE, 'info', "Modo Debug: Simulación autorizada.", [
        'payment_id' => $test_payment_id,
        'nickname' => $test_nickname,
        'amount' => $test_amount
    ]);

    // Ejecutar el flujo TCP directamente
    procesar_acreditacion_tcp($test_payment_id, $test_nickname, $test_amount);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Simulación completada. Revisa los archivos de logs.',
        'data' => [
            'payment_id' => $test_payment_id,
            'nickname' => $test_nickname,
            'amount' => $test_amount,
            'points' => calcular_puntos($test_amount)
        ]
    ]);
    exit;
}

// B) LEER ENTRADA DE NOTIFICACIÓN DE MERCADO PAGO
$raw_input = file_get_contents('php://input');
$json_data = json_decode($raw_input, true);

if (!empty($json_data)) {
    $type = isset($json_data['type']) ? $json_data['type'] : (isset($json_data['action']) ? $json_data['action'] : '');
    
    if (($type === 'payment' || strpos($type, 'payment.') === 0) && isset($json_data['data']['id'])) {
        $payment_id = $json_data['data']['id'];
        $notification_source = 'Webhook (JSON Body)';
    } elseif (isset($json_data['resource']) && strpos($json_data['resource'], '/v1/payments/') !== false) {
        $parts = explode('/', $json_data['resource']);
        $payment_id = end($parts);
        $notification_source = 'Webhook (Resource URL)';
    }
}

// 2. Intentar capturar desde IPN Clásico (Parámetros GET)
if (empty($payment_id)) {
    $id_param = isset($_GET['id']) ? trim($_GET['id']) : '';
    $data_id_param = isset($_GET['data_id']) ? trim($_GET['data_id']) : '';
    $type_param = isset($_GET['type']) ? trim($_GET['type']) : (isset($_GET['topic']) ? trim($_GET['topic']) : '');

    if ($type_param === 'payment') {
        $payment_id = !empty($data_id_param) ? $data_id_param : $id_param;
        $notification_source = 'IPN (GET Parameters)';
    }
}

// Si no se pudo extraer ningún ID válido
if (empty($payment_id) || !is_numeric($payment_id)) {
    write_log(LOG_AUDIT_FILE, 'warning', 'Petición recibida sin un ID de pago válido o tipo no soportado.', [
        'GET' => $_GET,
        'POST_RAW' => $raw_input
    ]);
    
    http_response_code(400);
    echo json_encode(['error' => 'Invalid payment ID or resource type.']);
    exit;
}

write_log(LOG_AUDIT_FILE, 'info', "Notificación de pago detectada.", [
    'payment_id' => $payment_id,
    'origen' => $notification_source
]);

// ==========================================================================================
// 4. VERIFICACIÓN DIRECTA CONTRA LA API DE MERCADO PAGO (cURL)
// ==========================================================================================

if (MP_ACCESS_TOKEN === 'TU_ACCESS_TOKEN_AQUÍ' || empty(MP_ACCESS_TOKEN)) {
    write_log(LOG_AUDIT_FILE, 'critical', 'El token MP_ACCESS_TOKEN no ha sido configurado en el script.');
    http_response_code(500);
    echo json_encode(['error' => 'Server misconfigured. Access Token is missing.']);
    exit;
}

$url = "https://api.mercadopago.com/v1/payments/" . $payment_id;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . MP_ACCESS_TOKEN,
    'Content-Type: application/json'
]);

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

$response_raw = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

if ($response_raw === false) {
    write_log(LOG_AUDIT_FILE, 'error', 'Error en la petición cURL hacia Mercado Pago.', [
        'payment_id' => $payment_id,
        'curl_error' => $curl_error
    ]);
    
    http_response_code(500);
    echo json_encode(['error' => 'API communication error.']);
    exit;
}

if ($http_status !== 200) {
    write_log(LOG_AUDIT_FILE, 'error', 'Mercado Pago API retornó un código de error HTTP.', [
        'payment_id' => $payment_id,
        'http_status' => $http_status,
        'respuesta' => json_decode($response_raw, true)
    ]);
    
    if ($http_status === 404) {
        http_response_code(200);
        echo json_encode(['message' => 'Payment not found in Mercado Pago. Response captured.']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error fetching payment data.']);
    }
    exit;
}

$payment_data = json_decode($response_raw, true);

if (empty($payment_data)) {
    write_log(LOG_AUDIT_FILE, 'error', 'No se pudo decodificar el JSON de respuesta de Mercado Pago.', [
        'payment_id' => $payment_id,
        'raw_response' => $response_raw
    ]);
    http_response_code(500);
    echo json_encode(['error' => 'Invalid JSON response from Mercado Pago.']);
    exit;
}

$status = isset($payment_data['status']) ? $payment_data['status'] : '';
$external_reference = isset($payment_data['external_reference']) ? $payment_data['external_reference'] : '';
$transaction_amount = isset($payment_data['transaction_amount']) ? floatval($payment_data['transaction_amount']) : 0.0;

write_log(LOG_AUDIT_FILE, 'info', 'Datos del pago consultados con éxito.', [
    'payment_id' => $payment_id,
    'status' => $status,
    'external_reference' => $external_reference,
    'amount' => $transaction_amount
]);

if ($status !== 'approved') {
    write_log(LOG_AUDIT_FILE, 'info', 'El pago no está en estado "approved". Ignorando acreditación de puntos.', [
        'payment_id' => $payment_id,
        'status' => $status
    ]);
    
    http_response_code(200);
    echo json_encode(['status' => 'ignored', 'message' => 'Payment status is not approved. Status: ' . $status]);
    exit;
}

$nickname = sanitize_nickname($external_reference);
if (empty($nickname)) {
    write_log(LOG_AUDIT_FILE, 'critical', 'El pago fue APROBADO pero no contiene un Nickname válido en external_reference.', [
        'payment_id' => $payment_id,
        'external_reference_original' => $external_reference
    ]);
    
    $contingencia_data = [
        'payment_id' => $payment_id,
        'timestamp' => date('Y-m-d H:i:s'),
        'monto' => $transaction_amount,
        'nickname' => 'DESCONOCIDO_ERROR_PREFERENCIA',
        'puntos' => calcular_puntos($transaction_amount),
        'motivo' => 'Falta external_reference en preferencia de pago'
    ];
    @file_put_contents(LOG_PENDING_FILE, json_encode($contingencia_data, JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);

    http_response_code(200);
    echo json_encode(['status' => 'error_recorded', 'message' => 'Payment approved but nickname was missing. Recorded in pending log.']);
    exit;
}

// ==========================================================================================
// 5. FLUJO DE ACREDITACIÓN TCP (CONEXIÓN Y CONTINGENCIA)
// ==========================================================================================

procesar_acreditacion_tcp($payment_id, $nickname, $transaction_amount);

http_response_code(200);
echo json_encode([
    'status' => 'success',
    'message' => 'Notification processed successfully.',
    'acredited' => [
        'payment_id' => $payment_id,
        'nickname' => $nickname,
        'amount' => $transaction_amount,
        'points' => calcular_puntos($transaction_amount)
    ]
]);
exit;

/**
 * Realiza la conexión TCP no-bloqueante al servidor del juego y envía el comando de acreditación.
 * Si falla, registra de forma segura en el archivo de contingencia.
 */
function procesar_acreditacion_tcp($payment_id, $nickname, $monto) {
    $puntos = calcular_puntos($monto);
    
    if ($puntos <= 0) {
        write_log(LOG_AUDIT_FILE, 'warning', 'La cantidad de puntos calculada es 0 o menor. Cancelando TCP.', [
            'payment_id' => $payment_id,
            'monto' => $monto,
            'puntos' => $puntos
        ]);
        return false;
    }

    // Preparar el paquete exacto bajo el protocolo Fénix AO con control de duplicados (5 parámetros)
    // Formato: ADD_TRHYN|TOKEN_SECRETO|NICKNAME|CANTIDAD|PAYMENT_ID
    $packet = sprintf("ADD_TRHYN|%s|%s|%d|%s", TCP_SECRET_TOKEN, $nickname, $puntos, $payment_id);
    
    write_log(LOG_AUDIT_FILE, 'info', "Preparando envío TCP al servidor de juego.", [
        'host' => GAME_SERVER_IP,
        'port' => GAME_SERVER_PORT,
        'packet_preview' => "ADD_TRHYN|***|$nickname|$puntos|$payment_id"
    ]);

    $errno = 0;
    $errstr = '';
    
    $socket = @fsockopen(GAME_SERVER_IP, GAME_SERVER_PORT, $errno, $errstr, TCP_TIMEOUT_SECONDS);

    if (!$socket) {
        write_log(LOG_AUDIT_FILE, 'error', 'Servidor de juego inalcanzable (TCP Offline). Registrando donación en contingencias.', [
            'payment_id' => $payment_id,
            'err_no' => $errno,
            'err_str' => $errstr
        ]);

        guardar_en_contingencia($payment_id, $nickname, $monto, $puntos, "TCP Offline: $errstr ($errno)");
        return false;
    }

    stream_set_timeout($socket, TCP_TIMEOUT_SECONDS);

    $write_bytes = @fwrite($socket, $packet);

    if ($write_bytes === false) {
        write_log(LOG_AUDIT_FILE, 'error', 'Fallo al escribir en el socket TCP del servidor de juego.', [
            'payment_id' => $payment_id
        ]);
        guardar_en_contingencia($payment_id, $nickname, $monto, $puntos, "Fallo de escritura en socket TCP");
        @fclose($socket);
        return false;
    }

    @fclose($socket);

    write_log(LOG_AUDIT_FILE, 'success', 'Acreditación TCP enviada con éxito al servidor en vivo.', [
        'payment_id' => $payment_id,
        'nickname' => $nickname,
        'puntos' => $puntos,
        'bytes_enviados' => $write_bytes
    ]);

    return true;
}

/**
 * Guarda una donación pendiente en un archivo de log JSON local.
 * Esto asegura que ninguna donación se pierda si el servidor del juego está caído.
 */
function guardar_en_contingencia($payment_id, $nickname, $monto, $puntos, $motivo) {
    $contingencia_data = [
        'payment_id' => $payment_id,
        'timestamp' => date('Y-m-d H:i:s'),
        'monto' => floatval($monto),
        'nickname' => $nickname,
        'puntos' => intval($puntos),
        'motivo' => $motivo,
        'acreditado_manualmente' => false
    ];

    $json_line = json_encode($contingencia_data, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    $resultado = @file_put_contents(LOG_PENDING_FILE, $json_line, FILE_APPEND | LOCK_EX);

    if ($resultado !== false) {
        write_log(LOG_AUDIT_FILE, 'info', 'Donación registrada exitosamente en donacion_pendientes.log.', ['payment_id' => $payment_id]);
    } else {
        error_log("CRITICAL ERROR: No se puede escribir en el archivo de contingencia de donaciones! Datos: " . json_encode($contingencia_data));
        write_log(LOG_AUDIT_FILE, 'critical', 'FALLO CATASTRÓFICO AL ESCRIBIR LOG DE CONTINGENCIA. Asegura permisos de escritura en la carpeta.', [
            'payment_id' => $payment_id,
            'datos' => $contingencia_data
        ]);
    }
}
