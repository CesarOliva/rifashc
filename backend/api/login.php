<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../config/auth.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["usuario"]) || !isset($data["password"])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Datos invalidos"
    ]);
    exit;
}

$usuario = (string)$data["usuario"];
$password = (string)$data["password"];

if (!hash_equals(ADMIN_USER, $usuario) || !password_verify($password, ADMIN_PASSWORD_HASH)) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Credenciales invalidas"
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "token" => ADMIN_TOKEN
]);
