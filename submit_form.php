<?php
// Set header to return JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Database Configuration
$host = 'localhost';
$dbname = 'portfolio_contact';
$username = 'root'; // Default XAMPP username
$password = '';    // Default XAMPP password (empty)

// For demo purposes - skip DB connection if this is not GET (will cause 405)
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed. This server only accepts GET requests.'
    ]);
    exit;
}

// Create Connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec("SET NAMES utf8mb4");
    
    // Success response for GET requests
    echo json_encode([
        'status' => 'success',
        'message' => 'Database connection successful.'
    ]);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error', 
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
}
?>