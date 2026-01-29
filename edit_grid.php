<?php
include 'admin_auth.php';
$matchId = $_GET['id'] ?? die('No Match ID');
$config = json_decode(file_get_contents('matches.json'), true);

$match = null;
foreach ($config['active_matches'] as $m) {
    if ($m['id'] === $matchId) { $match = $m; break; }
}
if (!$match) die('Match not found');

$squaresData = json_decode(file_get_contents($match['squares_file']), true);

// Handle Save Logic
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_sq'])) {
    $coords = $_POST['coords'];
    $name = trim($_POST['player_name']);
    
    // Update Grid
    if (empty($name)) {
        unset($squaresData['grid'][$coords]);
    } else {
        $squaresData['grid'][$coords] = $name;
    }

    // Rebuild Participants Count from scratch to ensure accuracy
    $counts = array_count_values($squaresData['grid']);
    $newParticipants = [];
    foreach ($counts as $pName => $count) {
        $newParticipants[] = ["name" => $pName, "count" => $count];
    }
    $squaresData['participants'] = $newParticipants;

    file_put_contents($match['squares_file'], json_encode($squaresData, JSON_PRETTY_PRINT));
    header("Location: edit_grid.php?id=$matchId");
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Edit Grid - <?= $match['title'] ?></title>
    <link rel="stylesheet" href="style.css">
    <style>
        .edit-container { max-width: 900px; margin: 20px auto; display: flex; gap: 20px; }
        .grid-editor { 
            display: grid; 
            grid-template-columns: repeat(11, 1fr); 
            gap: 2px; background: #444; border: 2px solid #444;
        }
        .cell { 
            width: 60px; height: 60px; background: #fff; color: #000;
            display: flex; align-items: center; justify-content: center;
            font-size: 0.7rem; cursor: pointer; text-align: center;
        }
        .cell:hover { background: #eee; }
        .cell.header { background: #222; color: #fff; font-weight: bold; cursor: default; }
        .editor-sidebar { background: #fff; color: #333; padding: 20px; border-radius: 8px; flex: 1; }
    </style>
</head>
<body style="background:#121212; color:#fff;">
    <div class="edit-container">
        <div class="grid-editor">
            <div class="cell header">H \ A</div>
            <?php for($i=0; $i<10; $i++) echo "<div class='cell header'>$i</div>"; ?>
            
            <?php for($h=0; $h<10; $h++): ?>
                <div class="cell header"><?= $h ?></div>
                <?php for($a=0; $a<10; $a++): 
                    $owner = $squaresData['grid']["$a-$h"] ?? ''; ?>
                    <div class="cell" onclick="selectSquare('<?= $a ?>-<?= $h ?>', '<?= addslashes($owner) ?>')">
                        <?= $owner ?>
                    </div>
                <?php endfor; ?>
            <?php endfor; ?>
        </div>

        <div class="editor-sidebar" id="edit-form" style="display:none;">
            <h3>Square <span id="display-coords"></span></h3>
            <form method="POST">
                <input type="hidden" name="coords" id="input-coords">
                
                <label>Existing Player:</label>
                <select onchange="document.getElementById('p-name').value = this.value">
                    <option value="">-- Select --</option>
                    <?php foreach($squaresData['participants'] as $p): ?>
                        <option value="<?= htmlspecialchars($p['name']) ?>"><?= $p['name'] ?></option>
                    <?php endforeach; ?>
                </select>

                <label style="display:block; margin-top:15px;">Or New Name:</label>
                <input type="text" name="player_name" id="p-name" placeholder="Name">
                
                <button type="submit" name="save_sq" class="enter-btn" style="width:100%; margin-top:10px;">Save Square</button>
                <button type="button" onclick="document.getElementById('edit-form').style.display='none'" style="width:100%; margin-top:5px;">Cancel</button>
            </form>
        </div>
    </div>

    <script>
        function selectSquare(coords, owner) {
            document.getElementById('edit-form').style.display = 'block';
            document.getElementById('display-coords').innerText = coords;
            document.getElementById('input-coords').value = coords;
            document.getElementById('p-name').value = owner;
        }
    </script>
</body>
</html>