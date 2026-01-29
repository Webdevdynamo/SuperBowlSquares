<?php
//MAKE THIS FOR 2026 LIVE GAME
$msnUrl = "https://api.msn.com/sports/livegames?apikey=kO1dI4ptCTTylLkPL1ZTHYP8JhLKb8mRDoA5yotmNJ&version=1.0&cm=en-us&activityId=6977c554-663a-48cb-ac4f-eed1df66b61f&it=web&user=m-2D3641899DAA6479163257649C38655E&scn=ANON&ids=7391a8d06675430592fcdc65bb4dcd38&scope=Full";


//THIS IS FOR TESTING PREVIOUS GAMES
$msnUrl = "https://api.msn.com/sports/livegames?apikey=kO1dI4ptCTTylLkPL1ZTHYP8JhLKb8mRDoA5yotmNJ&version=1.0&cm=en-us&user=m-20DC418084A963F00D64576B85AD62D9&lat=47.7712&long=-122.3828&activityId=697543d2-0a77-4b92-a633-499dc0aaf7e2&it=web&scn=ANON&ids=5848514c39774aa39db094ed5d0ebb34&scope=Full";

$json = file_get_contents($msnUrl);
$data = json_decode($json, true);

// Navigate the MSN nesting: value[0] -> games[0] -> participants
$game = $data['value'][0]['games'][0];
$participants = $game['participants'];

$output = [
    'gameStatus' => $game['gameState']['detailedGameStatus'], // e.g., "Final" or "In-Progress"
    'clock' => $game['gameState']['gameClock'],
    'teams' => []
];

foreach ($participants as $p) {
    $output['teams'][] = [
        'name' => $p['team']['shortName']['rawName'],
        'score' => (int)$p['result']['score'],
        'lastDigit' => (int)$p['result']['score'] % 10,
        'color' => "#" . $p['team']['colors']['primaryColorHex'],
        'homeAway' => $p['homeAwayStatus'] // "Home" or "Away"
    ];
}

header('Content-Type: application/json');
echo json_encode($output);