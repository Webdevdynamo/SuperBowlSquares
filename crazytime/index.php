<style>
#result_ul li{
	list-style: none;
}
.result_table{
	border-collapse: collapse;
}
.result_table td{
	border: 1px solid #000;
	padding: 5px;
	width: 100px;
	text-align: center;
}
.result_table td.td_5{
	width: 150px;
}
ul{
	list-style: none;
}
#simulation_results{
	text-align: left;
}
#simulation_results td{
	width: 150px;
	text-align: center;
}
.winner{
	background-color: #82ff82;
}
.loser{
	background-color: #ff6363;
}
.even{
	background-color: #ffff6d;
}
</style>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<div style="float:left">
<table>
<tr><th>Bet</th><th>Bet Amount</th></tr>
<tr><td>1</td><td><input type="number" class="bet_input" id="bet_1" value="0" /></td></tr>
<tr><td>2</td><td><input type="number" class="bet_input" id="bet_2" value="0" /></td></tr>
<tr><td>5</td><td><input type="number" class="bet_input" id="bet_5" value="0" /></td></tr>
<tr><td>10</td><td><input type="number" class="bet_input" id="bet_10" value="0" /></td></tr>
<tr><td>Coin Flip</td><td><input type="number" class="bet_input" id="bet_coin_flip" value="0" /></td></tr>
<tr><td>Pachinko</td><td><input type="number" class="bet_input" id="bet_pachinko" value="0" /></td></tr>
<tr><td>Cash Hunt</td><td><input type="number" class="bet_input" id="bet_cash_hunt" value="0" /></td></tr>
<tr><td>Crazy Time</td><td><input type="number" class="bet_input" id="bet_crazy_time" value="0" /></td></tr>
<tr><td><b>Spin Wager Amount</b></td><td class="bet_input" id="spin_wager" style="font-weight:bold;"></td></tr>
<tr><td>Spin Count</td><td><input type="number" class="bet_input" id="spin_count" value="1" /></td></tr>
<tr><td>Bank Roll</td><td><input type="number" class="bet_input" id="bank_roll" value="0" /></td></tr>
<tr><td>Scalp %</td><td><input type="number" class="bet_input" id="scalp_percent" value="0" /></td></tr>
<tr><td colspan=2><button onclick="javascript:startSpins();">Spin Wheel</button></td></tr>
<tr><td colspan=2><button onclick="javascript:clearResults();">Clear Results</button></td></tr>
<tr><td colspan=2><button onclick="javascript:clearBet();">Clear Bet</button></td></tr>
<tr><td>Simulation Count</td><td><input type="number" class="bet_input" id="sim_count" value="1" /></td></tr>
<tr><td colspan=2><button onclick="javascript: multiSim();">Run Multiple Simulations</button></td></tr>
</table>
</div>
<div style="float:left">
<hr>
Simulation Results:

<table id="simulation_results">
<tr>
	<th>Simulations Completed:</th><td class="sim_result" id="simulations_completed"></td><th></th><td ></td>
</tr>
<tr>
	<th>Total Spins:</th><td class="sim_result" id="total_spins"></td><th>Current Bankroll:</th><td class="sim_result" id="current_bankroll"></td>
</tr>
<tr>
	<th>Winning Spins:</th><td class="sim_result" id="winning_spins"></td><th>Total Wagered:</th><td class="sim_result" id="total_wagered"></td>
</tr>
<tr>
	<th>Break-even Spins:</th><td class="sim_result" id="even_spins"></td><th>Gross Winnings</th><td class="sim_result" id="gross_winnings"></td>
</tr>
<tr>
	<th>Losing Spins:</th><td class="sim_result" id="losing_spins"></td><th>Net Winnings:</th><td class="sim_result" id="net_winnings"></td>
</tr>
<tr>
	<th>Bonus Games Played:</th><td class="sim_result" id="bonus_games"></td><th>Scalped Winnings:</th><td class="sim_result" id="scalped_winnings"></td>
</tr>
<tr>
	<th>Top Slot Multipliers Hit:</th><td class="sim_result" id="multi_hits"></td><th>ROI:</th><td class="sim_result" id="roi"></td>
</tr>
<tr>
	<th></th><td></td><th>Approx. Time Spent:</th><td class="sim_result" id="time_spent"></td>
</tr>
</table>
<hr>
</div>
<div style="float:left">
Spin Results:
<button onclick="javascript:showWinners();">Show Only Winners</button>
<button onclick="javascript:showAll();">Show All</button>
<button onclick="javascript:sortList('winnings');">Sort by Winnings</button>
<button onclick="javascript:sortList('spin');">Sort by Spin #</button>
<div>
<ul id="" style="margin: 0px;padding: 0px;margin-top:10px;">
<li class="spin_result_li">
<table class="result_table">
<tr>
<td class='td_0'>Spin #</td>
<td class='td_1'>Wheel Result</td>
<td class='td_2'>Top Slot Game</td>
<td class='td_3'>Top Slot Multi</td>
<td class='td_4'>Winning Wager Amount</td>
<td class='td_5'>Game Details</td>
<td class='td_6'>Total Winnings</td>
<td class='td_6'>Bankroll</td>
<td class='td_6'>Scalped Amount</td>
</tr>
</table>
</li>
<ul style="margin: 0px;padding: 0px;border: 1px solid #000;">
<ul id="result_ul" style="margin: 0px;padding: 0px;overflow: auto;max-height: 500px;">
<ul>
</div>
</div>

<script type="text/javascript">
	$(".bet_input").bind("change", function(){
		val = $(this).val();
		if(val<0){
			$(this).val(0);
		}
	});

	var total_spins_made = 0;

	var multiSimOutcomes = [];

	var sim_count = 0;

	var total_sim_count = 1;


	var simResults = {
		"total_spins":0,
		"total_wagered":0,
		"winning_spins":0,
		"gross_winnings":0,
		"even_spins":0,
		"net_winnings":0,
		"losing_spins":0,
		"roi":0,
		"bonus_games":0,
		"multi_hits":0,
	}

	var betData = {
		"1":4,
		"2":0,
		"5":0,
		"10":0,
		"coin_flip":1,
		"pachinko":1,
		"cash_hunt":1,
		"crazy_time":1
	}

	var mainWheelOdds = {
		"1":21,
		"2":13,
		"5":7,
		"10":4,
		"coin_flip":4,
		"pachinko":2,
		"cash_hunt":2,
		"crazy_time":1
	};

	var topSlotGameOdds = {
		"1":1319,
		"2":1328,
		"5":1140,
		"10":828,
		"coin_flip":1164,
		"pachinko":1399,
		"cash_hunt":1228,
		"crazy_time":1594
	}

	var topSlotMultiOdds = {
		0:2152,
		2:2504,
		3:2134,
		4:1023,
		5:897,
		7:528,
		10:344,
		15:170,
		20:134,
		25:82,
		50:32,
	}
	
	var pachinkoBoardWeights = {
		2:6,
		3:8,
		5:16,
		7:56,
		10:60,
		15:36,
		20:23,
		25:10,
		35:9,
		40:5,
		50:7,
		100:4,
		200:2,
		"double":14,
	}

	var coinFlipOdds = {
		"low":{
			2:37,
			3:43,
			4:25,
			5:23,
		},
		"high":{
			7:16,
			8:17,
			9:14,
			10:15,
			12:17,
			15:18,
			20:13,
			25:10,
			50:7,
			100:1,
		},
	}

	var cashHuntBoardOdds = {
		1:4,
		2:1,
		3:5,
	}

	var cashHuntOdds = {
		1:{
			5:14,
			7:14,
			10:24,
			15:29,
			20:18,
			25:0,
			50:0,
			75:0,
			100:9,
			500:0,
		},
		2:{
			5:15,
			7:18,
			10:25,
			15:15,
			20:19,
			25:9,
			50:3,
			75:3,
			100:0,
			500:1,
		},
		3:{
			5:15,
			7:13,
			10:20,
			15:15,
			20:25,
			25:7,
			50:7,
			75:5,
			100:1,
			500:0,
		},
	}

	var crazyTimeWheelOdds = {
		1:{
			10:12,
			15:13,
			20:7,
			25:8,
			50:6,
			100:2,
			200:0,
			"double":16,
			"triple":0,
		},
		2:{
			10:0,
			15:11,
			20:10,
			25:18,
			50:17,
			100:4,
			200:0,
			"double":4,
			"triple":0,
		},
		3:{
			10:9,
			15:8,
			20:8,
			25:17,
			50:15,
			100:4,
			200:1,
			"double":1,
			"triple":1,
		},
	}

	var doubles = 0;
	var triples = 0;
	var crazy_multi = 1;
	var spin_count = 1;
	var use_bank_roll = 0;
	var stop_spins = 0;
	var sim_complete = false;
	var allow_display = true;
	var spin_spacing = 0;

	//console.log(mainWheelOdds);
	function getRandomIntInclusive(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function normalizeOddsArray(odds_obj){
		total_odds_obj = {};
		total_counter = 1;
		for (const i in odds_obj) {
			counter = 0;
			count = odds_obj[i];
			while(counter < count){
				total_odds_obj[total_counter] = i;
				counter++;
				total_counter++;
			}
		}
		return total_odds_obj;
	}

	function getTotalPossibleOutcomes(odds_obj){
		total = 0;
		for (const i in odds_obj) {
			total += odds_obj[i];
		}
		return total;
	}

	function spinMainWheel(){
		odds_obj = normalizeOddsArray(mainWheelOdds);
		total = getTotalPossibleOutcomes(mainWheelOdds);
		random_number = getRandomIntInclusive(1,total);
		spin_outcome = odds_obj[random_number];
		//spin_outcome = "coin_flip";
		return spin_outcome;
	}

	function spinTopSlotsSymbol(){
		odds_obj = normalizeOddsArray(topSlotGameOdds);
		total = getTotalPossibleOutcomes(topSlotGameOdds);
		random_number = getRandomIntInclusive(1,total);
		spin_outcome = odds_obj[random_number];
		return spin_outcome;
	}

	function spinTopSlotsMulti(){
		odds_obj = normalizeOddsArray(topSlotMultiOdds);
		total = getTotalPossibleOutcomes(topSlotMultiOdds);
		random_number = getRandomIntInclusive(1,total);
		spin_outcome = odds_obj[random_number];
		return spin_outcome;
	}

	function checkForWin(betData, outcome){
		result = {
			"result":"loss",
			"wager":0,
		};
		for (const i in betData) {
			if(i === outcome){
				if(betData[i] > 0){
					result["result"] = "win";
					result["wager"] = betData[i];
					//console.log(result);
					break;
				}
			}
		}
		return result;
	}

	function simulateSpin(){
			//console.log("Alive");
		if(sim_complete){
			//console.log("DEAD");
			return false;
		}
		if(
			simResults['initial_bank_roll'] > 0 //HAD MONEY AT ONE POINT
		){
			//console.log("current",simResults['current_bank_roll']);
			//console.log("initial", simResults['initial_bank_roll']);
			if(
				simResults['spin_wager_amount'] > simResults['current_bank_roll']
			){
				completeSimulation(simResults);
				return false;
			}
		}
		simResults['current_bank_roll'] -= simResults['spin_wager_amount'];
		//console.log(simResults);
		total_spins_made++;
		result_object = {
			"outcome": "loss",
			"wheel_result": null,
			"top_spin_game": null,
			"top_spin_multiplier": null,
			"winning_wager_base":	0,
			"total_winnings": 0,
			"game_detail_string": "N/A",
		}
		top_slots_symbol = spinTopSlotsSymbol();
		top_slots_multi = spinTopSlotsMulti();
		
		//top_slots_multi = 1;

		wheel_outcome = spinMainWheel();
		outcome = checkForWin(betData, wheel_outcome);
		//console.log("Top Slots Outcome",top_slots_symbol);
		//console.log("Top Slots Multiplier",top_slots_multi);
		//console.log("Wheel Outcome", wheel_outcome);
		result_object["wheel_result"] = wheel_outcome;
		result_object["top_spin_game"] = top_slots_symbol;
		result_object["top_spin_multiplier"] = top_slots_multi;
		result_object["outcome"] = outcome['result'];
		result_object["winning_wager_base"] = parseInt(outcome['wager']);
		
		switch(result_object["wheel_result"]){
			case "cash_hunt":
			case "coin_flip":
			case "pachinko":
			case "crazy_time":
				simResults['total_bonus_games']++;
				break;
			default:
				break;
		}

		if(outcome['result'] == "win"){
			//console.log("RESULT",result_object["wheel_result"]);
			switch(result_object["wheel_result"]){
				case "1":
					result_object["total_winnings"] = (result_object["winning_wager_base"] * 1);
					break;
				case "2":
					result_object["total_winnings"] = (result_object["winning_wager_base"] * 2);
					break;
				case "5":
					result_object["total_winnings"] = (result_object["winning_wager_base"] * 5);
					break;
				case "10":
					result_object["total_winnings"] = (result_object["winning_wager_base"] * 10);
					break;
				default:
					simResults['bonus_games']++;
					switch(result_object["wheel_result"]){
						case "cash_hunt":
							game_results = playCashHunt();
							game_multiplier = parseInt(game_results['multiplier']);
							break;
						case "coin_flip":
							game_results = playCoinFlip();
							game_multiplier = parseInt(game_results['multiplier']);
							break;
						case "pachinko":
							game_results = playPachinko();
							game_multiplier = parseInt(game_results['multiplier']);
							break;
						case "crazy_time":
							game_results = playCrazyTime();
							game_multiplier = parseInt(game_results['multiplier']);
							break;
						default:
							game_results = null;
							game_multiplier = 0;
							break;
					}
					result_object["total_winnings"] = (result_object["winning_wager_base"] * game_multiplier);
					result_object["game_detail_string"] = generateGameDetails(game_results);
					//bonus games
					break;
			}
			if(result_object["top_spin_game"] == result_object["wheel_result"]){
				if(result_object["top_spin_multiplier"] > 0){
					result_object["total_winnings"] = result_object["total_winnings"] * result_object["top_spin_multiplier"];
				}
			}
			result_object["total_winnings"] = result_object["total_winnings"] + result_object["winning_wager_base"];
			//Hit on Wheel, Calculate Multiplier if Necessary
		}else{
			if(simResults['initial_bank_roll'] > 0 && simResults['current_bank_roll'] == 0){
				completeSimulation(simResults);
			}
		}
		//console.log(result_object);
		recordResult(result_object);
	}

	function generateGameDetails(game_obj){
		string = "";
		for (const i in game_obj) {
			//console.log(game_obj);
			string += i+": "+game_obj[i]+"<br>";
		}
		return string;
	}

	function recordResult(result_object){
		switch(result_object['outcome']){
			case "loss":
				style_class = "loser";
				break;
			default:
				if(result_object['total_winnings'] > simResults['spin_wager_amount']){
					style_class = "winner";
					//WON MONEY
				}else{
					style_class = "even";
					//BREAK EVEN
				}
				break;
		}
		recordSimResults(result_object);
		result = $('<li data-winnings="'+result_object['total_winnings']+'" data-spin="'+total_spins_made+'"><table class="result_table '+style_class+'"><tr><td class="td_0">'+total_spins_made+'</td><td class="td_1">'+result_object["wheel_result"]+'</td><td class="td_2">'+result_object["top_spin_game"]+'</td><td class="td_3">'+result_object["top_spin_multiplier"]+'</td><td class="td_4">'+result_object["winning_wager_base"]+'</td><td class="td_5">'+result_object["game_detail_string"]+'</td><td class="td_6">'+(result_object["total_winnings"]).toLocaleString('en-US', {
		  style: 'currency',
		  currency: 'USD',
		})+'</td><td class="td_6">'+(simResults["current_bank_roll"]).toLocaleString('en-US', {
		  style: 'currency',
		  currency: 'USD',
		})+'</td><td class="td_6">'+(simResults["last_scalped_amount"]).toLocaleString('en-US', {
		  style: 'currency',
		  currency: 'USD',
		})+'</td></tr></table></li>');
		$("#result_ul").prepend(result);
		//CHECK FOR NEXT SPIN
		if(use_bank_roll){
			if(simResults['current_bank_roll'] > 0){
				//console.log(simResults['current_bank_roll']);
				window.setTimeout(simulateSpin,spin_spacing);
			}
		}else{
			//for(i=1;i<=spin_count;i++){
				//console.log(spin_count);
				//console.log(total_spins_made);
			if(spin_count > total_spins_made){
				//console.log("spinning");
				window.setTimeout(simulateSpin,spin_spacing);
				//simulateSpin();
			}else{
				completeSimulation(simResults);
			}
		}
	}

	function playCoinFlip(){
		game_results = {
			"color": null,
			"low_multi": null,
			"high_multi": null,
			"multiplier": null,
		}
		//Get Low Multiplier
		odds_obj = normalizeOddsArray(coinFlipOdds["low"]);
		total = getTotalPossibleOutcomes(coinFlipOdds["low"]);
		random_number = getRandomIntInclusive(1,total);
		game_results["low_multi"] = odds_obj[random_number];

		//Get Hight Multiplier
		odds_obj = normalizeOddsArray(coinFlipOdds["high"]);
		total = getTotalPossibleOutcomes(coinFlipOdds["high"]);
		random_number = getRandomIntInclusive(1,total);
		game_results["high_multi"] = odds_obj[random_number];

		//Flip Coin
		random_number = getRandomIntInclusive(1,2);
		if(random_number == 1){
			game_results["color"] = "low";
			game_results["multiplier"] = game_results["low_multi"];
		}else{
			game_results["color"] = "high";
			game_results["multiplier"] = game_results["high_multi"];
		}

		return game_results;
		//outcome = odds_obj[random_number];
	}

	function playCashHunt(){
		game_results = {
			"board_number": null,
			"multiplier": null,
		}
		//First Choose Board
		odds_obj = normalizeOddsArray(cashHuntBoardOdds);
		//console.log(odds_obj);
		total = getTotalPossibleOutcomes(cashHuntBoardOdds);
		random_board_number = getRandomIntInclusive(1,total);
		game_results["board_number"] = odds_obj[random_board_number];
		//game_results["board_number"] = getRandomIntInclusive(1,total);
		board_odds = cashHuntOdds[game_results["board_number"]];
		odds_obj = normalizeOddsArray(board_odds);
		total = getTotalPossibleOutcomes(board_odds);
		random_number = getRandomIntInclusive(1,total);
		game_results["multiplier"] = odds_obj[random_number];
		//console.log(game_results);
		return game_results;
		//outcome = odds_obj[random_number];
	}

	function generateBoard(){
		board_numbers = {};
		board_weights = normalizeOddsArray(pachinkoBoardWeights);
		total = getTotalPossibleOutcomes(pachinkoBoardWeights);
		for(i=1;i<=16;i++){
			random_number = getRandomIntInclusive(1,total);
			board_numbers[i] = (board_weights[random_number]);
		}
		return board_numbers;
	}

	function playPachinko(){
		doubles = 0;
		game_results = {
			"board": null,
			"doubles_hit": 0,
			"multiplier": null,
		}
		//pachinkoBoardWeights
		game_results["board"] = generateBoard();
		running_board = Object.assign({}, game_results["board"]);
		game_results["board"] = stringifyBoard(game_results["board"]);
		game_results["multiplier"] = dropChip(running_board,false);
		game_results["doubles_hit"] = doubles;
		//console.log(game_results);
		return game_results;
	}

	function stringifyBoard(board_state){
		string = "";
		for (const i in board_state) {
			string = string + board_state[i]+"-";
		}
		string = string.substring(0, string.length - 1);
		return string;
	}

	function dropChip(current_board,is_double){
		if(is_double){
			for (const i in current_board) {
				if(current_board[i] != "double"){
					current_board[i] = parseInt(current_board[i]) * 2;
				}
			}
		}
		is_double = false;
		random_number = getRandomIntInclusive(1,16);
		result = current_board[random_number];
		if(result == "double"){
			doubles++;
			return dropChip(current_board,true);
		}else{
			return parseInt(result);
		}
	}

	function playCrazyTime(){
		crazy_multi = 1;
		doubles = 0;
		triples = 0;
		game_results = {
			"wheel_number": null,
			"doubles_hit": null,
			"triples_hit": null,
			"final_spin_result": null,
			"multiplier": null,
		}
		//First Choose Board
		game_results["wheel_number"] = getRandomIntInclusive(1,3);
		board_odds = crazyTimeWheelOdds[game_results["wheel_number"]];
		odds_obj = normalizeOddsArray(board_odds);
		total = getTotalPossibleOutcomes(board_odds);
		spin_result = spinCrazyWheel(odds_obj,total);
		game_results["final_spin_result"] = parseInt(spin_result);
		game_results["multiplier"] = crazy_multi * parseInt(spin_result);
		game_results["doubles_hit"] = doubles;
		game_results["triples_hit"] = triples;
		return game_results;
	}

	function spinCrazyWheel(odds_obj,total){
		random_number = getRandomIntInclusive(1,total);
		spin_result = odds_obj[random_number];
		switch(spin_result){
			case "double":
				doubles++;
				crazy_multi = crazy_multi * 2;
				return spinCrazyWheel(odds_obj,total);
				break;
			case "triple":
				triples++;
				crazy_multi = crazy_multi * 3;
				return spinCrazyWheel(odds_obj,total);
				break;
			default:
				return spin_result;
				break;
		}
	}

	function startSpins(){
		spin_count = Math.min( (parseInt($("#spin_count").val())|| 1), 10000);
		$("#spin_count").val(spin_count);
		setBetObject();
		use_bank_roll = setBankRollAndScalp();
		stop_spins = false;
		allow_display = true;
		simulateSpin();
	}

	function updateBankRollAndScalp(result_object){
		//console.log("BANK ROLL UPDATE");
		//console.log(result_object);
		//console.log("before",simResults);
		//bank_roll = $("#bank_roll").val();
		//scalp_percent = $("#scalp_percent").val();
		//simResults['scalp_percent'] = parseInt(scalp_percent);
		simResults['last_scalped_amount'] = 0;
		if(simResults['initial_bank_roll'] > 0){
			// Add Winnings to current bankroll
			simResults['current_bank_roll'] += result_object['total_winnings'];
			//Check for scalp
			if(simResults['current_bank_roll'] > simResults['initial_bank_roll']){
				//WE ARE UP
				//check for scalp need
				if(simResults['scalp_percent'] > 0){
					current_profit = simResults['current_bank_roll'] - simResults['initial_bank_roll'];
					scalp_min = simResults['initial_bank_roll'] * (simResults['scalp_percent']/100);
					if(current_profit >= scalp_min){
						scalp_amount = simResults['current_bank_roll'] - simResults['initial_bank_roll'];
						simResults['last_scalped_amount'] = scalp_amount;
						simResults['scalp_winnings'] += scalp_amount;
						simResults['current_bank_roll'] -= scalp_amount;
					}
				}
			}
		}
		//console.log("after:",simResults);
	}

	function setBankRollAndScalp(){
		sim_complete = false;
		if(total_spins_made == 0){
			bank_roll = $("#bank_roll").val();
			scalp_percent = $("#scalp_percent").val();
			simResults['scalp_percent'] = parseInt(scalp_percent);
			if(bank_roll > 0){
				//console.log("bankroll set");
				simResults['initial_bank_roll'] = parseInt(bank_roll);
				simResults['current_bank_roll'] = parseInt(bank_roll);
				return true;
			}else{
				return false;
			}
		}
	}

	function resetSimResults(){
		simResults = {
			"total_spins":0,
			"initial_bank_roll":0,
			"current_bank_roll":0,
			"scalp_percent":0,
			"scalp_winnings":0,
			"last_scalped_amount":0,
			"total_wagered":0,
			"winning_spins":0,
			"gross_winnings":0,
			"even_spins":0,
			"net_winnings":0,
			"losing_spins":0,
			"roi":0,
			"bonus_games":0,
			"total_bonus_games":0,
			"multi_hits":0,
			"spin_wager_amount":0,
		}
	}

	function clearResults(){
		stop_spins = true;
		use_bank_roll = 0;
		total_spins_made = 0;
		$("#result_ul").html("");
		$("#simulation_results td.sim_result").html("0");
		resetSimResults();

		
		//multiSimOutcomes = [];
	}

	function recordSimResults(result_object){
		//console.log(result_object);
		/*simResults = {
			"total_spins":0,
			"total_wagered":0,
			"winning_spins":0,
			"gross_winnings":0,
			"even_spins":0,
			"net_winnings":0,
			"losing_spins":0,
			"roi":0,
			"bonus_games":0,
			"multi_hits":0,
		}*/
		simResults['total_spins']++;
		simResults['total_wagered'] += simResults['spin_wager_amount'];

		switch(result_object['outcome']){
			case "loss":
				simResults['losing_spins']++;
				break;
			default:
				if(result_object['total_winnings'] > simResults['spin_wager_amount']){
					simResults['winning_spins']++;
					//WON MONEY
				}else{
					simResults['even_spins']++;
					//BREAK EVEN
				}
				if(result_object['wheel_result'] == result_object['top_spin_game']){
					simResults['multi_hits']++;
					//WON MONEY
				}
				simResults['gross_winnings'] +=  parseInt(result_object['total_winnings']);
				break;

		}
		simResults['net_winnings'] =  simResults['gross_winnings'] - simResults['total_wagered'];
		simResults['roi'] =  simResults['gross_winnings'] / simResults['total_wagered'];
		simResults['seconds'] = (simResults['total_bonus_games'] * 97) + ((simResults['total_spins'] - simResults['total_bonus_games']) * 27);
		updateBankRollAndScalp(result_object);
		displayResults(simResults);
		if(run_method){
			updateBet(result_object);
		}
		//console.log(simResults);
		
		
	}

	function displayResults(result_object){
		if(!allow_display){
			return false;
		}
		//console.log("DISPLAY TIME",result_object);
		$("#roi").html((result_object['roi'] || 0).toPrecision(4));
		$("#total_wagered").html((result_object['total_wagered']).toLocaleString('en-US', {
		  style: 'currency',
		  currency: 'USD',
		}));
		  
		$("#gross_winnings").html((result_object['gross_winnings']).toLocaleString('en-US', {
		  style: 'currency',
		  currency: 'USD',
		}));
		$("#net_winnings").html((result_object['net_winnings']).toLocaleString('en-US', {
		  style: 'currency',
		  currency: 'USD',
		}));
		$("#scalped_winnings").html((result_object['scalp_winnings']).toLocaleString('en-US', {
		  style: 'currency',
		  currency: 'USD',
		}));
		$("#total_spins").html((result_object['total_spins']).toPrecision(4));
		$("#winning_spins").html((result_object['winning_spins']).toPrecision(4));
		$("#losing_spins").html((result_object['losing_spins']).toPrecision(4));
		$("#even_spins").html((result_object['even_spins']).toPrecision(4));
		$("#bonus_games").html((result_object['bonus_games']).toPrecision(4));
		$("#multi_hits").html((result_object['multi_hits']).toPrecision(4));
		
		$("#time_spent").html(new Date(result_object['seconds'] * 1000).toISOString().substr(11, 8));
		$("#current_bankroll").html((result_object['current_bank_roll']).toLocaleString('en-US', {
		  style: 'currency',
		  currency: 'USD',
		}));
	}

	function updateBet(result_object){
		//console.log(result_object);
		games = betMethod[result_object["outcome"]];
		for (const i in games) {
			game = i;
			changes = games[i];
			field = $("#bet_" + game);
			if(changes['set']){
				field.val(changes['set']);
			}else if(changes['increment']){
				cv = parseInt(field.val());
				nv = cv + changes['increment'];
				if(changes['max']){
					if(nv > changes['max']){
						nv = cv;
					}
				}
				field.val(nv);
			}
		}
		setBetObject();
		//console.log(changes);
	}
	var run_method = 0;

	var betMethod = {
		"loss":{
			"crazy_time":{
				"increment":1,
				"max":10,
			},
			"2":{
				"increment":1,
				"max":10,
			}
		},
		"win":{
			"crazy_time":{
				"set":1,
			},
			"2":{
				"set":1,
			}
		}
	}

	function setBetObject(){
		if(run_method || total_spins_made == 0){
			$(".bet_input").prop( "disabled", false );
			//console.log("Setting Bet");
			betData = {
				"1":	parseInt($("#bet_1").val())|| 0,
				"2":parseInt($("#bet_2").val())|| 0,
				"5":parseInt($("#bet_5").val())|| 0,
				"10":parseInt($("#bet_10").val())|| 0,
				"coin_flip":parseInt($("#bet_coin_flip").val())|| 0,
				"pachinko":parseInt($("#bet_pachinko").val())|| 0,
				"cash_hunt":parseInt($("#bet_cash_hunt").val())|| 0,
				"crazy_time":parseInt($("#bet_crazy_time").val())|| 0
			}
			tw = 0;
			for (const i in betData) {
				tw += parseInt(betData[i]);
			}
			simResults['spin_wager_amount'] = tw;
			$("#spin_wager").html((simResults['spin_wager_amount']).toLocaleString('en-US', {
			  style: 'currency',
			  currency: 'USD',
			}));
			//console.log(betData);
		}else{
			$(".bet_input").prop( "disabled", true );
		}
	}

	function clearBet(){
		$("#bet_1, #bet_2, #bet_5, #bet_10, #bet_coin_flip, #bet_pachinko, #bet_cash_hunt, #bet_crazy_time, #bank_roll, #scalp_percent").val(0);
	}

	function showWinners(){
		$("#result_ul").find("table:not(.winner)").hide();
	}

	function showAll(){
		$("#result_ul").find("table").show();
	}

	function sortListBy(data_point){
		return function(a,b){
			return ($(b).data(data_point)) > ($(a).data(data_point)) ? 1 : -1;  
		}
	}

	function sortList(data_point){
		$("#result_ul li").sort(sortListBy(data_point)).appendTo('#result_ul');
	}

	function multiSim(){
		total_sim_count = $("#sim_count").val() || 1;
		startSpins();
			//simulateSpin();
		//console.log("MULTI COMPLETE");
	}

	function completeSimulation(){
		sim_complete = true;
		//console.log("SIMULATION COMPLETE");
		simClone = Object.assign({}, simResults);
		multiSimOutcomes.push(simClone);
		sim_count++;
		$("#simulations_completed").html(sim_count);
		//console.log("sims completed",sim_count);
		//console.log("total_sim_count",total_sim_count);
		if(sim_count < total_sim_count){
			sim_complete = false;
			total_spins_made = 0;
			resetSimResults();
			startSpins();
		}else{
			sim_count = 0;
			if(total_sim_count>1){
				calculateMultiSimAverages();
			}
		}
	}

	function calculateMultiSimAverages(){
		console.log(multiSimOutcomes);
		total_sims = multiSimOutcomes.length;
		//SET EMPTY HOLDER
		sim_averages = {};
		for (const i in multiSimOutcomes[0]) {
			sim_averages[i] = 0;
		}
		for (const i in multiSimOutcomes) {
			sim_res = multiSimOutcomes[i];
			for(const j in sim_averages){
				sim_averages[j] += sim_res[j];
			}
		}
		for(const j in sim_averages){
			sim_averages[j] = sim_averages[j] / total_sims;
		}
		console.log(sim_averages);
		displayResults(sim_averages);
		sim_count = 0;
		total_sim_count = 0;
		allow_display = false;
		multiSimOutcomes = [];
		sim_complete = true;
		return false;
	}

	clearResults();
	var intervalId = window.setInterval(setBetObject, 100);
</script>