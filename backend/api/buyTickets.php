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

$numbers = [];
if (isset($data["Numeros"]) && is_array($data["Numeros"])) {
    $numbers = $data["Numeros"];
} elseif (isset($data["Numero"])) {
    $numbers = [$data["Numero"]];
}

$numbers = array_values(array_unique(array_map("intval", $numbers)));

if (
    !isset($data["IdRifa"]) ||
    !isset($data["Nombre"]) ||
    !isset($data["Telefono"]) ||
    count($numbers) === 0
) {
    echo json_encode([
        "success" => false,
        "message" => "Faltan campos obligatorios"
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

    $priceStmt = $pdo->prepare("SELECT PrecioBoleto FROM rifas WHERE IdRifa = :IdRifa LIMIT 1");
    $priceStmt->execute([
        ":IdRifa" => $data["IdRifa"]
    ]);
    $raffle = $priceStmt->fetch(PDO::FETCH_ASSOC);

    if (!$raffle) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Rifa no encontrada"
        ]);
        exit;
    }

    $checkStmt = $pdo->prepare("SELECT Numero FROM boletos WHERE IdRifa = :IdRifa AND Numero = :Numero LIMIT 1");
    $occupied = [];

    foreach ($numbers as $number) {
        $checkStmt->execute([
            ":IdRifa" => $data["IdRifa"],
            ":Numero" => $number
        ]);

        if ($checkStmt->fetch(PDO::FETCH_ASSOC)) {
            $occupied[] = $number;
        }
    }

    if (count($occupied) > 0) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Boletos ocupados: " . implode(", ", $occupied)
        ]);
        exit;
    }

    //Crear el boleto con el IdRifa y IdCliente
    $stmt1 = $pdo->prepare("
        INSERT INTO boletos (IdRifa, IdCliente, Numero, Pagado)
        SELECT 
            :IdRifa,
            (SELECT IdCliente FROM clientes WHERE Telefono = :Telefono AND Nombre = :Nombre LIMIT 1),
            :Numero,
            0
        ;
    ");

    foreach ($numbers as $number) {
        $stmt1->execute([
            ":IdRifa" => $data["IdRifa"],
            ":Telefono" => $data["Telefono"],
            ":Nombre" => $data["Nombre"],
            ":Numero" => $number
        ]);
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Boletos comprados"
    ]);
} catch(PDOException $e){
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    if($e->getCode() == 23000){
        echo json_encode([
            "success" => false,
            "message" => "El boleto ya está ocupado"
        ]);
        exit;
    }else{
        echo json_encode([
            "success" => false,
            "message" => 'Fallo al comprar el boleto'
        ]);
    }
}