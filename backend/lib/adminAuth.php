<?php

require_once __DIR__ . "/../config/auth.php";

function getAuthorizationHeader(): ?string {
    if (function_exists("getallheaders")) {
        $headers = getallheaders();
        if (isset($headers["Authorization"])) {
            return $headers["Authorization"];
        }
        if (isset($headers["authorization"])) {
            return $headers["authorization"];
        }
    }

    if (isset($_SERVER["HTTP_AUTHORIZATION"])) {
        return $_SERVER["HTTP_AUTHORIZATION"];
    }

    if (isset($_SERVER["REDIRECT_HTTP_AUTHORIZATION"])) {
        return $_SERVER["REDIRECT_HTTP_AUTHORIZATION"];
    }

    return null;
}

function require_admin(): void {
    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
        http_response_code(200);
        exit;
    }

    $authHeader = getAuthorizationHeader();
    if (!$authHeader || !preg_match("/Bearer\\s+(.*)$/i", $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "No autorizado"
        ]);
        exit;
    }

    $token = trim($matches[1]);
    if (!hash_equals(ADMIN_TOKEN, $token)) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "No autorizado"
        ]);
        exit;
    }
}
