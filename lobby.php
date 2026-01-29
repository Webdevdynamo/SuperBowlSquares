<?php
$config = json_decode(file_get_contents('matches.json'), true);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Football Squares Lobby</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .lobby-container { max-width: 800px; margin: 40px auto; padding: 0 20px; }
        .match-card {
            background: #fff; color: #333; border-radius: 12px;
            padding: 20px; margin-bottom: 20px; display: flex;
            justify-content: space-between; align-items: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: transform 0.2s; text-decoration: none;
        }
        .match-card:hover { transform: translateY(-5px); }
        .match-info h2 { margin: 0; font-size: 1.25rem; color: #222; }
        .match-meta { font-size: 0.9rem; color: #666; margin-top: 5px; }
        .enter-btn {
            background: #d32f2f; color: white; padding: 10px 20px;
            border-radius: 6px; font-weight: bold;
        }
    </style>
</head>
<body style="background: #121212; color: white;">
    <div class="lobby-container">
        <header style="text-align: center; margin-bottom: 40px;">
            <h1>🏈 Active Square Pools</h1>
            <p>Select a game to view live scores and winners</p>
        </header>

        <?php foreach ($config['active_matches'] as $match): ?>
            <a href="index.html?id=<?= $match['id'] ?>" class="match-card">
                <div class="match-info">
                    <h2><?= $match['title'] ?></h2>
                    <div class="match-meta">
                        $<?= $match['cost_per_square'] ?> per square | 
                        Total Prize: $<?= array_sum($match['payouts']) ?>
                    </div>
                </div>
                <div class="enter-btn">View Board</div>
            </a>
        <?php endforeach; ?>
    </div>
</body>
</html>