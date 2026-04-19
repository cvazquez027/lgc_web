<?php
// [SEO OPTIMIZATION] Mantenimiento de la lógica de procesamiento seguro para leads de la Landing Page
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Método no permitido."]);
    exit;
}

require 'vendor/autoload.php'; 

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

try {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error de configuración del servidor."]);
    exit;
}

function clean_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

$nombre      = isset($_POST['nombre']) ? clean_input($_POST['nombre']) : '';
$apellido    = isset($_POST['apellido']) ? clean_input($_POST['apellido']) : '';
$email       = isset($_POST['email']) ? filter_var(clean_input($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$telefono    = isset($_POST['telefono']) ? clean_input($_POST['telefono']) : '';
$servicio    = isset($_POST['servicio']) ? clean_input($_POST['servicio']) : 'No especificado';
$rubro       = isset($_POST['rubro']) ? clean_input($_POST['rubro']) : 'No especificado';
$preferencia = isset($_POST['preferencia']) ? clean_input($_POST['preferencia']) : 'mail';
$consulta    = isset($_POST['consulta']) ? clean_input($_POST['consulta']) : '';

if (empty($nombre) || empty($apellido) || empty($email) || empty($telefono) || empty($consulta)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Faltan campos obligatorios."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Formato de email inválido."]);
    exit;
}

$recaptcha_secret = $_ENV['RECAPTCHA_SECRET'] ?? '';
$recaptcha_response = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '';

if(empty($recaptcha_response)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Por favor, verificá el captcha."]);
    exit;
}

$verify_response = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.$recaptcha_secret.'&response='.$recaptcha_response);
$response_data = json_decode($verify_response);

if (!$response_data->success) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Validación de reCAPTCHA fallida. Sospecha de bot."]);
    exit;
}

$servicios_nombres = [
    'matrices' => 'Sistemas de Matrices Legales',
    'impacto' => 'Impacto Ambiental',
    'seguridad' => 'Seguridad e Higiene',
    'habilitaciones' => 'Habilitaciones'
];
$servicio_legible = isset($servicios_nombres[$servicio]) ? $servicios_nombres[$servicio] : $servicio;

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = $_ENV['SMTP_HOST']; 
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV['SMTP_USER'];  
    $mail->Password   = $_ENV['SMTP_PASS']; 
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; 
    $mail->Port       = $_ENV['SMTP_PORT']; 

    $mail->setFrom($_ENV['SMTP_USER'], 'LGC Landing Page'); 
    $mail->addAddress($_ENV['SMTP_USER'], 'Lamas Global Consulting'); 
    $mail->addReplyTo($email, "$nombre $apellido"); 

    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = "Nuevo Lead LGC: $servicio_legible - $nombre $apellido";
    
    $htmlBody = "
    <div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-top: 4px solid #007FA1; padding: 20px;'>
        <h2 style='color: #004d61; margin-top: 0;'>Nueva Consulta desde la Web LGC</h2>
        <p>Has recibido un nuevo contacto. Aquí están los detalles:</p>
        <table style='width: 100%; border-collapse: collapse; margin-top: 15px;'>
            <tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Nombre:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>$nombre $apellido</td></tr>
            <tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Email:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'><a href='mailto:$email'>$email</a></td></tr>
            <tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Teléfono:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>$telefono</td></tr>
            <tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Empresa/Rubro:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>$rubro</td></tr>
            <tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Servicio de Interés:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>$servicio_legible</td></tr>
            <tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Prefiere contacto por:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee; text-transform: capitalize;'>$preferencia</td></tr>
        </table>
        <h3 style='color: #004d61; margin-top: 20px;'>Consulta del cliente:</h3>
        <div style='background-color: #f9f9f9; padding: 15px; border-left: 4px solid #90A224; font-style: italic;'>
            " . nl2br($consulta) . "
        </div>
        <p style='font-size: 12px; color: #999; margin-top: 30px; text-align: center;'>Este mensaje fue enviado automáticamente desde la Landing Page de Lamas Global Consulting.</p>
    </div>";

    $mail->Body = $htmlBody;
    $mail->AltBody = "Nuevo Lead: $nombre $apellido\nEmail: $email\nTeléfono: $telefono\nRubro: $rubro\nServicio: $servicio_legible\nPreferencia: $preferencia\nConsulta:\n$consulta";

    $mail->send();

    $google_webhook_url = $_ENV['WEBHOOK_URL'] ?? ''; 

    if (!empty($google_webhook_url)) {
        $post_data = [
            'nombre' => $nombre,
            'apellido' => $apellido,
            'email' => $email,
            'telefono' => $telefono,
            'servicio' => $servicio_legible,
            'rubro' => $rubro,
            'preferencia' => $preferencia,
            'consulta' => $consulta
        ];

        $ch = curl_init($google_webhook_url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data)); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); 
        curl_setopt($ch, CURLOPT_TIMEOUT, 5); 
        curl_exec($ch);
        curl_close($ch);
    }

    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Consulta enviada y registrada correctamente."]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error al enviar el correo."]);
}
?>