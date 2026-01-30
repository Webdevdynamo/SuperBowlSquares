<?php
/**
 * Football Squares - Master Admin Dashboard
 * Handles Creating, Editing, and Deleting Match Configurations
 */
include 'admin_auth.php'; // Ensures session-based password protection

$configFile = 'matches.json';

// Initialize config if file doesn't exist
if (!file_exists($configFile)) {
    file_put_contents($configFile, json_encode(["active_matches" => []]));
}

$config = json_decode(file_get_contents($configFile), true);

// --- 1. HANDLE DELETE ACTION ---
if (isset($_GET['delete_id'])) {
    $idToDelete = $_GET['delete_id'];
    $config['active_matches'] = array_filter($config['active_matches'], function($m) use ($idToDelete) {
        return $m['id'] !== $idToDelete;
    });
    // Re-index array for clean JSON output
    $config['active_matches'] = array_values($config['active_matches']);
    file_put_contents($configFile, json_encode($config, JSON_PRETTY_PRINT));
    header("Location: admin.php?msg=deleted");
    exit;
}

// --- 2. PRE-FILL FORM FOR EDIT MODE ---
$editMatch = null;
if (isset($_GET['edit_id'])) {
    foreach ($config['active_matches'] as $m) {
        if ($m['id'] === $_GET['edit_id']) {
            $editMatch = $m;
            break;
        }
    }
}

// --- 3. HANDLE SAVE (CREATE OR UPDATE) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_match'])) {
    $title = trim($_POST['title']);
    $slug = strtolower(str_replace(' ', '-', $title));
    
    // If we are editing, keep the old ID; otherwise, generate a new one
    $id = !empty($_POST['match_id']) ? $_POST['match_id'] : "match_" . uniqid();
    
    // Determine the squares file path
    $squaresFile = !empty($_POST['squares_file']) ? $_POST['squares_file'] : "data/squares_$slug.json";

    $matchData = [
        "id" => $id,
        "slug" => $slug,
        "title" => $title,
        "api_url" => trim($_POST['api_url']),
        "squares_file" => $squaresFile,
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
        // Create the data folder if it doesn't exist
        if (!is_dir('data')) mkdir('data', 0777, true);
        // Initialize an empty squares file for new matches
        if (!file_exists($squaresFile)) {
            $empty = ["game_id" => "", "participants" => [], "grid" => []];
            file_put_contents($squaresFile, json_encode($empty, JSON_PRETTY_PRINT));
        }
    }

    file_put_contents($configFile, json_encode($config, JSON_PRETTY_PRINT));
    header("Location: admin.php?msg=saved");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Match Administration</title>
    <link rel="stylesheet" href="style.css">
    <style>
        body { font-family: sans-serif; background: #121212; color: #fff; padding: 20px; }
        .admin-container { max-width: 800px; margin: 0 auto; }
        .card { background: #fff; color: #333; padding: 25px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
        .card h2, .card h3 { margin-top: 0; color: #121212; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        
        .form-group { margin-bottom: 15px; }
        label { display: block; font-weight: bold; margin-bottom: 5px; font-size: 0.85rem; text-transform: uppercase; color: #666; }
        input[type="text"], input[type="number"], input[type="url"] { 
            width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; font-size: 1rem;
        }
        
        .payout-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        
        .btn { border: none; padding: 12px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .btn-primary { background: #d32f2f; color: white; width: 100%; font-size: 1.1rem; }
        .btn-primary:hover { background: #b71c1c; }
        
        .match-list-item { 
            display: flex; justify-content: space-between; align-items: center; 
            padding: 15px; border-bottom: 1px solid #eee; 
        }
        .match-list-item:last-child { border-bottom: none; }
        .actions { display: flex; gap: 15px; align-items: center; }
        .actions a { text-decoration: none; font-size: 0.9rem; font-weight: bold; }
        .link-grid { color: #1976d2; }
        .link-edit { color: #388e3c; }
        .link-delete { color: #d32f2f; font-size: 1.4rem !important; line-height: 0; }
        
        .alert { padding: 10px; border-radius: 6px; margin-bottom: 20px; text-align: center; font-weight: bold; }
        .alert-success { background: #e8f5e9; color: #2e7d32; }
    </style>
</head>
<body>

<div class="admin-container">
    
    <div style="display:flex; justify-content: space-between; align-items: center;">
        <h1>🛡️ Square Manager</h1>
        <a href="index.php" style="color:#aaa; text-decoration:none;">View Lobby &rarr;</a>
    </div>

    <?php if (isset($_GET['msg'])): ?>
        <div class="alert alert-success">
            <?= $_GET['msg'] === 'saved' ? 'Match settings updated successfully!' : 'Match deleted.' ?>
        </div>
    <?php endif; ?>

    <div class="card">
        <h2><?= $editMatch ? "Edit Match Settings" : "Add New Match" ?></h2>
        <form method="POST">
            <input type="hidden" name="match_id" value="<?= $editMatch['id'] ?? '' ?>">
            <input type="hidden" name="squares_file" value="<?= $editMatch['squares_file'] ?? '' ?>">

            <div class="form-group">
                <label>Match Title</label>
                <input type="text" name="title" value="<?= htmlspecialchars($editMatch['title'] ?? '') ?>" placeholder="e.g. AFC Championship - Chiefs vs Bengals" required>
            </div>

            <div class="form-group">
                <label>MSN API URL (Live Game Endpoint)</label>
                <input type="text" name="api_url" value="<?= htmlspecialchars($editMatch['api_url'] ?? '') ?>" placeholder="https://api.msn.com/sports/livegames?..." required>
            </div>

            <div class="payout-grid">
                <div class="form-group">
                    <label>Q1 Payout</label>
                    <input type="number" name="q1" value="<?= $editMatch['payouts']['q1'] ?? 0 ?>">
                </div>
                <div class="form-group">
                    <label>Q2 Payout</label>
                    <input type="number" name="q2" value="<?= $editMatch['payouts']['q2'] ?? 0 ?>">
                </div>
                <div class="form-group">
                    <label>Q3 Payout</label>
                    <input type="number" name="q3" value="<?= $editMatch['payouts']['q3'] ?? 0 ?>">
                </div>
                <div class="form-group">
                    <label>Final Payout</label>
                    <input type="number" name="final" value="<?= $editMatch['payouts']['final'] ?? 0 ?>">
                </div>
            </div>

            <div class="form-group">
                <label>Cost Per Square ($)</label>
                <input type="number" name="cost" value="<?= $editMatch['cost_per_square'] ?? 0 ?>">
            </div>

            <button type="submit" name="save_match" class="btn btn-primary">
                <?= $editMatch ? "Save Changes" : "Create Match Pool" ?>
            </button>

            <?php if ($editMatch): ?>
                <div style="text-align:center; margin-top:15px;">
                    <a href="admin.php" style="color:#999; text-decoration:none;">Cancel Editing</a>
                </div>
            <?php endif; ?>
        </form>
    </div>

    <div class="card">
        <h3>Active Match Pools</h3>
        <?php if (empty($config['active_matches'])): ?>
            <p style="color:#999; text-align:center;">No matches created yet.</p>
        <?php else: ?>
            <?php foreach ($config['active_matches'] as $m): ?>
                <div class="match-list-item">
                    <div>
                        <strong style="display:block; font-size:1.1rem;"><?= htmlspecialchars($m['title']) ?></strong>
                        <span style="color:#888; font-size:0.8rem;">$<?= $m['cost_per_square'] ?> per square</span>
                    </div>
                    <div class="actions">
                        <a href="edit_grid.php?id=<?= $m['id'] ?>" class="link-grid">Grid</a>
                        <a href="admin.php?edit_id=<?= $m['id'] ?>" class="link-edit">Settings</a>
                        <a href="admin.php?delete_id=<?= $m['id'] ?>" 
                           class="link-delete" 
                           onclick="return confirm('WARNING: Are you sure you want to delete this match? This cannot be undone.')"
                           title="Delete Match">&times;</a>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>

</div>

</body>
</html>