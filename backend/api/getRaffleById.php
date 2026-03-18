<?php

require "../config/database.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

try {
    $id = $_GET["IdRifa"] ?? null;

    if(!$id){
        echo json_encode([
            "success" => false,
            "message" => "ID no proporcionado"
        ]);
        exit;
    }

    $pdo = db();

    $stmt = $pdo->prepare("
        SELECT *
        FROM rifas
        WHERE IdRifa = :IdRifa
        LIMIT 1
    ");

    $stmt->execute([
        ":IdRifa" => $id
    ]);

    $rifa = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$rifa){
        echo json_encode([
            "success" => false,
            "message" => "Rifa no encontrada"
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "data" => $rifa
    ]);

} catch(PDOException $e){
    echo json_encode([
        "success" => false,
        "message" => "Error en el servidor",
        "error" => $e->getMessage()
    ]);
}