<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require "../config/database.php";
require "../lib/adminAuth.php";

require_admin();

$pdo = db();

$data = json_decode(file_get_contents("php://input"), true);

if(!$data){
    echo json_encode([
        "success" => false,
        "message" => "Datos invalidos"
    ]);
    exit;
}

try{
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        DELETE FROM boletos
        WHERE IdBoleto = :IdBoleto
    ");

    $stmt->execute([
        ":IdBoleto" => $data["IdBoleto"],
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Boleto eliminado."
    ]);
} catch(PDOException $e){
    echo json_encode([
        "success" => false,
        "message" => 'Fallo al eliminar el boleto'
    ]);
}