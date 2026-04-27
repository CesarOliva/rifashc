<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
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

if(!$data || empty($data["IdRifa"])){
    echo json_encode([
        "success" => false,
        "message" => "IdRifa requerido"
    ]);
    exit;
}

try{
    $stmt = $pdo->prepare("\n        DELETE FROM ganadores_rifa\n        WHERE IdRifa = :IdRifa\n    ");

    $stmt->execute([
        ":IdRifa" => $data["IdRifa"]
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Ganador eliminado"
    ]);
} catch(PDOException $e){
    echo json_encode([
        "success" => false,
        "message" => "Error al eliminar ganador",
        "error" => $e->getMessage()
    ]);
}
