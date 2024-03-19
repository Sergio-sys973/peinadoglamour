<?php

namespace Controllers;

use MVC\Router;
use Model\AdminCita;

class AdminController {
  public static function index( Router $router ) {
     // session_start();

        isAdmin();
     
    $fecha = $_GET['fecha'] ?? date('Y-m-d');
     // debuguear($fecha);  
   $fechas = explode('-', $fecha) ?? date('Y-m-d');
        
    //debuguear( checkdate( $fecha[1], $fecha[2], $fecha[0]) );

    if( !checkdate( $fechas[1], $fechas[2], $fechas[0]) ) {
        header('location: /400');
    }

     // Consultar la Base de Datos

$consulta = "SELECT citas.id, citas.hora, CONCAT( usuarios.nombre, ' ', usuarios.apellido) as cliente, ";
$consulta .= " usuarios.email, usuarios.telefono, servicios.nombre as servicio, servicios.precio  ";
$consulta .= " FROM citas  ";
$consulta .= " LEFT OUTER JOIN usuarios ";
$consulta .= " ON citas.usuarioId=usuarios.id  ";
$consulta .= " LEFT OUTER JOIN citasservicios ";
$consulta .= " ON citasservicios.citaId=citas.id ";
$consulta .= " LEFT OUTER JOIN servicios ";
$consulta .= " ON servicios.id=citasservicios.servicioId ";

$consulta .= " WHERE fecha =  '{$fecha}' ";

$citas = AdminCita::SQL($consulta);

    //debuguear($citas);
   
    $router->render('admin/index', [
        'nombre' => $_SESSION['nombre'],
        'citas' => $citas,
        'fecha' => $fecha
       ]);
   } 
}  
