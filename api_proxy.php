<?php
header('Content-Type: application/json');

$matchId = $_GET['id'] ?? 'match_01';
$config = json_decode(file_get_contents('matches.json'), true);

// 1. Find the Match Config
$match = null;
foreach ($config['active_matches'] as $m) {
    if ($m['id'] === $matchId) { $match = $m; break; }
}

if (!$match) {
    echo json_encode(['error' => 'Match not found']);
    exit;
}

// 2. Fetch Live Score from MSN
$msnJson = file_get_contents($match['api_url']);
$msnData = json_decode($msnJson, true);
$game = $msnData['value'][0]['games'][0];

// 3. Process Quarter Scores
$processedTeams = [];
foreach ($game['participants'] as $p) {
    $qScores = [0, 0, 0, 0];
    $total = 0;
    foreach ($p['playingPeriodScores'] as $period) {
        $num = (int)$period['playingPeriod']['number'];
        if ($num <= 4) {
            $total += (int)$period['score'];
            $qScores[$num - 1] = $total;
        }
    }
    $processedTeams[] = [
        'fullName'  => $p['team']['name']['rawName'],
        'shortName' => $p['team']['shortName']['rawName'],
        'total'     => (int)$p['result']['score'],
        'quarters'  => $qScores,
        'homeAway'  => $p['homeAwayStatus']
    ];
}

// 4. Fetch the Squares for THIS specific match
$squaresData = json_decode(file_get_contents($match['squares_file']), true);

// 5. Send everything to the JS
echo json_encode([
    'settings' => [
        'title' => $match['title'],
        'payouts' => $match['payouts']
    ],
    'teams' => $processedTeams,
    'status' => $game['gameState']['detailedGameStatus'],
    'squares' => $squaresData
]);