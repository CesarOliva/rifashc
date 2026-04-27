<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require "/home4/cesaremi/config/database.php";
require "/home4/cesaremi/public_html/lib/adminAuth.php";

require_admin();

$pdo = db();

$data = json_decode(file_get_contents("php://input"), true);

if(!$data || empty($data["IdRifa"])){
    echo json_encode([
        "success" => false,
        "message" => "IdRifa requerido"
    ]);
    exit;
}

try{
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        SELECT
            b.IdBoleto,
            b.IdRifa,
            b.Numero,
            b.Pagado,
            c.Nombre,
            c.Telefono
        FROM boletos b
        INNER JOIN clientes c ON c.IdCliente = b.IdCliente
        WHERE b.IdRifa = :IdRifa
        ORDER BY RAND()
        LIMIT 1
    ");

    $stmt->execute([
        ":IdRifa" => $data["IdRifa"]
    ]);

    $winner = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$winner){
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "No hay boletos comprados para sortear."
        ]);
        exit;
    }

        $winnerStmt = $pdo->prepare("
            INSERT INTO ganadores_rifa (IdRifa, IdBoleto, Numero, Nombre, Telefono)
            VALUES (:IdRifa, :IdBoleto, :Numero, :Nombre, :Telefono)
            ON DUPLICATE KEY UPDATE
                IdBoleto = VALUES(IdBoleto),
                Numero = VALUES(Numero),
                Nombre = VALUES(Nombre),
                Telefono = VALUES(Telefono),
                FechaSorteo = CURRENT_TIMESTAMP
        ");

        $winnerStmt->execute([
            ":IdRifa" => $winner["IdRifa"],
            ":IdBoleto" => $winner["IdBoleto"],
            ":Numero" => $winner["Numero"],
            ":Nombre" => $winner["Nombre"],
            ":Telefono" => $winner["Telefono"]
        ]);

    $deactivateStmt = $pdo->prepare("
        UPDATE rifas
        SET Activa = 0
        WHERE IdRifa = :IdRifa
    ");

    $deactivateStmt->execute([
        ":IdRifa" => $data["IdRifa"]
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Ganador generado correctamente. La rifa fue desactivada.",
        "data" => $winner
    ]);
} catch(PDOException $e){
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    echo json_encode([
        "success" => false,
        "message" => "Error al iniciar la rifa",
        "error" => $e->getMessage()
    ]);
}
