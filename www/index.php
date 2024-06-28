<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Database connection
    $servername = "localhost";
    $db_username = "root"; // Replace with your database username
    $db_password = ""; // Replace with your database password
    $dbname = "mydatabase"; // Replace with your database name

    $conn = new mysqli($servername, $db_username, $db_password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Sanitize input data
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);

    // Check if username or email already exists
    $check_sql = "SELECT * FROM users WHERE username='$username' OR email='$email'";
    $result = $conn->query($check_sql);

    if ($result->num_rows > 0) {
        // Username or email already exists
        $error_message = "Username or Email already exists.";
        echo '<script>
            alert("' . $error_message . '");
            window.history.back();
        </script>';
        exit();
    } else {
        // Hash the password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Insert user into database
        $sql = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$hashed_password')";

        if ($conn->query($sql) === TRUE) {
            // Return success message
            echo '<script>
                alert("Successfully signed up!");
                window.location.href = "login.html";
            </script>';
            exit();
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }

    $conn->close();
} else {
    // Redirect back to signup page if accessed directly without POST method
    header("Location: index.html");
    exit();
}
?>
