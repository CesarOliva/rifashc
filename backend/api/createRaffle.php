<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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

    $stmt = $pdo->prepare("UPDATE rifas SET Activa = 0");
    $stmt->execute();
    
    $stmt2 = $pdo->prepare("
    INSERT INTO rifas (Nombre, Imagen, Fecha, PrecioBoleto, CantidadBoletos)
    VALUES (:Nombre, :Imagen, :Fecha, :PrecioBoleto, :CantidadBoletos)
    ");

    $stmt2->execute([
        ":Nombre" => $data["Nombre"],
        ":Imagen" => $data["Imagen"],
        ":Fecha" => $data["Fecha"],
        ":PrecioBoleto" => $data["PrecioBoleto"],
        ":CantidadBoletos" => $data["CantidadBoletos"]
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Rifa creada"
    ]);
} catch(PDOException $e){
    echo json_encode([
        "success" => false,
        "message" => 'Fallo al crear la rifa'
    ]);
}