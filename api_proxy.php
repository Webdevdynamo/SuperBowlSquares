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
    'status' => $game['gameState']['detailedGameStatus'],
    'teams' => []
];

foreach ($participants as $p) {
    $qScores = [0, 0, 0, 0]; // Default Q1, Q2, Q3, Q4
    $runningTotal = 0;
    
    // MSN provides scores per period; we must sum them for the score AT THE END of that quarter
    foreach ($p['playingPeriodScores'] as $period) {
        $num = (int)$period['playingPeriod']['number'];
        if ($num <= 4) {
            $runningTotal += (int)$period['score'];
            $qScores[$num - 1] = $runningTotal;
        }
    }

    $output['teams'][] = [
        'fullName'  => $p['team']['name']['rawName'],
        'shortName' => $p['team']['shortName']['rawName'],
        'total'     => (int)$p['result']['score'],
        'quarters'  => $qScores, // [Q1Total, Q2Total, Q3Total, Q4Total]
        'homeAway'  => $p['homeAwayStatus']
    ];
}

header('Content-Type: application/json');
echo json_encode($output);