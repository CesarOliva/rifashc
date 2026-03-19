<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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

    //Crear el cliente si no existe
    $stmt = $pdo->prepare("
        SELECT IdCliente
        FROM clientes
        WHERE Telefono = :Telefono AND Nombre = :Nombre");
    $stmt->execute([
        ":Telefono" => $data["Telefono"],
        ":Nombre" => $data["Nombre"]
    ]);

    $cliente = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$cliente){
        $client = $pdo->prepare("
            INSERT INTO clientes (Nombre, Telefono)
            VALUES (:Nombre, :Telefono)"
        );

        $client->execute([
            ":Nombre"=> $data["Nombre"],
            ":Telefono"=> $data["Telefono"]
        ]);
    }

    //Crear el boleto con el IdRifa y IdCliente
    $stmt1 = $pdo->prepare("
        INSERT INTO boletos (IdRifa, IdCliente, Numero)
        VALUES (:IdRifa, (SELECT IdCliente FROM clientes WHERE Telefono = :Telefono AND Nombre = :Nombre), :Numero)
    ");
    $stmt1->execute([
        ":IdRifa" => $data["IdRifa"],
        ":Telefono" => $data["Telefono"],
        ":Nombre" => $data["Nombre"],
        ":Numero" => $data["Numero"]
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Boleto comprado"
    ]);
} catch(PDOException $e){
    echo json_encode([
        "success" => false,
        "message" => 'Fallo al comprar el boleto'
    ]);
}