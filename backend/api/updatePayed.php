<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require "../config/database.php";
require "../lib/adminAuth.php";

require_admin();

$pdo = db();

$data = json_decode(file_get_contents("php://input"), true);

if(!$data || !isset($data["IdBoleto"])){
    echo json_encode([
        "success" => false,
        "message" => "Datos inválidos o ID no proporcionado"
    ]);
    exit;
}

try{
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        UPDATE boletos 
        SET Pagado = NOT Pagado
        WHERE IdBoleto = :IdBoleto
    ");
    $stmt->execute([
        ":IdBoleto" => $data["IdBoleto"]
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Boleto actualizado correctamente."
    ]);
}catch(Exception $e){
    $pdo->rollBack();
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}