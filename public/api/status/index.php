<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = '149.104.76.210';
$port = 7666;
$timeout = 2; // seconds

$connection = @fsockopen($host, $port, $errno, $errstr, $timeout);

if (is_resource($connection)) {
    fclose($connection);
    echo json_encode(['online' => true]);
} else {
    echo json_encode(['online' => false]);
}
