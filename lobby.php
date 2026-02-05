<?php
$config = json_decode(file_get_contents('matches.json'), true);

// Helper function for the date (Matches your previous logic)
function formatLobbyDate($timeInput) {
    if (empty($timeInput)) return "Time TBD";
    try {
        $date = (is_numeric($timeInput) && strlen($timeInput) > 10) 
            ? new DateTime("@" . ($timeInput / 1000)) 
            : new DateTime($timeInput);
        $date->setTimezone(new DateTimeZone('America/Phoenix')); 
        return $date->format('M j, g:i A');
    } catch (Exception $e) { return "Time TBD"; }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="shortcut icon" type="image/png" href="./images/favicon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Football Squares Lobby</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .lobby-container { max-width: 700px; margin: 40px auto; padding: 0 20px; }
        
        .lobby-card {
            background: #1f1f1f; 
            color: #fff; 
            border-radius: 12px;
            padding: 0; 
            margin-bottom: 20px; 
            display: block;
            border: 1px solid #333;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            text-decoration: none;
            overflow: hidden;
        }

        .lobby-card:hover { 
            transform: translateY(-5px); 
            border-color: #ffca28;
            box-shadow: 0 8px 25px rgba(255, 204, 0, 0.15);
        }

        .card-inner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
        }

        .match-info h2 { 
            margin: 0; 
            font-size: 1.4rem; 
            color: #fff; 
            letter-spacing: -0.5px;
        }

        .match-meta { 
            font-size: 0.9rem; 
            color: #aaa; 
            margin-top: 8px; 
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .prize-tag {
            background: rgba(255, 202, 40, 0.1);
            color: #ffca28;
            padding: 4px 10px;
            border-radius: 6px;
            font-weight: bold;
            font-family: monospace;
            border: 1px solid rgba(255, 202, 40, 0.2);
        }

        .card-action { text-align: right; }

        .view-link {
            display: inline-block;
            color: #ffca28;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 1px;
            border: 1px solid #ffca28;
            padding: 8px 16px;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .lobby-card:hover .view-link {
            background: #ffca28;
            color: #000;
        }

        .game-status {
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 800;
            margin-bottom: 8px;
            display: block;
            color: #666;
        }

        .status-live { color: #d32f2f; }
    </style>
</head>
<body style="background: #121212; color: white;">
    <div class="lobby-container">
        <header style="text-align: center; margin-bottom: 50px;">
            <div style="font-size: 3rem; margin-bottom: 10px;">🏈</div>
            <h1 style="margin: 0; font-size: 2.2rem;">Square Pools</h1>
            <p style="color: #888; margin-top: 10px;">Select a match to track live scores and payouts</p>
        </header>

        <?php if (empty($config['active_matches'])): ?>
            <div style="text-align:center; padding: 40px; background: #1f1f1f; border-radius: 12px; color: #666;">
                No active pools found.
            </div>
        <?php else: ?>
            <?php foreach ($config['active_matches'] as $match): 
                $totalPrize = array_sum($match['payouts']);
            ?>
                <a href="index.php?id=<?= $match['id'] ?>" class="lobby-card">
                    <div class="card-inner">
                        <div class="match-info">
                            <span class="game-time" style="color: #666; font-size: 0.8rem; display: block; margin-bottom: 4px;">
                                📅 <?= formatLobbyDate($match['startTime'] ?? '') ?>
                            </span>
                            <h2><?= $match['title'] ?></h2>
                            <div class="match-meta">
                                <span>$<?= $match['cost_per_square'] ?> / square</span>
                                <span style="color: #444;">|</span>
                                <span class="prize-tag">TOTAL POT: $<?= $totalPrize ?></span>
                            </div>
                        </div>
                        <div class="card-action">
                            <span class="view-link">View Board</span>
                        </div>
                    </div>
                </a>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</body>
</html>