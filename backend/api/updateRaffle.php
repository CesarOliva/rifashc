<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require "../config/database.php";

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
            CantidadBoletos = :CantidadBoletos,
            Activa = :Activa
        WHERE IdRifa = :IdRifa
    ");

    $stmt->execute([
        ":IdRifa" => $data["IdRifa"],
        ":Nombre" => $data["Nombre"],
        ":Imagen" => $data["Imagen"],
        ":Fecha" => $data["Fecha"],
        ":PrecioBoleto" => $data["PrecioBoleto"],
        ":CantidadBoletos" => $data["CantidadBoletos"],
        ":Activa" => $data["Activa"],
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
        // "message" => $e->getMessage()
    ]);
}
