<?php

require "/home4/cesaremi/config/database.php";

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
        FROM boletos
        JOIN clientes ON boletos.IdCliente = clientes.IdCliente
        WHERE IdRifa = :IdRifa
    ");

    $stmt->execute([
        ":IdRifa" => $id
    ]);

    $rifa = $stmt->fetchAll(PDO::FETCH_ASSOC);

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