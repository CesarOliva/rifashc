<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require "/home4/cesaremi/config/database.php";
require "/home4/cesaremi/public_html/lib/adminAuth.php";

require_admin();

$id = $_GET["IdRifa"] ?? null;

if(!$id){
    echo json_encode([
        "success" => false,
        "message" => "IdRifa requerido"
    ]);
    exit;
}

try {
    $pdo = db();

    $stmt = $pdo->prepare("
        SELECT IdGanador, IdRifa, IdBoleto, Numero, Nombre, Telefono, FechaSorteo
        FROM ganadores_rifa
        WHERE IdRifa = :IdRifa
        LIMIT 1
    ");

    $stmt->execute([
        ":IdRifa" => $id
    ]);

    $winner = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$winner){
        echo json_encode([
            "success" => false,
            "message" => "Aun no hay ganador para esta rifa"
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "data" => $winner
    ]);
} catch(PDOException $e){
    echo json_encode([
        "success" => false,
        "message" => "Error en el servidor",
        "error" => $e->getMessage()
    ]);
}
