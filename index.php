<?php
$config = json_decode(file_get_contents('matches.json'), true);
$matchId = $_GET['id'] ?? null;

// If a Match ID is provided, we show the Match Viewer
if ($matchId): 
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Live Football Squares</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header class="main-header">
            <div style="text-align: left;"><a href="index.php" style="color: #aaa; text-decoration: none; font-size: 0.8rem;">&larr; Back to Lobby</a></div>
            <h1 id="match-title">Loading Match...</h1>
            <div id="box-score-container">
                <table class="box-score-table">
                    <thead>
                        <tr><th>Team</th><th>1</th><th>2</th><th>3</th><th>4/F</th><th class="final-col">Total</th></tr>
                    </thead>
                    <tbody id="box-score-body"></tbody>
                </table>
            </div>
        </header>

        <div class="content-wrapper">
            <section class="grid-section">
                <div class="axis-label top-label"></div>
                
                <div class="main-grid-area">
                    <div class="axis-label left-label"></div>

                    <div class="scroll-container">
                        <div id="squares-grid"></div>
                    </div>
                </div>
                
                <p class="mobile-hint">← Swipe squares to view →</p>
            </section>

            <aside class="sidebar">
                <h3>Participants & Payouts</h3>
                <div id="payout-list"></div>
            </aside>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>

<?php 
// If NO Match ID is provided, we show the Lobby
else: 

function formatGameTime($utcString) {
    if (empty($utcString)) return "Time TBD";
    try {
        $date = new DateTime($utcString);
        // Using America/Phoenix for Prescott, AZ
        $date->setTimezone(new DateTimeZone('America/Phoenix')); 
        return $date->format('M j, g:i A');
    } catch (Exception $e) {
        return "Time TBD";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Football Squares Lobby</title>
    <link rel="stylesheet" href="style.css">
</head>
<body style="background: #121212; color: white;">
    <div class="lobby-container" style="max-width: 800px; margin: 40px auto; padding: 0 20px;">
        <header style="text-align: center; margin-bottom: 40px;">
            <h1>🏈 Football Square Pools</h1>
            <p>Select a game to monitor live scores</p>
        </header>

        <?php if (empty($config['active_matches'])): ?>
            <p style="text-align:center;">No active matches found. Check the Admin panel.</p>
        <?php else: ?>
            <?php foreach ($config['active_matches'] as $match): ?>
                <a href="index.php?id=<?= $match['id'] ?>" class="match-card" style="text-decoration: none; color: inherit;">
                    <div class="match-info">
                        <h2><?= $match['title'] ?></h2>
                        <div class="match-meta" style="color:#888; font-size: 0.9rem;">
                            <span class="game-time">📅 <?= formatGameTime($match['startTime'] ?? '') ?></span> | $<?= $match['cost_per_square'] ?> / square | 
                            Prize Pool: $<?= array_sum($match['payouts']) ?>
                        </div>
                    </div>
                    <div class="enter-btn">View Board</div>
                </a>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</body>
</html>
<?php endif; ?>