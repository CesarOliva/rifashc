<?php

require "../config/database.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$pdo = db();

$stmt = $pdo->query("
SELECT *
FROM rifas
WHERE Activa = true
LIMIT 1
");

$rifa = $stmt->fetch(PDO::FETCH_ASSOC);

if(!$rifa){
    echo json_encode([
        "error" => "No hay rifa activa"
    ]);
    exit;
}

echo json_encode($rifa);