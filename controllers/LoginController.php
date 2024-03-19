<?php

namespace Controllers;

use MVC\Router;  
use Classes\Email;
use Model\Usuario;

class LoginController { 
        public static function login(Router $router) {  
        $alertas = []; 

       $auth = new Usuario; 

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
             // echo "Desde Post";  
              $auth = new Usuario($_POST);    
              $alertas = $auth->validarLogin();  
             //debuguear($auth);  
             if(empty($alertas)) {
               //Comprobar que exista el Usuario
              // echo "Usuario Agrego Tanto Email como Password";
              $usuario = Usuario::where('email', $auth->email);
             // debuguear($usuario);

              if($usuario) {
                  // Verificar el Password
               if(  $usuario->comprobarPasswordAndVerificado($auth->password) ) {

                        // Autenticar el Usuario
                       // session_start();
                       iniciarSession();

                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre . " " . $usuario->apellido;
                        $_SESSION['email'] = $usuario->email;
                        $_SESSION['login'] = true;

                          // debuguear($_SESSION);

                        // Redireccionamiento
                        if($usuario->admin === "1") {
                           //debuguear('ES admin');
                           $_SESSION['admin'] = $usuario->admin  ?? null;
                           
                           header('Location: /admin');
                        } else {
                          // debuguear('Es Cliente');
                          header('Location: /cita');
                        }
                        //debuguear($_SESSION);
                     }                     
                                        
               } else {             
                  Usuario::setAlerta('error', 'Usuario no Encontrado');
              }           
           }
      }

       $alertas = Usuario::getAlertas();
       $router->render('auth/login', [ 
         'alertas' => $alertas,
         'auth' => $auth

       ]); 
  }

   public static function logout(Router $router) {     
     // echo "Desde Logout";
     iniciarSession();
     //session_start();
    // debuguear($_SESSION);
     $_SESSION = [];
    // debuguear($_SESSION);   
    header('location: /');
}
   public static function olvide(Router $router) {    
   //echo "Desde Olvide";
           $alertas = [];

   if($_SERVER['REQUEST_METHOD'] === 'POST')   {

      $auth = new Usuario($_POST);
      $alertas = $auth->validarEmail();

      if(empty($alertas)) {
         $usuario = Usuario::where('email', $auth->email);

         //debuguear($usuario);

         if($usuario && $usuario->confirmado === "1")  {
            //debuguear('Si Existe y esta Confirmado');
            // Generar un Token
           $usuario->crearToken();            
           $usuario->guardar();
          // debuguear($usuario);

          //Enviar el email
          $email = new Email($usuario->nombre, $usuario->email, $usuario->token);
          $email->enviarInstrucciones();

          //Alerta Exito            

          Usuario::setAlerta('exito', 'Revisa tu email');
         } else {
            Usuario::setAlerta('error', 'El Usuario No Existe o no Confirmado');
         }   
      }
   }

   $alertas = Usuario::getAlertas();
   $router->render('auth/olvide-password', [
         'alertas' => $alertas
   ]);

}  
  
  public static function recuperar(Router $router) {
    //    echo "Desde Recuperar";
      $alertas = [];
      $error = false;

      $token = s($_GET['token']);
       // debuguear($token);
      
      // Buscar Usuario por su token
      $usuario = Usuario::where('token', $token);

      if(empty($usuario)) {
         Usuario::setAlerta('error', 'Token No Valido');
         $error = true;
      }

      if($_SERVER['REQUEST_METHOD'] === 'POST') {

         // Leer el Nvo Password y Guardarlo.         
         $password = new Usuario($_POST);
         $alertas = $password->validarPassword();
         if(empty($alertas)) {
            $usuario->password = null;
            $usuario->password = $password->password;
            $usuario->hashPassword();
           // $usuario->token = null;
            $usuario->token = '';
            $resultado = $usuario->guardar();
            //debuguear($usuario);
            if($resultado) {
               header('Location: /');
            }
         }         
      }
      
      $alertas = Usuario::getAlertas();
       $router->render('auth/recuperar-password',  [
         'alertas' => $alertas,
         'error' => $error

       ]);
    }

   public static function crear(Router $router) {      
      $usuario = new Usuario;  

       // Alertas Vacias     
       $alertas = [];
      if($_SERVER['REQUEST_METHOD'] === 'POST') {                    
          $usuario->sincronizar($_POST);
         //  debuguear($usuario); // antes del token
          $alertas = $usuario->validarNuevaCuenta();
         
         // Revisar que Alertas este Vacio
         if(empty($alertas)) {
            //echo "Pasaste la Validacion";

            //Verificar que el Usuario no este Registrado
           $resultado = $usuario->existeUsuario();

            if ($resultado->num_rows) {
                  $alertas = Usuario::getAlertas();
                  // debuguear($alertas);
            } else {                           
                
               // Hashear el Password
               $usuario->hashPassword();
               // Generar un Token Unico
               $usuario->crearToken();

               // Enviar el email
               $email = new Email($usuario->nombre, $usuario->email, $usuario->token);
              // debuguear($email);
               $email->enviarConfirmacion();

              //debuguear($usuario);  // esto nos da la instancia del modelo de usuario

               //**********************//
               // Crear el Usuario  **//
               //*********************//
                 $resultado = $usuario->guardar();                           
                //debuguear($usuario);        
                 If($resultado) {
                 //echo "guardado Correctamente";
                  header('Location: /mensaje');
               }             
                 
            }
         }
     }
      
      //echo "Desde Crear"; 
      $router->render('auth/crear-cuenta', [
         'usuario' => $usuario,
         'alertas' => $alertas        
      ]);
   }

   public static function mensaje(Router $router) {

      $router->render('auth/mensaje');
   }

  public static function confirmar(Router $router) {
        $alertas = [];
      // Sanitizar y Leer token dsd la URL
        $token = s($_GET['token']);   
          // debuguear($token);  

        $usuario = Usuario::where('token', $token);
       // Usuario::where('token', '656c965c473d0');
             //  debuguear($usuario);
            if(empty($usuario)) {            
                // Mostrar Mensaje de error   
                //echo "'Token No Valido...";             
            Usuario::setAlerta('error', 'Token No Valido');
      } else {
               //Modificar  a Usuario  Confirmado
              // echo "'Token Valido  Confirmando Usuario...";

             //cambiar valor de columna a  confirmado   
              $usuario->confirmado = '1';                             
             //eliminar token
              $usuario->token = '';
               // debuguear($usuario); 

            //*********************/
            //Guardar y Actualizar 
           //******************* */ 
             $usuario->guardar();   
            //mostrar mensaje de exito
           Usuario::setAlerta('exito', 'Cuenta Comprobada Correctamente');
      }

      // Obtener Alertas 
     $alertas = Usuario::getAlertas();

      //Renderizar la Vista
      $router->render('auth/confirmar-cuenta',  [
            'alertas'=>$alertas
      ]);
   }

}
 
