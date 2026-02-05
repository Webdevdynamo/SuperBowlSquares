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
    <link rel="shortcut icon" type="image/png" href="./images/favicon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Live Football Squares</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header class="main-header">
            <div style="text-align: left;"><a href="index.php" style="color: #aaa; text-decoration: none; font-size: 0.8rem;">&larr; Back to Lobby</a></div>
            <h1 id="match-title">Loading Match...</h1>
            <div id="payout-summary" class="payout-summary"></div>
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
                
                <p id="mobile-swipe-hint" class="mobile-hint" style="display: none;">← Swipe squares to view →</p>
            </section>

            <aside class="sidebar">
                <h3>Participants & Payouts</h3>
                <div id="participants-list"></div>
            </aside>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>

<?php 
// If NO Match ID is provided, we show the Lobby
else: 

function formatGameTime($timeInput) {
    if (empty($timeInput)) return "Time TBD";

    try {
        // Check if the input is a millisecond timestamp (like 1770593400000)
        if (is_numeric($timeInput) && strlen($timeInput) > 10) {
            $seconds = $timeInput / 1000;
            $date = new DateTime("@$seconds"); // Create from Unix timestamp
        } else {
            // Otherwise, treat as a standard date string
            $date = new DateTime($timeInput);
        }

        // Set to Arizona Time
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
    <link rel="shortcut icon" type="image/png" href="./images/favicon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Football Squares Lobby</title>
    <link rel="stylesheet" href="style.css">
</head>
<body style="background: #121212; color: white; margin: 0; padding: 0;">
    <div class="lobby-container">
        <header class="lobby-header">
            <div class="lobby-icon">🏈</div>
            <h1>Football Square Pools</h1>
            <p>Select a game to monitor live scores & winners</p>
        </header>

        <div class="match-list">
            <?php if (empty($config['active_matches'])): ?>
                <div class="empty-state">
                    <p>No active matches found.</p>
                    <small>Check the Admin panel to activate a grid.</small>
                </div>
            <?php else: ?>
                <?php foreach ($config['active_matches'] as $match): 
                    $totalPrize = is_array($match['payouts']) ? array_sum($match['payouts']) : 0;
                ?>
                    <a href="index.php?id=<?= $match['id'] ?>" class="lobby-card">
                        <div class="card-body">
                            <div class="match-details">
                                <span class="game-date">📅 <?= formatGameTime($match['startTime'] ?? '') ?></span>
                                <h2><?= $match['title'] ?></h2>
                                <div class="match-meta-tags">
                                    <span class="meta-tag">$<?= $match['cost_per_square'] ?> / square</span>
                                    <span class="meta-tag prize">Pot: $<?= $totalPrize ?></span>
                                </div>
                            </div>
                            <div class="card-arrow">
                                <span class="view-btn">View Board</span>
                            </div>
                        </div>
                    </a>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
<?php endif; ?>