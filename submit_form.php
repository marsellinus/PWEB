<?php
// Enable error reporting for debugging but don't show in output
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set headers for JSON response
header('Content-Type: application/json');

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed. Please use POST method.'
    ]);
    exit;
}

// Check if required fields are present
$requiredFields = ['fullName', 'email', 'phone', 'message'];
$missingFields = [];

foreach ($requiredFields as $field) {
    if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
        $missingFields[] = $field;
    }
}

if (!empty($missingFields)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields: ' . implode(', ', $missingFields)
    ]);
    exit;
}

// Sanitize inputs - Use modern sanitization techniques instead of deprecated FILTER_SANITIZE_STRING
$fullName = htmlspecialchars(trim($_POST['fullName']), ENT_QUOTES, 'UTF-8');
$email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars(trim($_POST['phone']), ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars(trim($_POST['message']), ENT_QUOTES, 'UTF-8');

// Database connection
$servername = "localhost";
$username = "root";
$password = ""; // Default XAMPP password is empty
$dbname = "pweb_db"; // Using pweb_db as requested

// Create connection with error handling
try {
    $conn = new mysqli($servername, $username, $password);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Check if database exists, if not create it
    $result = $conn->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$dbname'");
    if ($result->num_rows == 0) {
        if (!$conn->query("CREATE DATABASE IF NOT EXISTS $dbname")) {
            throw new Exception("Error creating database: " . $conn->error);
        }
    }
    
    // Select the database
    $conn->select_db($dbname);
    
    // Check if table exists, if not create it
    $result = $conn->query("SHOW TABLES LIKE 'contact_messages'");
    if ($result->num_rows == 0) {
        $sql = "CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            message TEXT NOT NULL,
            submission_date DATETIME NOT NULL
        )";
        
        if (!$conn->query($sql)) {
            throw new Exception("Error creating table: " . $conn->error);
        }
    }

    // Prepare and bind statement to prevent SQL injection
    $stmt = $conn->prepare("INSERT INTO contact_messages (full_name, email, phone, message, submission_date) VALUES (?, ?, ?, ?, NOW())");
    if (!$stmt) {
        throw new Exception("Prepare statement failed: " . $conn->error);
    }

    $stmt->bind_param("ssss", $fullName, $email, $phone, $message);
    
    // Execute the statement
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    // Success response
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you for your message. We will contact you soon!'
    ]);

    // Close statement and connection
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
    
    // Close connection if it exists
    if (isset($conn)) {
        $conn->close();
    }
}
?>