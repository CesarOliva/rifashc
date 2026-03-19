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
        UPDATE rifas
        SET
            Nombre = :Nombre,
            Imagen = :Imagen,
            Fecha = :Fecha,
            PrecioBoleto = :PrecioBoleto,
            CantidadBoletos = :CantidadBoletos
        WHERE IdRifa = :IdRifa
    ");

    $stmt->execute([
        ":IdRifa" => $data["IdRifa"],
        ":Nombre" => $data["Nombre"],
        ":Imagen" => $data["Imagen"],
        ":Fecha" => $data["Fecha"],
        ":PrecioBoleto" => $data["PrecioBoleto"],
        ":CantidadBoletos" => $data["CantidadBoletos"],
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Rifa actualizada."
    ]);
} catch(PDOException $e){
    echo json_encode([
        "success" => false,
        "message" => 'Fallo al actualizar la rifa'
    ]);
}