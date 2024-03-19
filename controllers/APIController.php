<?php 

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;

class APIController
 {

  public static function index()
  {
       // echo "Desde  api/servicios";
        $servicios = Servicio::all();
       //debuguear($servicios);
        echo json_encode($servicios);
  }

  public static function guardar() 
  {

  // Almacena la cita y devuelve el id  
     $cita = new Cita($_POST);
     $resultado = $cita->guardar();        

     $id = $resultado['id'];      

  // Almacena los servicios con el ID de la Cita
      $idServicios = explode(",", $_POST['servicios'] );
      foreach($idServicios as $idServicio ) {
          $args = [
            'citaId' => $id,
            'servicioId' => $idServicio
          ];
          $citaServicio = new CitaServicio($args);
          $citaServicio->guardar();              
        
      }
        // Retornamos una respuesta 
         $respuesta = [ 
           'resultado' => $resultado
         ];   
         echo json_encode($respuesta);
    }
    
     public  static function eliminar() {
        //echo "Eliminando Cita..."; 

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
           // debuguear($_SERVER);  
            $cita = Cita::find($id);
            $cita->eliminar();
            header('location:' . $_SERVER['HTTP_REFERER']);

           
        }
     }
}