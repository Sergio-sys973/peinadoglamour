<?php

namespace Classes;

use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\PHPMailer;
use Dotenv\Dotenv as Dotenv;
$dotenv = Dotenv::createImmutable('../includes/.env');
$dotenv->safeLoad();

  class Email {

  public $nombre;
  public $email; 
  public $token;

  public function __construct($nombre, $email, $token) {
       $this->nombre = $nombre;
       $this->email = $email;      
       $this->token = $token;      
   }

  public function enviarConfirmacion() {

    // Crear el Objeto de Email

   $mail = new PHPMailer();
   $mail->isSMTP();
   //$mail->SMTPDebug = SMTP::DEBUG_SERVER;
   $mail->SMTPDebug = 2; // si estamos en desarrollo podemos utilizar para ver msgs de error
   $mail->Host = $_ENV['EMAIL_HOST'];
   $mail->SMTPAuth = true;
   $mail->Port = $_ENV['EMAIL_PORT'];
   $mail->Username = $_ENV['EMAIL_USER'];
   $mail->Password = $_ENV['EMAIL_PASS'];
   //$mail->SMTPSecure = 'tls';
   $mail->SMTPSecure = 'ssl';
       
    
       //$mail->setFrom('cuentas@appsalon.com');   
   $mail->setFrom('detallesstp@gmail.com', 'appbellezamvc.domcloud.dev');
      // $mail->setFrom('appsalon@stpasociados.com', 'bellezaconclasemvc.domcloud.dev');
      // $mail->addAddress('cuentas@appsalon.com', 'Appsalon.com');
   $mail->addAddress($this->email);
       //debuguear($mail);
   $mail->Subject = "Confirma tu Cuenta";

   // Set HTML - Contenido
   $mail->isHTML(TRUE);
   $mail->CharSet = 'UTF-8';

   $contenido = "<html>";
   $contenido .= "<p><strong>Hola " . $this->nombre . "</strong> Has creado tu Cuenta en Appsalon, solo debe confirmarla presionando el siguiente enlace</p>";
   $contenido .= "<p>Presiona aqui: <a href='" . $_ENV['APP_URL'] . "/confirmar-cuenta?token=" . $this->token . "'>Confirmar Cuenta</a> </p>";
   $contenido .= "<p> Si tu no solcitaste esta cuenta puedes ignorar el mensaje </p>";
   $contenido .= "</html>";
   $mail->Body = $contenido;

   // Enviar el email

   $mail->send();

  }  

  public function enviarInstrucciones() {

    // Crear el Objeto de Email

   $mail = new PHPMailer();
   $mail->isSMTP();
   $mail->Host = $_ENV['EMAIL_HOST'];
   $mail->SMTPAuth = true;
   $mail->Port = $_ENV['EMAIL_PORT'];
   $mail->Username = $_ENV['EMAIL_USER'];
   $mail->Password = $_ENV['EMAIL_PASS'];
   $mail->SMTPSecure = 'tls';    
    
         // $mail->setFrom('cuentas@appsalon.com');  
        // $mail->setFrom('appsalon@stpasociados.com');  
   $mail->setFrom('detallesstp@gmail.com');  

      // $mail->setFrom('cuentas@appsalon.com', 'AppSalon.com');
      //$mail->addAddress('cuentas@appsalon.com', 'Appsalon.com');
   $mail->addAddress($this->email);
       // debuguear($mail);
   $mail->Subject = "Reestablece tu Password";

   // Set HTML

   $mail->isHTML(TRUE);
   $mail->CharSet = 'UTF-8';

   $contenido = "<html>";
   $contenido .= "<p><strong>Hola " . $this->nombre . "</strong> Has solicitado Reestablecer tu Password, sigue el siguiente enlace para hacerlo</p>";
   $contenido .= "<p>Presiona aqui: <a href='" . $_ENV['APP_URL'] . "/recuperar?token=" . $this->token . "'>Reestablecer Password</a> </p>";
   $contenido .= "<p> Si tu no solicitaste este cambio  puedes ignorar el mensaje </p>";
   $contenido .= "</html>";
   $mail->Body = $contenido;

   // Enviar el email
      
   $mail->send();   

  }

}

