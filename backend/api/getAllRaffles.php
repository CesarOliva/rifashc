<?php

require "../config/database.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

try {
    $pdo = db();

    $stmt = $pdo->query("
        SELECT *
        FROM rifas
        ORDER BY IdRifa DESC
    ");

    $rifas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if(!$rifas){
        echo json_encode([
            "success" => false,
            "message" => "No hay rifas registradas"
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