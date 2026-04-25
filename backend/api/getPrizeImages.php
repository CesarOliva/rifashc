<?php

require "/home4/cesaremi/config/database.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

try {
    $pdo = db();

    $stmt = $pdo->query("
        SELECT IdPremioImagen, Imagen, FechaCreacion
        FROM premios_imagenes
        ORDER BY IdPremioImagen DESC
    ");

    $imagenes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $imagenes
    ]);

} catch(PDOException $e){

    echo json_encode([
        "success" => false,
        "message" => "Error en el servidor",
        "error" => $e->getMessage()
    ]);

}
