<?php
include 'admin_auth.php';
$configFile = 'matches.json';
$config = json_decode(file_get_contents($configFile), true);

// Handle New Match Creation
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['create_match'])) {
    $slug = strtolower(str_replace(' ', '-', $_POST['title']));
    $newFile = "data/squares_$slug.json";
    
    $newMatch = [
        "id" => "match_" . uniqid(),
        "slug" => $slug,
        "title" => $_POST['title'],
        "api_url" => "https://api.msn.com/sports/livegames?apikey=kO1dI4ptCTTylLkPL1ZTHYP8JhLKb8mRDoA5yotmNJ&version=1.0&cm=en-us&it=web&scn=ANON&scope=Full&ids=" . $_POST['msn_id'],
        "squares_file" => $newFile,
        "payouts" => [
            "q1" => (int)$_POST['q1'], "q2" => (int)$_POST['q2'], 
            "q3" => (int)$_POST['q3'], "final" => (int)$_POST['final']
        ],
        "cost_per_square" => (int)$_POST['cost']
    ];

    $config['active_matches'][] = $newMatch;
    file_put_contents($configFile, json_encode($config, JSON_PRETTY_PRINT));
    
    // Create the initial empty squares file
    $emptySquares = ["game_id" => $_POST['msn_id'], "participants" => [], "grid" => []];
    file_put_contents($newFile, json_encode($emptySquares));
    
    header("Location: admin.php?success=1");
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Squares Admin</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .admin-box { background: #fff; color: #333; padding: 20px; border-radius: 8px; max-width: 600px; margin: 20px auto; }
        input { width: 100%; padding: 8px; margin: 10px 0; }
        .grid-editor { display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; background: #ccc; }
        .edit-sq { width: 40px; height: 40px; background: #fff; cursor: pointer; font-size: 0.5rem; display: flex; align-items: center; justify-content: center; }
    </style>
</head>
<body style="background:#121212; color:#fff;">
    <div class="admin-box">
        <h2>Create New Match</h2>
        <form method="POST">
            <input type="text" name="title" placeholder="Game Title (e.g. Super Bowl 2026)" required>
            <input type="text" name="msn_id" placeholder="MSN Game ID (from URL)" required>
            <div style="display:flex; gap:10px;">
                <input type="number" name="q1" placeholder="Q1 Payout">
                <input type="number" name="q2" placeholder="Q2 Payout">
                <input type="number" name="q3" placeholder="Q3 Payout">
                <input type="number" name="final" placeholder="Final Payout">
            </div>
            <input type="number" name="cost" placeholder="Cost Per Square">
            <button type="submit" name="create_match" class="enter-btn" style="width:100%">Create Match & Data File</button>
        </form>
    </div>

    <div class="admin-box">
        <h2>Active Matches</h2>
        <?php foreach($config['active_matches'] as $m): ?>
            <div style="display:flex; justify-content:space-between; padding: 10px; border-bottom: 1px solid #eee;">
                <span><?= $m['title'] ?></span>
                <a href="edit_grid.php?id=<?= $m['id'] ?>">Edit Squares</a>
            </div>
        <?php endforeach; ?>
    </div>
</body>
</html>