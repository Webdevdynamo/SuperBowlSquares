<?php
include 'admin_auth.php';

$configFile = 'matches.json';
$config = json_decode(file_get_contents($configFile), true);

$editMatch = null;
if (isset($_GET['edit_id'])) {
    foreach ($config['active_matches'] as $m) {
        if ($m['id'] === $_GET['edit_id']) {
            $editMatch = $m;
            break;
        }
    }
}

// Handle Create or Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_match'])) {
    $title = $_POST['title'];
    $slug = strtolower(str_replace(' ', '-', $title));
    $id = $_POST['match_id'] ?: "match_" . uniqid();
    
    $matchData = [
        "id" => $id,
        "slug" => $slug,
        "title" => $title,
        "api_url" => $_POST['api_url'],
        "squares_file" => $_POST['squares_file'] ?: "data/squares_$slug.json",
        "payouts" => [
            "q1" => (int)$_POST['q1'], 
            "q2" => (int)$_POST['q2'], 
            "q3" => (int)$_POST['q3'], 
            "final" => (int)$_POST['final']
        ],
        "cost_per_square" => (int)$_POST['cost']
    ];

    $found = false;
    foreach ($config['active_matches'] as $key => $m) {
        if ($m['id'] === $id) {
            $config['active_matches'][$key] = $matchData;
            $found = true;
            break;
        }
    }

    if (!$found) {
        $config['active_matches'][] = $matchData;
        // Initialize empty squares file for new matches
        if (!file_exists($matchData['squares_file'])) {
            $empty = ["game_id" => "", "participants" => [], "grid" => []];
            file_put_contents($matchData['squares_file'], json_encode($empty));
        }
    }

    file_put_contents($configFile, json_encode($config, JSON_PRETTY_PRINT));
    header("Location: admin.php?success=1");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Match Manager</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .admin-box { background: #fff; color: #333; padding: 20px; border-radius: 8px; max-width: 700px; margin: 20px auto; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        .form-group { margin-bottom: 15px; }
        label { display: block; font-weight: bold; margin-bottom: 5px; font-size: 0.9rem; }
        input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        .payout-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .btn-main { background: #d32f2f; color: white; border: none; padding: 12px; width: 100%; border-radius: 4px; cursor: pointer; font-weight: bold; }
        .match-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #eee; }
        .btn-edit { text-decoration: none; color: #1976d2; font-weight: bold; margin-left: 10px; }
    </style>
</head>
<body style="background:#121212; color:#fff; font-family: sans-serif;">

    <div class="admin-box">
        <h2><?= $editMatch ? "Edit Match" : "Create New Match" ?></h2>
        <form method="POST">
            <input type="hidden" name="match_id" value="<?= $editMatch['id'] ?? '' ?>">
            <input type="hidden" name="squares_file" value="<?= $editMatch['squares_file'] ?? '' ?>">

            <div class="form-group">
                <label>Match Title</label>
                <input type="text" name="title" value="<?= $editMatch['title'] ?? '' ?>" placeholder="e.g. Super Bowl LIX" required>
            </div>

            <div class="form-group">
                <label>MSN API URL</label>
                <input type="text" name="api_url" value="<?= $editMatch['api_url'] ?? '' ?>" placeholder="Paste full MSN API link here" required>
            </div>

            <div class="form-group">
                <label>Quarter Payouts ($)</label>
                <div class="payout-row">
                    <input type="number" name="q1" value="<?= $editMatch['payouts']['q1'] ?? 0 ?>" placeholder="Q1">
                    <input type="number" name="q2" value="<?= $editMatch['payouts']['q2'] ?? 0 ?>" placeholder="Q2">
                    <input type="number" name="q3" value="<?= $editMatch['payouts']['q3'] ?? 0 ?>" placeholder="Q3">
                    <input type="number" name="final" value="<?= $editMatch['payouts']['final'] ?? 0 ?>" placeholder="Final">
                </div>
            </div>

            <div class="form-group">
                <label>Cost Per Square ($)</label>
                <input type="number" name="cost" value="<?= $editMatch['cost_per_square'] ?? 0 ?>">
            </div>

            <button type="submit" name="save_match" class="btn-main">
                <?= $editMatch ? "Update Match Settings" : "Create Match" ?>
            </button>
            <?php if ($editMatch): ?>
                <a href="admin.php" style="display:block; text-align:center; margin-top:10px; color:#666;">Cancel Edit</a>
            <?php endif; ?>
        </form>
    </div>

    <div class="admin-box">
        <h3>Current Active Matches</h3>
        <?php foreach ($config['active_matches'] as $m): ?>
            <div class="match-item">
                <div>
                    <strong><?= $m['title'] ?></strong><br>
                    <small style="color: #666;">$<?= $m['cost_per_square'] ?>/sq</small>
                </div>
                <div>
                    <a href="edit_grid.php?id=<?= $m['id'] ?>" class="btn-edit">Edit Grid</a>
                    <a href="admin.php?edit_id=<?= $m['id'] ?>" class="btn-edit" style="color: #388e3c;">Settings</a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

</body>
</html>