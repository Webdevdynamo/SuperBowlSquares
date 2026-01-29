<?php
exit();
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

$start = 18;
$week_array = null;
$q = 18;
$double_points_date = "2020-02-02";
//$double_points_date = "2020-01-04";
$url = "https://www.msn.com/en-us/sports/nfl/scores/sp-ss-inseason";
	$content = scrapeData($url,true);
	$content = preg_replace('/\s+/', ' ', $content);
	//print_r($content);
	$regex = "/<table tabindex=\"0\" class=\"footballscorestable\">(.*?)<\/table>/s";
	preg_match_all($regex, $content, $matches);
	foreach($matches[0] as $match){
		$content = $match;
		//$regex = "/<img .*? {\"default\":\"(.*?)\">/s";
		$regex = "/<img (.*?)>/s";
		$regex = "/<img alt=\"(.*?)\".*?\{\&quot;default&quot;\:&quot;(.*?)&quot;/s";
		preg_match_all($regex, $content, $matches);
		$logo_titles = $matches[1];
		$logo_images = $matches[2];
		//pai($logo_titles);
		//pai($logo_images);
		foreach($logo_images as $key=>$image_path){
			$url = "http:".str_replace("&amp;", "&", $image_path);
			$img = $logo_titles[$key].'.png';
			pai($img);
			pai($url);
			file_put_contents($img, file_get_contents($url));
		}
		exit();

		$regex = "/<tbody .*?>(.*?)<\/tbody>/s";
		preg_match_all($regex, $content, $matches);
		$games = $matches[0];
		$games_array = null;
		$i = 0;
		foreach($games as $game){
			//GAME DATE
			$regex = "/<td class=\"matchdate size1234\" .*?>(.*?)<\/td>/s";
			preg_match_all($regex, $game, $matches);
			$date = $matches[1][0]." 2020";
			$game_date = date("Y-m-d",strtotime($date));
			$games_array[$i]['point_weight'] = 1;
			if($game_date == $double_points_date){
				$games_array[$i]['point_weight'] = 2;
			}
			$games_array[$i]['date'] = date("Y-m-d",strtotime($date));
			//TEAMS
			$regex = "/<td class=\"teamname .*?>(.*?)<\/td>/s";
			preg_match_all($regex, $game, $matches);
			$winner = "";
			//pai($matches);
			if(strstr($matches[0][0],"winteamname")){
				$winner = "away_team";
			}else if(strstr($matches[0][2],"winteamname")){
				$winner = "home_team";
			}
			$games_array[$i]['winner'] = $winner;
			$games_array[$i]['away_team'] = $matches[1][0];
			$games_array[$i]['home_team'] = $matches[1][2];
			//SCORES
			$regex = "/<td class=\"teamscore .*?>(.*?)<\/td>/s";
			preg_match_all($regex, $game, $matches);
			/*$games_array[$i]['quarters'][1]['away'] = substr(intval($matches[1][0]),-1);
			$games_array[$i]['quarters'][2]['away'] = substr(intval($matches[1][1]),-1);
			$games_array[$i]['quarters'][3]['away'] = substr(intval($matches[1][2]),-1);
			$games_array[$i]['quarters'][4]['away'] = substr(intval($matches[1][3]),-1);
			$games_array[$i]['quarters'][1]['home'] = substr(intval($matches[1][4]),-1);
			$games_array[$i]['quarters'][2]['home'] = substr(intval($matches[1][5]),-1);
			$games_array[$i]['quarters'][3]['home'] = substr(intval($matches[1][6]),-1);
			$games_array[$i]['quarters'][4]['home'] = substr(intval($matches[1][7]),-1);*/

			$games_array[$i]['score'][1]['away'] = ($matches[1][0] == " - " ? "-" : intval($matches[1][0]));
			$games_array[$i]['score'][2]['away'] = ($matches[1][1] == " - " ? "-" : $games_array[$i]['score'][1]['away'] + intval($matches[1][1]));
			$games_array[$i]['score'][3]['away'] = ($matches[1][2] == " - " ? "-" : $games_array[$i]['score'][2]['away'] + intval($matches[1][2]));
			$games_array[$i]['score'][1]['home'] = ($matches[1][4] == " - " ? "-" : intval($matches[1][4]));
			$games_array[$i]['score'][2]['home'] = ($matches[1][5] == " - " ? "-" : $games_array[$i]['score'][1]['home'] + intval($matches[1][5]));
			$games_array[$i]['score'][3]['home'] = ($matches[1][6] == " - " ? "-" : $games_array[$i]['score'][2]['home'] + intval($matches[1][6]));
			
			$games_array[$i]['quarters'][1]['away'] = ($matches[1][0] == " - " ? "-" : substr(intval($games_array[$i]['score'][1]['away']),-1));
			$games_array[$i]['quarters'][2]['away'] = ($matches[1][1] == " - " ? "-" : substr(intval($games_array[$i]['score'][2]['away']),-1));
			$games_array[$i]['quarters'][3]['away'] = ($matches[1][2] == " - " ? "-" : substr(intval($games_array[$i]['score'][3]['away']),-1));
			$games_array[$i]['quarters'][1]['home'] = ($matches[1][4] == " - " ? "-" : substr(intval($games_array[$i]['score'][1]['home']),-1));
			$games_array[$i]['quarters'][2]['home'] = ($matches[1][5] == " - " ? "-" : substr(intval($games_array[$i]['score'][2]['home']),-1));
			$games_array[$i]['quarters'][3]['home'] = ($matches[1][6] == " - " ? "-" : substr(intval($games_array[$i]['score'][3]['home']),-1));

			
			$regex = "/<td class=\"totalscore .*?>(.*?)<\/td>/s";
			//pai($matches);
			//pai($matches);
			$no_total = false;
			if($matches[1][3] == $matches[1][7] && $matches[1][3] == " - "){
				$no_total = true;
			}
			preg_match_all($regex, $game, $matches);
			if($no_total){
				$matches[1][0] = $matches[1][1] = " - ";
			}
			//pai($matches);

			$games_array[$i]['score'][4]['away'] = ($matches[1][0] == " - " ? "-" : intval($matches[1][0]));

			$games_array[$i]['quarters'][4]['away'] = ($matches[1][0] == " - " ? "-" : substr(intval($games_array[$i]['score'][4]['away']),-1));

			
			$games_array[$i]['score'][4]['home'] = ($matches[1][1] == " - " ? "-" : intval($matches[1][1]));
			
			$games_array[$i]['quarters'][4]['home'] = ($matches[1][1] == " - " ? "-" : substr(intval($games_array[$i]['score'][4]['home']),-1));
			//print_r($matches);
			//$games_array[$i]['team_1'] = $matches[1][0];


			//pai($games_array);
			//exit();
			$i++;
		}
		$week_array[] = array(
			"week"	=>	$week_text,
			"games"	=>	$games_array
		);
	}
?>