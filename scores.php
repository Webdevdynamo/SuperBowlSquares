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
$players = array(
	array(
		"name"	=>	"Landon",
		"squares"	=>	array(
			array(6,6),
			array(0,6),
			array(7,9),
			array(4,0),
			array(9,8),
			array(6,2),
			array(5,4),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Danielle",
		"squares"	=>	array(
			array(8,5),
			array(4,9),
			array(6,1),
			array(1,0),
			array(6,4),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Dan O",
		"squares"	=>	array(
			array(2,6),
			array(4,6),
			array(3,1),
			array(1,1),
			array(7,8),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"R2",
		"squares"	=>	array(
			array(7,3),
			array(8,6),
			array(6,5),
			array(0,5),
			array(4,7),
			array(3,9),
			array(5,1),
			array(3,1),
			array(1,8),
			array(0,2),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Rachel",
		"squares"	=>	array(
			array(3,3),
			array(9,5),
			array(0,1),
			array(8,8),
			array(5,2),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Joe",
		"squares"	=>	array(
			array(4,3),
			array(3,6),
			array(9,6),
			array(2,5),
			array(6,7),
			array(8,7),
			array(5,7),
			array(1,9),
			array(0,9),
			array(7,1),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Cory Joe's Wife",
		"squares"	=>	array(
			array(8,3),
			array(0,3),
			array(7,5),
			array(2,7),
			array(5,0),
			array(6,8),
			array(4,8),
			array(1,2),
			array(9,2),
			array(8,4),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Robert",
		"squares"	=>	array(
			array(1,6),
			array(3,7),
			array(9,1),
			array(7,0),
			array(5,8),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Helena",
		"squares"	=>	array(
			array(4,5),
			array(7,7),
			array(9,9),
			array(3,0),
			array(4,4),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"George",
		"squares"	=>	array(
			array(1,5),
			array(5,9),
			array(8,1),
			array(8,2),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Skye",
		"squares"	=>	array(
			array(5,6),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Kylie",
		"squares"	=>	array(
			array(8,9),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Larry",
		"squares"	=>	array(
			array(1,3),
			array(3,5),
			array(9,7),
			array(2,1),
			array(2,8),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Julie",
		"squares"	=>	array(
			array(6,3),
			array(3,2),
			array(4,2),
			array(7,4),
			array(0,4),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Danny",
		"squares"	=>	array(
			array(9,3),
			array(7,6),
			array(5,5),
			array(1,7),
			array(6,9),
			array(4,1),
			array(8,0),
			array(0,0),
			array(3,8),
			array(2,4),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Norman",
		"squares"	=>	array(
			array(2,3),
			array(2,2),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Ashleigh",
		"squares"	=>	array(
			array(6,0),
			array(7,2),
			array(0,8),
			array(9,4),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Jenn",
		"squares"	=>	array(
			array(3,4),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Kristy",
		"squares"	=>	array(
			array(5,3),
			array(0,7),
			array(2,0),
			array(1,4),
		),
		"points"	=>	0,
	),
	array(
		"name"	=>	"Dominic",
		"squares"	=>	array(
			array(9,0),
		),
		"points"	=>	0,
	),
);
//pai($players);
$url = "https://www.msn.com/en-us/Sports/nfl/scores";
$content = scrapeData($url,true);
$content = preg_replace('/\s+/', ' ', $content);
//print_r($content);
$regex = "/<table tabindex=\"0\" class=\"footballscorestable\">(.*?)<\/table>/s";
preg_match_all($regex, $content, $matches);
$content = $matches[0][0];
$regex = "/<tbody .*?>(.*?)<\/tbody>/s";
preg_match_all($regex, $content, $matches);
$games = $matches[0];
$games_array = null;
$i = 0;
foreach($games as $game){
	//print_r($game);
	//GAME DATE
	$regex = "/<td class=\"matchdate size1234\" .*?>(.*?)<\/td>/s";
	preg_match_all($regex, $game, $matches);
	$games_array[$i]['date'] = $matches[1][0];
	//TEAMS
	$regex = "/<td class=\"teamname .*?>(.*?)<\/td>/s";
	preg_match_all($regex, $game, $matches);
	$games_array[$i]['away_team'] = $matches[1][0];
	$games_array[$i]['home_team'] = $matches[1][2];
	//SCORES
	$regex = "/<td class=\"teamscore .*?>(.*?)<\/td>/s";
	preg_match_all($regex, $game, $matches);
	$games_array[$i]['quarters']['away'][1] = substr(intval($matches[1][0]),-1);
	$games_array[$i]['quarters']['away'][2] = substr(intval($matches[1][1]),-1);
	$games_array[$i]['quarters']['away'][3] = substr(intval($matches[1][2]),-1);
	$games_array[$i]['quarters']['away'][4] = substr(intval($matches[1][3]),-1);
	$games_array[$i]['quarters']['home'][1] = substr(intval($matches[1][4]),-1);
	$games_array[$i]['quarters']['home'][2] = substr(intval($matches[1][5]),-1);
	$games_array[$i]['quarters']['home'][3] = substr(intval($matches[1][6]),-1);
	$games_array[$i]['quarters']['home'][4] = substr(intval($matches[1][7]),-1);
	//print_r($matches);
	//$games_array[$i]['team_1'] = $matches[1][0];


	//pai($games_array);
	//exit();
	$i++;
}
?>
<html>
<head>
</head>
<body>
<script type="text/javascript">
var players = <?=json_encode($players)?>;
var games = <?=json_encode($games_array)?>;
console.log(players);
console.log(games);
</script>
</body>
</html>