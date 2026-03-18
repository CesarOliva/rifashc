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

    $stmtCheck = $pdo->prepare("
        SELECT Fecha FROM rifas WHERE IdRifa = :IdRifa
    ");
    $stmtCheck->execute([
        ":IdRifa" => $data["IdRifa"]
    ]);

    $rifa = $stmtCheck->fetch(PDO::FETCH_ASSOC);

    if(!$rifa){
        throw new Exception("La rifa no existe");
    }
    if(strtotime($rifa["Fecha"]) <= time()){
        throw new Exception("No puedes activar una rifa con fecha pasada");
    }

    $stmt = $pdo->prepare("
        UPDATE rifas 
        SET Activa = NOT ACTIVA
        WHERE IdRifa = :IdRifa
    ");
    $stmt->execute([
        ":IdRifa" => $data["IdRifa"]
    ]);

    $count = $pdo->prepare("
        SELECT COUNT(*) FROM rifas WHERE Activa = 1
    ");
    $count->execute();
    $activeCount = $count->fetchColumn();

    if($activeCount>1){
        throw new Exception("No puedes tener mas de una rifa activa");
        $pdo->rollBack();
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Rifa actualizada correctamente."
    ]);
}catch(Exception $e){
    $pdo->rollBack();
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}