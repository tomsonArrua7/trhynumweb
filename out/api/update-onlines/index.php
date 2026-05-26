<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// CLAVE SECRETA DE AUTENTICACIÓN
// Cambia esto por la misma clave que configuraste en tu servidor de juego
$authSecret = "Trhynum_Secure_2024_Token_XYZ";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Leer cuerpo en crudo de la petición POST
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON format']);
    exit;
}

$secret = isset($data['secret']) ? $data['secret'] : '';
$onlines = isset($data['onlines']) ? $data['onlines'] : null;

// 1. Validar autenticación
if (empty($secret) || $secret !== $authSecret) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// 2. Validar que onlines sea un número
$onlineCount = filter_var($onlines, FILTER_VALIDATE_INT);
if ($onlineCount === false) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid onlines count']);
    exit;
}

// 3. Guardar en el archivo onlines.json en la raíz de public_html
$filePath = __DIR__ . '/../../onlines.json';
$result = file_put_contents($filePath, json_encode([
    'onlines' => $onlineCount,
    'updated_at' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT));

if ($result === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write data on server']);
    exit;
}

echo json_encode(['success' => true, 'updated' => $onlineCount]);
