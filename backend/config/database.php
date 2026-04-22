<?php

function db(){
    $host = "";
    $db = "";
    $user = "";
    $pass = "";

    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8",$user,$pass);
    
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    return $pdo;
}