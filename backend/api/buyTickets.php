<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require "/home4/cesaremi/config/database.php";
require "/home4/cesaremi/config/notifications.php";

$pdo = db();

function get_mail_from_header(): string {
    $fromEmail = defined("MAIL_FROM_EMAIL") ? trim(MAIL_FROM_EMAIL) : "";
    $fromName = defined("MAIL_FROM_NAME") ? trim(MAIL_FROM_NAME) : "Rifas HC";

    if ($fromEmail === "") {
        return "";
    }

    return sprintf("From: %s <%s>", $fromName, $fromEmail);
}

function format_ticket_number($number) {
    return str_pad((int)$number, 5, '0', STR_PAD_LEFT);
}

function send_client_reservation_email(array $data, array $paidNumbers, array $freeNumbers, array $raffle): bool {
    if (!defined("CLIENT_NOTIFICATION_EMAIL")) {
        return false;
    }

    $to = trim(CLIENT_NOTIFICATION_EMAIL);
    if ($to === "") {
        return false;
    }

    $raffleName = $raffle["Nombre"] ?? "Rifa";
    $price = (float)($raffle["PrecioBoleto"] ?? 0);
    $total = $price * count($paidNumbers);

    $formattedPaidNumbers = array_map('format_ticket_number', $paidNumbers);
    $formattedFreeNumbers = array_map('format_ticket_number', $freeNumbers);

    $subject = sprintf("Apartado nuevo: %s", $raffleName);
    $body = implode("\n", [
        "Se registraron boletos apartados.",
        "",
        "Rifa: " . $raffleName,
        "Cliente comprador: " . $data["Nombre"],
        "Telefono comprador: " . $data["Telefono"],
        "Boletos pagados: " . (count($formattedPaidNumbers) ? implode(", ", $formattedPaidNumbers) : "Ninguno"),
        "Boletos gratis: " . (count($formattedFreeNumbers) ? implode(", ", $formattedFreeNumbers) : "Ninguno"),
        "Cantidad de boletos: " . (count($paidNumbers) + count($freeNumbers)),
        "Importe estimado: $" . number_format($total, 2, ".", ","),
        "Fecha: " . date("Y-m-d H:i:s"),
    ]);

    $headers = ["Content-Type: text/plain; charset=UTF-8"];
    $fromHeader = get_mail_from_header();
    if ($fromHeader !== "") {
        $headers[] = $fromHeader;
    }

    return @mail($to, $subject, $body, implode("\r\n", $headers));
}

$data = json_decode(file_get_contents("php://input"), true);

if(!$data){
    echo json_encode([
        "success" => false,
        "message" => "Datos invalidos"
    ]);
    exit;
}

$paidNumbers = [];
$freeNumbers = [];

if (isset($data["NumerosPagados"]) && is_array($data["NumerosPagados"])) {
    $paidNumbers = $data["NumerosPagados"];
} elseif (isset($data["Numeros"]) && is_array($data["Numeros"])) {
    // Backwards compatibility: treat all as paid if Numeros provided
    $paidNumbers = $data["Numeros"];
} elseif (isset($data["Numero"])) {
    $paidNumbers = [$data["Numero"]];
}

if (isset($data["NumerosGratis"]) && is_array($data["NumerosGratis"])) {
    $freeNumbers = $data["NumerosGratis"];
}

$paidNumbers = array_values(array_unique(array_map("intval", $paidNumbers)));
$freeNumbers = array_values(array_unique(array_map("intval", $freeNumbers)));

$allNumbers = array_values(array_unique(array_merge($paidNumbers, $freeNumbers)));

if (
    !isset($data["IdRifa"]) ||
    !isset($data["Nombre"]) ||
    !isset($data["Telefono"]) ||
    count($allNumbers) === 0
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

    $priceStmt = $pdo->prepare("SELECT Nombre, PrecioBoleto FROM rifas WHERE IdRifa = :IdRifa LIMIT 1");
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

    foreach ($allNumbers as $number) {
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

    foreach ($allNumbers as $number) {
        $stmt1->execute([
            ":IdRifa" => $data["IdRifa"],
            ":Telefono" => $data["Telefono"],
            ":Nombre" => $data["Nombre"],
            ":Numero" => $number
        ]);
    }

    $pdo->commit();

    $emailSent = false;
    try {
        $emailSent = send_client_reservation_email($data, $paidNumbers, $freeNumbers, $raffle);
    } catch (Throwable $mailError) {
        $emailSent = false;
    }

    echo json_encode([
        "success" => true,
        "message" => "Boletos comprados",
        "notificationEmailSent" => $emailSent
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