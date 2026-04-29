<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require "/home4/cesaremi/config/database.php";
require "/home4/cesaremi/public_html/lib/adminAuth.php";

require_admin();

$pdo = db();
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Datos inválidos"
    ]);
    exit;
}

$ticketIds = [];

if (isset($data["IdBoletos"]) && is_array($data["IdBoletos"])) {
    $ticketIds = $data["IdBoletos"];
} elseif (isset($data["IdBoleto"])) {
    $ticketIds = [$data["IdBoleto"]];
}

$ticketIds = array_values(array_unique(array_map("intval", $ticketIds)));

if (count($ticketIds) === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Datos inválidos o ID no proporcionado"
    ]);
    exit;
}

try {
    $pdo->beginTransaction();

    $placeholders = implode(",", array_fill(0, count($ticketIds), "?"));
    $stmt = $pdo->prepare("UPDATE boletos SET Pagado = 1 WHERE IdBoleto IN ($placeholders)");
    $stmt->execute($ticketIds);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Boletos confirmados correctamente.",
        "updatedIds" => $ticketIds,
        "updatedCount" => count($ticketIds)
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
