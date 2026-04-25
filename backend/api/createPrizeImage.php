<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require "/home4/cesaremi/config/database.php";
require "/home4/cesaremi/public_html/lib/adminAuth.php";

require_admin();

$pdo = db();

$data = json_decode(file_get_contents("php://input"), true);

if(!$data || empty(trim($data["Imagen"] ?? ""))){
    echo json_encode([
        "success" => false,
        "message" => "Imagen invalida"
    ]);
    exit;
}

try{
    $stmt = $pdo->prepare("
        INSERT INTO premios_imagenes (Imagen)
        VALUES (:Imagen)
    ");

    $stmt->execute([
        ":Imagen" => trim($data["Imagen"])
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Imagen agregada"
    ]);
} catch(PDOException $e){
    echo json_encode([
        "success" => false,
        "message" => "Fallo al agregar la imagen"
    ]);
}
