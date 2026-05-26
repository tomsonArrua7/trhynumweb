<?php
/**
 * ==========================================================================================
 * TRHYNUM WEB - GENERADOR DE CHECKOUT Y PREFERENCIAS PARA MERCADO PAGO
 * ==========================================================================================
 * 
 * Este script actúa como puente seguro entre tu sitio web y Mercado Pago.
 * Procesa la solicitud de donación del usuario, valida el pack en el servidor (para evitar
 * manipulación de precios) y crea la preferencia de pago de forma segura usando la API oficial
 * de Mercado Pago vía cURL.
 * 
 * Recibe por GET o POST:
 *   - 'nickname': Nombre del personaje del jugador.
 *   - 'pack': El identificador del pack de puntos a comprar (250, 500, 750, 1500, 3000).
 * 
 * Tras validar y crear la preferencia, el script redirige al usuario automáticamente a la
 * pasarela de pago oficial de Mercado Pago.
 * ==========================================================================================
 */

// Estricto reporte de errores
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// ==========================================================================================
// 1. CONFIGURACIÓN E INSTALACIÓN DE CONSTANTES (Debe coincidir con donacion_webhook.php)
// ==========================================================================================

// Cargar credenciales privadas si existen (entorno local/cPanel), sino usar placeholders (GitHub)
if (file_exists(__DIR__ . '/credentials.php')) {
    require_once __DIR__ . '/credentials.php';
}

if (!defined('MP_ACCESS_TOKEN')) {
    define('MP_ACCESS_TOKEN', 'TU_ACCESS_TOKEN_AQUÍ'); // Tu Access Token de Producción
}

// Autodetección dinámica del dominio y protocolo para una instalación 100% "Plug and Play" en cPanel
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$domain = $_SERVER['HTTP_HOST'];
$base_url = $protocol . $domain . rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');

// Define aquí la URL absoluta de tu webhook donde Mercado Pago enviará las alertas
define('MP_WEBHOOK_URL', $base_url . '/donacion_webhook.php');

// URLs de retorno una vez que el usuario termina de pagar, redirigiendo de vuelta a la sección de donaciones de la web
define('URL_SUCCESS', $base_url . '/index.html#donar');
define('URL_FAILURE', $base_url . '/index.html#donar');
define('URL_PENDING', $base_url . '/index.html#donar');

// Definición estricta de Packs en el Servidor (Previene alteración de precios por parte del usuario)
$packs = [
    '250' => [
        'title' => '250 Trhynum Points - Donación',
        'price' => 5000.00
    ],
    '500' => [
        'title' => '500 Trhynum Points - Donación',
        'price' => 10000.00
    ],
    '750' => [
        'title' => '750 Trhynum Points - Donación',
        'price' => 15000.00
    ],
    '1500' => [
        'title' => '1500 Trhynum Points - Donación',
        'price' => 30000.00
    ],
    '3000' => [
        'title' => '3000 Trhynum Points - Donación (Promoción)',
        'price' => 40000.00
    ]
];

// ==========================================================================================
// 2. CAPTURA Y VALIDACIÓN DE PARÁMETROS
// ==========================================================================================

$nickname = isset($_REQUEST['nickname']) ? trim($_REQUEST['nickname']) : '';
$pack_id = isset($_REQUEST['pack']) ? trim($_REQUEST['pack']) : '';

// Limpiar el nickname de caracteres no permitidos
$nickname_cleaned = preg_replace('/[^\w\s\-\[\]]/u', '', $nickname);
$nickname_cleaned = trim(str_replace(['|', "\r", "\n", "\t"], '', $nickname_cleaned));

if (empty($nickname_cleaned)) {
    die("Error: El nombre del personaje es requerido y no puede contener caracteres especiales.");
}

if (!isset($packs[$pack_id])) {
    die("Error: El paquete de donación seleccionado no es válido.");
}

$selected_pack = $packs[$pack_id];

// ==========================================================================================
// 3. CREACIÓN DE LA PREFERENCIA DE PAGO EN LA API DE MERCADO PAGO (cURL)
// ==========================================================================================

if (MP_ACCESS_TOKEN === 'TU_ACCESS_TOKEN_AQUÍ' || empty(MP_ACCESS_TOKEN)) {
    die("Error de Servidor: El token de Mercado Pago no está configurado.");
}

// Estructurar el cuerpo de la preferencia en formato JSON
$preference_data = [
    'items' => [
        [
            'title' => $selected_pack['title'],
            'quantity' => 1,
            'unit_price' => floatval($selected_pack['price']),
            'currency_id' => 'ARS' // Modificar por tu moneda local si es necesario (MXN, USD, CLO, etc.)
        ]
    ],
    // ENVIAR EL NOMBRE DEL PERSONAJE DEL JUGADOR AQUÍ:
    // Este campo lo leerá tu donacion_webhook.php al confirmarse el cobro.
    'external_reference' => $nickname_cleaned,
    
    // Configurar URLs de retorno a tu sitio
    'back_urls' => [
        'success' => URL_SUCCESS,
        'failure' => URL_FAILURE,
        'pending' => URL_PENDING
    ],
    'auto_return' => 'approved',
    
    // Declarar URL del Webhook
    'notification_url' => MP_WEBHOOK_URL
];

// Petición a la API Oficial de Mercado Pago
$url = "https://api.mercadopago.com/checkout/preferences";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($preference_data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . MP_ACCESS_TOKEN,
    'Content-Type: application/json'
]);

// Medidas de seguridad cURL
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

$response = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

// Validar fallos en cURL
if ($response === false) {
    die("Error de Conexión con Mercado Pago: " . $curl_error);
}

$result = json_decode($response, true);

if ($http_status !== 201 && $http_status !== 200) {
    // Si la API falla, loggear y mostrar error informativo
    error_log("Mercado Pago Preference API Error: Status $http_status. Response: " . $response);
    die("Error al procesar el pago con Mercado Pago. Por favor, contacta a soporte. Detalles: " . (isset($result['message']) ? $result['message'] : 'Respuesta desconocida.'));
}

// Redireccionar al portal de pago de Mercado Pago
if (isset($result['init_point'])) {
    $redirect_url = $result['init_point'];
    
    // Redirección limpia mediante cabecera HTTP
    header("Location: " . $redirect_url);
    exit;
} else {
    die("Error de API: No se pudo obtener el punto de inicio de la pasarela.");
}
