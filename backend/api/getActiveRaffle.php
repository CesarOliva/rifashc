<?php

require "../config/database.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

try {
    $pdo = db();

    $stmt = $pdo->query("
        SELECT *
        FROM rifas
        WHERE Activa = true
        ORDER BY IdRifa DESC
        LIMIT 1
    ");

    $rifas = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$rifas){
        echo json_encode([
            "success" => false,
            "message" => "No hay rifa activa"
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "data" => $rifas
    ]);

} catch(PDOException $e){

    echo json_encode([
        "success" => false,
        "message" => "Error en el servidor",
        "error" => $e->getMessage()
    ]);

}