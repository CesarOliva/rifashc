<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

require "../config/database.php";

$pdo = db();

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data["Nombre"]) || !isset($data["PrecioBoleto"]) || !isset($data["Fecha"])){
    echo json_encode([
        "error" => "Datos incompletos."
    ]);
    exit;
}

$stmt = $pdo->prepare("
INSERT INTO rifas (Nombre, Imagen, Fecha, PrecioBoleto, CantidadBoletos)
VALUES (:Nombre, :Imagen, :Fecha, :PrecioBoleto, :CantidadBoletos)
");

$stmt->execute([
    ":Nombre" => $data["Nombre"],
    ":Imagen" => $data["Imagen"],
    ":Fecha" => $data["Fecha"],
    ":PrecioBoleto" => $data["PrecioBoleto"],
    ":CantidadBoletos" => $data["CantidadBoletos"]
]);

echo json_encode([
    "success" => true,
    "id" => $pdo->lastInsertId()
]);