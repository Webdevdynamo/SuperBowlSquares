<?php
	
function pai($array){
	$bt = debug_backtrace();
	$caller = array_shift($bt);
		echo "<PRE style='color:RED;'>";
		//print_r($caller);
		print_r($array);
		echo "</PRE>";
}
function scrapeData($url,$disable_cookie = false){
		//$agent= 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36'; 
		$agent = 'Googlebot/2.1 (+http://www.google.com/bot.html)';

		$randIP = "".mt_rand(0,255).".".mt_rand(0,255).".".mt_rand(0,255).".".mt_rand(0,255);
		//echo $randIP;
		ob_start();
		$out = fopen('php://output', 'w');
		//$url .= "?1234";
		//pai($url);
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		//curl_setopt($ch, CURLOPT_PORT, '9844');
		curl_setopt($ch, CURLOPT_USERAGENT, $agent); 
		//curl_setopt($ch, CURLOPT_HEADER  ,1);
		//curl_setopt($ch, CURLOPT_POSTFIELDS, 'username='.$username.'&password='.$password.'&buttonClicked=Submit');
		if(!$disable_cookie){
			curl_setopt($ch, CURLOPT_COOKIEJAR, 'cookie.txt');
			curl_setopt($ch, CURLOPT_COOKIEFILE, 'cookie.txt');
		}
		//curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		//curl_setopt( $ch, CURLOPT_AUTOREFERER, true );
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
		curl_setopt( $ch, CURLOPT_SSL_VERIFYHOST, false );
		curl_setopt( $ch, CURLOPT_VERBOSE, true );
		curl_setopt($ch, CURLOPT_STDERR, $out);  
		//curl_setopt($ch, CURLOPT_HTTPHEADER,array("REMOTE_ADDR: $randIP", "HTTP_X_FORWARDED_FOR: $randIP"));
		//curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);  
		$content = curl_exec($ch);
		fclose($out);  
		$debug = ob_get_clean();
		//pai('http://timeclock.adahotelsigns.com/'.$address);
		//curl_setopt($ch, CURLOPT_URL, 'http://timeclock.adahotelsigns.com/'.$address);
		//if($fields){
			//curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
		//}
		//curl_setopt($ch, CURLOPT_PORT, '9844');
		//$html_string = curl_exec ($ch);
		$info = curl_getinfo($ch);
		$error = curl_error($ch);
		//pai($debug);
		//$content = htmlentities($content);
		//pai($info);
		//pai($error);
		//pai($content);
		//exit();
		//pai(htmlentities($content));
		return $content;
	}


if($_REQUEST['type'] == "full"){
	$playoffs = false;
}else{
	$playoffs = true;
}
//pai($players);
//$url = "https://www.msn.com/en-us/Sports/nfl/scores";
$start = 18;
$week_array = null;
$q = 1;
$super_used = 0;
$double_points_date = "2020-02-02";

$square_price = 2.00;
$payout_q1 = 50.00;
$payout_q2 = 50.00;
$payout_q3 = 50.00;
$payout_final = 50.00;

$game_settings = array(
	"square_price" => $square_price,
	"payout_q1" => $payout_q1,
	"payout_q2" => $payout_q2,
	"payout_q3" => $payout_q3,
	"payout_q4" => $payout_final,
);
//$double_points_date = "2020-01-19";

function refreshScores($url, $game_settings = null){
	$content = scrapeData($url,true);
	//exit();
	$json = json_decode($content,true);
	$games_array = null;
	$game_data = $json['value'][0]['games'][0];
	$home_team = $game_data['participants'][1];
	$away_team = $game_data['participants'][0];
	$i = 0;
	$games_array['point_weight'] = 1;
	$games_array['square_price'] = $game_settings['square_price'];
	$games_array['payouts'] = array(
		"1"	=>	$game_settings['payout_q1'],
		"2"	=>	$game_settings['payout_q2'],
		"3"	=>	$game_settings['payout_q3'],
		"4"	=>	$game_settings['payout_q4'],
	);
	$games_array['date'] = date("Y-m-d", substr($game_data['startDateTime'], 0, 10));
	$games_array['time'] = intval($game_data['startDateTime']);
	$winner = "";
	if($away_team['gameOutcome'] == "Won"){
		$winner = "away_team";
	}else if($home_team['gameOutcome'] == "Won"){
		$winner = "home_team";
	}
	
	$games_array['winner'] = $winner;
	$games_array['home_team'] = $home_team;
	$games_array['away_team'] = $away_team;

	/*$games_array['score'][1]['away'] =	($away_team['playingPeriodScores'][0]['score']);
	$games_array['score'][2]['away'] =	($away_team['playingPeriodScores'][1]['score'] == "-" ? "-" : $games_array['score'][1]['away'] + intval($away_team['playingPeriodScores'][1]['score']));
	$games_array['score'][3]['away'] =	($away_team['playingPeriodScores'][2]['score'] == "-" ? "-" : $games_array['score'][2]['away'] + intval($away_team['playingPeriodScores'][2]['score']));
	$games_array['score'][4]['away'] =	($away_team['playingPeriodScores'][3]['score'] == "-" ? "-" : $games_array['score'][3]['away'] + intval($away_team['playingPeriodScores'][3]['score']));*/

	$games_array['score'][1]['home'] =	($home_team['playingPeriodScores'][0]['score']);
	$games_array['score'][2]['home'] =	($home_team['playingPeriodScores'][1]['score'] == "-" ? "-" : $games_array['score'][1]['home'] + intval($home_team['playingPeriodScores'][1]['score']));
	$games_array['score'][3]['home'] =	($home_team['playingPeriodScores'][2]['score'] == "-" ? "-" : $games_array['score'][2]['home'] + intval($home_team['playingPeriodScores'][2]['score']));
	$games_array['score'][4]['home'] =	($home_team['playingPeriodScores'][3]['score'] == "-" ? "-" : $games_array['score'][3]['home'] + intval($home_team['playingPeriodScores'][3]['score']));
	

	/*$games_array['score'][1]['home'] =	($home_team['playingPeriodScores'][0]['score']);
	$games_array['score'][2]['home'] =	($home_team['playingPeriodScores'][1]['score'] == "-" ? "-" : $games_array['score'][1]['home'] + intval($home_team['playingPeriodScores'][1]['score']));
	$games_array['score'][3]['home'] =	($home_team['playingPeriodScores'][2]['score'] == "-" ? "-" : $games_array['score'][2]['home'] + intval($home_team['playingPeriodScores'][2]['score']));
	$games_array['score'][4]['home'] =	($home_team['playingPeriodScores'][3]['score'] == "-" ? "-" : $games_array['score'][3]['home'] + intval($home_team['playingPeriodScores'][3]['score']));*/
	

	$games_array['score'][1]['away'] =	($away_team['playingPeriodScores'][0]['score']);
	$games_array['score'][2]['away'] =	($away_team['playingPeriodScores'][1]['score'] == "-" ? "-" : $games_array['score'][1]['away'] + intval($away_team['playingPeriodScores'][1]['score']));
	$games_array['score'][3]['away'] =	($away_team['playingPeriodScores'][2]['score'] == "-" ? "-" : $games_array['score'][2]['away'] + intval($away_team['playingPeriodScores'][2]['score']));
	$games_array['score'][4]['away'] =	($away_team['playingPeriodScores'][3]['score'] == "-" ? "-" : $games_array['score'][3]['away'] + intval($away_team['playingPeriodScores'][3]['score']));

	$games_array['quarters'][1]['home'] = substr(($games_array['score'][1]['home']),-1);
	$games_array['quarters'][2]['home'] = substr(($games_array['score'][2]['home']),-1);
	$games_array['quarters'][3]['home'] = substr(($games_array['score'][3]['home']),-1);
	$games_array['quarters'][4]['home'] = substr(($games_array['score'][4]['home']),-1);

	$games_array['quarters'][1]['away'] = substr(($games_array['score'][1]['away']),-1);
	$games_array['quarters'][2]['away'] = substr(($games_array['score'][2]['away']),-1);
	$games_array['quarters'][3]['away'] = substr(($games_array['score'][3]['away']),-1);
	$games_array['quarters'][4]['away'] = substr(($games_array['score'][4]['away']),-1);
	return $games_array;
}

while($q > 0){
	if($playoffs){
		$url = "https://www.msn.com/en-us/Sports/nfl/scores";
		$q = 0;
	}else{
		$url = "https://www.msn.com/en-us/Sports/nfl/scores/sp-ss-inseason-w-".$q;
		$q = $q - 4;
	}
	$url = "https://www.msn.com/en-us/sports/liteajax/nfl/FootballLeagueSchedule_nfl_FTM400_superbowl_ajax_mm";
	
		//REAL SCORE
		$url = "https://api.msn.com/sports/livegames?apikey=kO1dI4ptCTTylLkPL1ZTHYP8JhLKb8mRDoA5yotmNJ&version=1.0&cm=en-us&activityId=8863C945-76E3-4D17-AB54-D5548D190A6C&ocid=sports-gamecenter&it=web&user=m-08685BE9FD4F6E5102664FF0FCB46F50&ids=902a475372f948689d9b193a5c41ea4d&scope=Full";

		//TEST
		//$url = "https://api.msn.com/sports/livegames?apikey=kO1dI4ptCTTylLkPL1ZTHYP8JhLKb8mRDoA5yotmNJ&version=1.0&cm=en-us&activityId=2483E694-5D4C-4FD2-8DE2-61BE7D2B3A84&ocid=sports-gamecenter&it=web&user=m-0C26E036A722640E1BF0F42BA6A66529&ids=88b69b59d7b9457284d86ec00f9af626&scope=Full";

	$widgenJSONPath = 'scores.json';
	$widget_array = json_decode(file_get_contents($widgenJSONPath), true);
	$last_polled = $widget_array['created'];
	$seconds_since = time() - $last_polled ;
	if($seconds_since  > 20 || !$widget_array['created']){
		//RE POLL
		$games_array = refreshScores($url, $game_settings);
		file_put_contents($widgenJSONPath, json_encode(array("created" => time(), "data" => $games_array )));
		$games_array = json_encode($games_array);

	}else{
		$games_array = json_encode($widget_array['data']);
	}
	
	//$games_array = json_encode($widget_array['data']);
	echo $games_array;
	exit();
	
}
?>