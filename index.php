<html>
<head>
<title>Super Bowl Squares</title>
<link rel="shortcut icon" type="image/png" href="./images/favicon.png"/>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
<link rel="stylesheet" href="./css/playoff_squares.css">
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
<script src="./js/playoff_squares.js"></script>
</head>
<body>

<div id="wrapper">
	<table id="master-table" cellpadding=0 cellspacing=0>
		<tr>
			<td id="top">
				<div id="title">
					<div class="game-title"><span id='game_year'>2024</span> Super Bowl Squares</div><br>
					<div class="game-rules">
					Q1 = <span id='payout_q1'>50.00</span> Q2 = <span id='payout_q2'>50.00</span> Q3 = <span id='payout_q3'>50.00</span> Final = <span id='payout_q4'>50.00</span><br>
					Game played on <span id='game_date'>2/11</span><br>
					<span id='square_cost'>50.00</span> a Square
					</div>
					<!--<div class="game-scoring">
						<table cellspacing="10px">
							<tr>
								<td>
									<u>Weekend 1</u><br>
									4 games - 16 Quarters<br>
									16 points available
								</td>
								<td>
									<u>Weekend 3</u><br>
									4 games - 16 Quarters<br>
									16 points available
								</td>
							</tr>
							<tr>
								<td>
									<u>Weekend 2</u><br>
									4 games - 16 Quarters<br>
									16 points available
								</td>
								<td>
									<u>Superbowl 2x Points</u><br>
									1 games - 4 Quarters<br>
									8 points available
								</td>
							</tr>
						</table>
					</div>-->
				</div>
				<div id="game-scores"></div>
			</td>
		</tr>
		<tr>
			<td id="middle">
				<div id="player-list-holder"></div>
				<div id="board-holder"></div>
			</td>
		</tr>
	</table>
</div>


<script type="text/javascript">
game.loadGame("<?=$_REQUEST['type']?>");
</script>
</body>
</html>