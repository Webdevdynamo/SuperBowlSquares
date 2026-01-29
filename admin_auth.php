<?php
session_start();
$ADMIN_PASSWORD = "mest1234"; // CHANGE THIS

if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: index.php");
    exit;
}

if (!isset($_SESSION['logged_in'])) {
    if (isset($_POST['pass']) && $_POST['pass'] === $ADMIN_PASSWORD) {
        $_SESSION['logged_in'] = true;
    } else {
        ?>
        <body style="background:#121212; color:#fff; font-family:sans-serif; text-align:center; padding-top:100px;">
            <form method="POST">
                <h2>Admin Access</h2>
                <input type="password" name="pass" style="padding:10px; border-radius:5px; border:none;">
                <button type="submit" style="padding:10px 20px; background:#d32f2f; color:#fff; border:none; border-radius:5px; cursor:pointer;">Login</button>
            </form>
        </body>
        <?php
        exit;
    }
}
?>