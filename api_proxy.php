<?php
header('Content-Type: application/json');

$matchId = $_GET['id'] ?? 'match_01';
$config = json_decode(file_get_contents('matches.json'), true);

$match = null;
foreach ($config['active_matches'] as $m) {
    if ($m['id'] === $matchId) { $match = $m; break; }
}

if (!$match) {
    echo json_encode(['error' => 'Match not found']);
    exit;
}

// Fetch Live Score
$msnJson = file_get_contents($match['api_url']);
$msnData = json_decode($msnJson, true);

// Extract the numeric quarter (e.g., "1", "2", "3", "4")
// In your MSN data, it's inside the 'games' array
$game = $msnData['value'][0]['games'][0];
$periodNumber = $game['currentPlayingPeriod']['number'] ?? 1;

$game = $msnData['value'][0]['games'][0];

// Handle different MSN date keys and formats
$rawTime = $game['startDateTime'] ?? $game['startTime'] ?? '';

// Process Scores
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

$squaresPath = $match['squares_file'];
if (file_exists($squaresPath)) {
    $squaresData = json_decode(file_get_contents($squaresPath), true);
} else {
    // Fallback if the file hasn't been created or is missing
    $squaresData = [
        'game_id' => '',
        'participants' => [],
        'grid' => []
    ];
}
// If it's a numeric timestamp (milliseconds), convert to ISO 8601
if (is_numeric($rawTime)) {
    $seconds = $rawTime / 1000;
    $startTime = date('c', $seconds); // Converts to "2026-02-08T18:30:00+00:00"
} else {
    $startTime = $rawTime;
}

if (!empty($startTime) && $startTime !== ($match['startTime'] ?? '')) {
    foreach ($config['active_matches'] as &$m) {
        if ($m['id'] === $matchId) {
            $m['startTime'] = $startTime; // Update the cached time
            break;
        }
    }
    file_put_contents('matches.json', json_encode($config, JSON_PRETTY_PRINT));
}

// Unified Output
echo json_encode([
    'settings' => [
        'title' => $match['title'],
        'payouts' => $match['payouts'],
        'startTime' => $startTime // Pass the timestamp to JS
    ],
    'teams' => $processedTeams,
    'status' => $game['gameState']['detailedGameStatus'],
    'squares' => $squaresData,
    "period" => (int)$periodNumber, // Now JS has the number "2"
]);