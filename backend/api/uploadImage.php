<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if($_SERVER["REQUEST_METHOD"] === "OPTIONS"){
    http_response_code(200);
    exit;
}

require "/home4/cesaremi/public_html/lib/adminAuth.php";

require_admin();

define("UPLOAD_DIR", "../uploads/");

if(!file_exists(UPLOAD_DIR)){
    mkdir(UPLOAD_DIR,0777,true);
}

if(!isset($_FILES["image"])){

    echo json_encode([
        "success"=>false,
        "message"=>"Imagen no recibida"
    ]);
    exit;
}

$file = $_FILES["image"];

if($file["size"] > 5 * 1024 * 1024){
    echo json_encode([
        "success"=>false,
        "message"=>"Imagen demasiado grande"
    ]);
    exit;
}

$allowed = ["image/jpeg","image/png","image/webp"];

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo,$file["tmp_name"]);

if(!in_array($mime,$allowed)){
    echo json_encode([
        "success"=>false,
        "message"=>"Tipo de imagen no permitido"
    ]);
    exit;
}

$tmp = $file["tmp_name"];
$filename = uniqid().".webp";
$filepath = UPLOAD_DIR.$filename;

function convertToWebP($source,$destination,$quality=75){
    $info = getimagesize($source);

    switch($info["mime"]){
        case "image/jpeg":
            $image = imagecreatefromjpeg($source);
            break;
        case "image/png":
            $image = imagecreatefrompng($source);
            imagepalettetotruecolor($image);
            imagealphablending($image,true);
            imagesavealpha($image,true);
            break;
        case "image/webp":
            $image = imagecreatefromwebp($source);
            break;
        default:
            return false;
    }

    imagewebp($image,$destination,$quality);
    return true;
}

if(!convertToWebP($tmp,$filepath)){
    echo json_encode([
        "success"=>false,
        "message"=>"Error al convertir imagen"
    ]);
    exit;
}

$url = "https://".$_SERVER["HTTP_HOST"]."/uploads/".$filename;

echo json_encode([
    "success"=>true,
    "url"=>$url
]);
exit;