<?php
include 'admin_auth.php'; // Security first

$matchId = $_GET['id'] ?? die('No Match ID');
$config = json_decode(file_get_contents('matches.json'), true);

$match = null;
foreach ($config['active_matches'] as $m) {
    if ($m['id'] === $matchId) { $match = $m; break; }
}
if (!$match) die('Match not found');

// --- FETCH TEAM DATA FOR AXIS LABELS ---
$msnJson = file_get_contents($match['api_url']);
$msnData = json_decode($msnJson, true);
$game = $msnData['value'][0]['games'][0];

$awayTeam = null;
$homeTeam = null;
foreach ($game['participants'] as $p) {
    if ($p['homeAwayStatus'] === 'Away') $awayTeam = $p['team']['name']['rawName'];
    if ($p['homeAwayStatus'] === 'Home') $homeTeam = $p['team']['name']['rawName'];
}

$logoBase = "https://ff.spindleco.com/sbs/images/logos/";
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
        .admin-layout { max-width: 1200px; margin: 20px auto; padding: 20px; }
        .grid-wrapper { display: flex; flex-direction: column; align-items: center; }
        
        /* Specialized Admin Grid Styles */
        .admin-grid { 
            display: grid; 
            grid-template-columns: 80px repeat(10, 1fr); 
            gap: 2px; background: #444; border: 2px solid #444;
        }
        .cell { 
            width: 70px; height: 70px; background: #fff; color: #000;
            display: flex; align-items: center; justify-content: center;
            font-size: 0.7rem; cursor: pointer; text-align: center; padding: 2px;
        }
        .cell.header { background: #222; color: #fff; font-weight: bold; cursor: default; flex-direction: column; }
        .cell.occupied { background: #e8f5e9; font-weight: bold; }
        
        .axis-title-admin { 
            background: #d32f2f; color: white; padding: 10px; 
            text-align: center; font-weight: bold; width: 100%;
            display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .side-title-admin {
            writing-mode: vertical-rl; transform: rotate(180deg);
            background: #d32f2f; color: white; padding: 10px;
            display: flex; align-items: center; justify-content: center; gap: 10px;
        }
    </style>
</head>
<body style="background:#121212; color:#fff;">

<div class="admin-layout">
    <h2>Editing: <?= $match['title'] ?></h2>
    
    <div style="display: flex; gap: 20px;">
        <div class="grid-wrapper">
            <div class="axis-title-admin">
                <img src="<?= $logoBase . urlencode($awayTeam) ?> Logo.png" style="height:30px;">
                AWAY: <?= strtoupper($awayTeam) ?>
            </div>

            <div style="display: flex;">
                <div class="side-title-admin">
                    HOME: <?= strtoupper($homeTeam) ?>
                    <img src="<?= $logoBase . urlencode($homeTeam) ?> Logo.png" style="height:30px;">
                </div>

                <div class="admin-grid">
                    <div class="cell header">HOME \ AWAY</div>
                    
                    <?php for($i=0; $i<10; $i++) echo "<div class='cell header'>$i</div>"; ?>
                    
                    <?php for($h=0; $h<10; $h++): ?>
                        <div class="cell header"><?= $h ?></div>
                        <?php for($a=0; $a<10; $a++): 
                            $owner = $squaresData['grid']["$a-$h"] ?? '';
                            $class = $owner ? 'occupied' : '';
                        ?>
                            <div class="cell <?= $class ?>" onclick="selectSquare('<?= $a ?>-<?= $h ?>', '<?= addslashes($owner) ?>')">
                                <?= $owner ?>
                            </div>
                        <?php endfor; ?>
                    <?php endfor; ?>
                </div>
            </div>
        </div>

        <div class="editor-sidebar" id="edit-form" style="display:none; min-width: 300px; background:#fff; color:#333; padding:20px; border-radius:8px; height:fit-content;">
            <h3>Square <span id="display-coords"></span></h3>
            <form method="POST">
                <input type="hidden" name="coords" id="input-coords">
                <label>Existing Player:</label>
                <select onchange="document.getElementById('p-name').value = this.value" style="width:100%; padding:8px;">
                    <option value="">-- Select --</option>
                    <?php foreach($squaresData['participants'] as $p): ?>
                        <option value="<?= htmlspecialchars($p['name']) ?>"><?= $p['name'] ?></option>
                    <?php endforeach; ?>
                </select>
                <label style="display:block; margin-top:15px;">Or Name:</label>
                <input type="text" name="player_name" id="p-name" style="width:100%; padding:8px;">
                <button type="submit" name="save_sq" class="enter-btn" style="width:100%; margin-top:10px; background:#d32f2f; color:#fff; border:none; padding:10px; cursor:pointer;">Save Square</button>
            </form>
        </div>
    </div>
</div>

<script>
    function selectSquare(coords, owner) {
        document.getElementById('edit-form').style.display = 'block';
        document.getElementById('display-coords').innerText = coords;
        document.getElementById('input-coords').value = coords;
        document.getElementById('p-name').value = owner;
        document.getElementById('p-name').focus();
    }
</script>
</body>
</html>