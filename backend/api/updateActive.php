<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require "../config/database.php";

$pdo = db();

$data = json_decode(file_get_contents("php://input"), true);

if(!$data || !isset($data["IdRifa"])){
    echo json_encode([
        "success" => false,
        "message" => "Datos inválidos o ID no proporcionado"
    ]);
    exit;
}

try{
    $pdo->beginTransaction();

    $stmt1 = $pdo->prepare("UPDATE rifas SET Activa = 0");
    $stmt1->execute();

    $stmt2 = $pdo->prepare("UPDATE rifas SET Activa = 1 WHERE IdRifa = :IdRifa");
    $stmt2->execute([
        ":IdRifa" => $data["IdRifa"]
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Rifa actualizada correctamente."
    ]);
} catch(PDOException $e){
    $pdo->rollBack();
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>