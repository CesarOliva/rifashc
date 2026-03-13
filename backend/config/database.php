<?php

function db(){
    $env = "sqlite";

    if($env === "sqlite"){
        $pdo = new PDO("sqlite:../database/rifas.sqlite");
    }else{
        //Credenciales de mysql
        $host = "localhost";
        $db = "rifas";
        $user = "user";
        $pass = "password";

        $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8",$user,$pass);
    }
    
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    return $pdo;
}