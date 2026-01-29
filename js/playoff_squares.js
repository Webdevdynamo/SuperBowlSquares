function sort_players_by_points(a, b){
    return (parseFloat($(b).data('total-points'))) < (parseFloat($(a).data('total-points'))) ? -1 : 1;    
}

function sort_players_by_name(a, b){
    return ($(b).data('name')) < ($(a).data('name')) ? 1 : -1;    
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

var game = {};

	game.players = null;
	game.scores = null;
	game.colors = null;
	game.board = null;
	game.board_holder = null;
	game.player_holder = null;
	game.board_width = 0;
	game.square_count = 10;
	game.season_type = "playoffs";
	game.live_refresh = 10;
	game.dead_refresh = 60;
	game.current_refresh = 30;
	game.super_bowl = {};
	game.away_team_label = "";
	game.home_team_label = "";
	game.og_time = null;
	game.next = true;
	game.first_draw = true;

	game.loadGame = function(type){
		game.season_type = type;
		$.when(
			$.getJSON( "./includes/scores.php?ran="+getRandomInt(10000,99999)+"type="+game.season_type, function( data ) {
				game.scores = data;
				game.og_time = game.scores.time;
				//game.scores.time = game.og_time = Date.now() + 1000;
			}),
			$.getJSON( "./includes/players.php", function( data ) {
				//console.log("Players");
				game.players = data;
			}),
			$.getJSON( "./includes/colors.php", function( data ) {
				//console.log("Colors");
				//console.log(data);
				game.colors = data;
			}),
		).then(function() {
			//console.log("LOADED");
			game.initialize();
		});
	}

	//game.initialize = function(player_json, scores_json, colors){
	game.initialize = function(){
		$( window ).resize(function() {
			game.first_draw = false;
			game.drawBoard();
			game.scoreGames();
			game.colorSquares();
		});
		game.makeScoreTicker();
		//game.loadPlayers(player_json);
		//game.loadScores(scores_json);
		//game.loadColors(colors);
		game.drawBoard();
		game.scoreGames();
		game.getPlayerScores();
		game.makePlayerList();
		game.colorSquares();
		game.colorScore();
	}

	game.refreshScores = function(){
		clearInterval(game.countDown);
		clearInterval(game.refreshInt);
		$("#refresh-text").html("Refreshing scores...");
		console.log("REFRESHING");
		$.getJSON( "/includes/scores.php?ran="+getRandomInt(10000,99999)+"type="+game.season_type, function( data ) {
			$("#refresh-text").text(game.current_refresh);
			game.scores = data;
			game.scoreGames();
			game.getPlayerScores();
			game.makeScoreTicker();
			game.makePlayerList();
			game.colorScore();
		});
	}

	game.loadColors = function(colors){
		game.colors = colors;
		//console.log(game.players);
	}

	game.loadPlayers = function(player_json){
		game.players = player_json;
		//console.log(game.players);
	}

	game.loadScores = function(scores_json){
		game.scores = scores_json;
	}

	game.drawBoard = function(){
		$("#board-holder").html("");
		game.board_holder = $("#board-holder");
		game.board = $("<div/>")
				.attr('id','board');
		game.board_width = (Math.min(game.board_holder.width(), game.board_holder.height())) - 100;
		game.board_width = Math.ceil(game.board_width / (game.square_count +1)) * (game.square_count +1);
		game.board.width(game.board_width - 1);
		game.board.height(game.board_width - 1);

		top_label = $("<div/>")
			.attr('id','top-label')
			.addClass("label")
			.text(game.away_team_label);
		top_label.appendTo(game.board);
		

		left_label = $("<div/>")
			.attr('id','left-label')
			.addClass("label")
			.height(game.board_width)
			.text(game.home_team_label);
		left_label.appendTo(game.board);
		squares = [];
		for(a=-1; a<game.square_count; a++){
			for(h=-1; h<game.square_count; h++){
				sq = game.createSquare(h, a);
				if(sq){
					squares.push(sq);
				}
			}
		}
		game.board.appendTo(game.board_holder);
		running = true;
		var i = 0;
		var sl = squares.length;
		game.next = true;
		var c = 0;
		game.showSquare(squares, 0, sl);
	}

	game.showSquare = function(squares, i, sl){
		square = squares[i];
		i++;
		if(i < sl){
			setTimeout(function() {
				game.showSquare(squares,i,sl);
			}, 1);
		}
		if(square.css('visibility') == "hidden"){
			square.css('visibility','visible').hide().fadeIn(100);
		}
	}

	game.createSquare = function(h, a){
		square_dim = (game.board_width/(game.square_count +1))-2;
		square = $("<div/>")
			.attr('id','square_'+h+'_'+a)
			.addClass('square')
			.width(square_dim)
			.data( "total-points", 0)
			.data( "special-points", 0)
			.height(square_dim);
		
		if(h < 0 || a < 0){
			//THIS IS A HEADER BOX
			if(a < 0 && h < 0){
				//CORNER
				square.addClass("top-row");
				square.addClass("left-row");
			}else if(a < 0){
				//TOP ROW
				square.addClass("header");
				square.css('line-height',square_dim+"px");
				square.addClass("top-row");
				square.html(h);
			}else if(h < 0){
				//LEFT ROW
				square.addClass("header");
				square.css('line-height',square_dim+"px");
				square.addClass("left-row");
				square.html(a);
			}
			game.board.append(square);
			return null;
		}else{
			//IS SCORE SQUARE
			square.css('line-height',square_dim+"px");
			square.addClass("score-square");
			if(game.first_draw){
				square.css("visibility", "hidden");
			}
			//square.html(0);
			console.log();
			square.html("");

			square.bind("mouseover",  function(event){
				player_index = $(this).data("player-index");
				player = game.players[player_index];
				score_class = $(this).attr('id').replace("square","qi");
				color = $(this).css('backgroundColor');
				//game.highlightScores(score_class, color);
				game.highlightPlayer(player.list_element);
			});
			square.bind("mouseout",  function(event){
				player_index = $(this).data("player-index");
				player = game.players[player_index];
				//console.log(player.list-element);
				score_class = $(this).attr('id').replace("square","qi");
				//game.unHighlightScores(score_class);
				game.unHighlightPlayer(player.list_element);
			});
			
			game.board.append(square);
			return square;
		}
		//square.appendTo(game.board).delay(1000).fadeIn("slow");
		
	}

	game.colorScore = function(){
		if(game.current_refresh == game.live_refresh){
			for(var q in g.quarters) {
				quarter = g.quarters[q];
				//score_class = "qi_"+quarter['home']+"_"+quarter['away'];
				score_class = "qi_"+quarter['away']+"_"+quarter['home'];
				square = [quarter['away'],quarter['home']];
				color = game.getSquareColor(square);
				game.highlightScores(score_class, color);
			}
		}
	}


	game.getSquareColor = function(square){
		color = $("#square_"+square[0]+"_"+square[1]+"").css('backgroundColor');
		return color;
	}

	game.scoreGames = function(){
		//$("#board").find(".score-square").text(0).data("total-points", 0).data("special-points", 0);
		//$("#board").find(".score-square").text("").data("total-points", 0).data("special-points", 0);
		//for(w = 0; w < game.scores.length; w++){
			//week = game.scores[w];
			//for(i = 0; i < week.games.length; i++) {
		game_complete = false;
		if(g.winner){
			game_complete = true;
		}
		completed_quarters = [];
		previous_q = 0;
		for(var q in g.score) {
			if(g.score[q]['away'] != "-"){
				current_score = g.score[q];
				if(previous_q > 0){
					completed_quarters.push(previous_q);
				}
			}
			previous_q = q;
		}
		if(game_complete){
			completed_quarters.push("4");
		}
		$(".score-square").data("total-points", 0);
		$(".score-square").data("total-winnings", 0);
		for(var q in completed_quarters) {
			quarter = completed_quarters[q];
			payout = g.payouts[quarter];
			square_id = "square_"+ g.quarters[quarter].away +"_"+ g.quarters[quarter].home;
			
			square = $("#"+square_id);
			current_points = square.data("total-points");
			total_winnings = square.data("total-winnings");
			new_winnings = total_winnings + payout;
			//console.log(new_winnings);
			square.data( "total-winnings", new_winnings);
		}
		return false;
				g = game.scores;
				if(g.point_weight > 1){
					for(var q in g.score) {
						if(g.score[q]['away'] != "-"){
							current_score = g.score[q];
						}
					}
					game.super_bowl['total_score'] = current_score['away'] + current_score['home'];
					game.super_bowl['away'] = current_score['away'];
					game.super_bowl['home'] = current_score['home'];
				}
				point_weight = g.point_weight;
				for(var q in g.quarters) {
					quarter = g.quarters[q];
					square = $("#square_"+quarter['home']+"_"+quarter['away']+"");
					
					current_points = square.data("total-points");
					current_winnings = square.data("total-winnings");
					special_points = square.data("special-points");
					if(!current_points){
						current_points = 0;
					}
					if(!special_points){
						special_points = 0;
					}
					current_points += (1 * point_weight);
					if(point_weight>1){
						special_points += (1 * point_weight);
					}
					square
						.data( "total-points", current_points)
						.data( "special-points", special_points)
						.data( "total-winnings", current_winnings)
						.text(parseFloat(current_points));
				}
				//return;
			//}
		//}
	}

	game.getPlayerScores = function(){
		for(i = 0; i < game.players.length; i++) {
			player = game.players[i];
			player.index = i;
			player.points = 0;
			player.special_points = 0;
			player.total_winnings = 0;
			for(k = 0; k < player.squares.length; k++) {
				square = player.squares[k];
				player.points += game.getSquareScore(square[0], square[1], false);
				//player.special_points += game.getSquareScore(square[0],square[1], true);
				player.total_winnings += game.getSquareScore(square[0],square[1], true);
			}
			//console.log(game.players[i]);
		}
		//console.log(game.players);
	}

	game.getSquareScore = function(h, a, special_points){
		square_temp = $("#square_"+h+"_"+a+"");
		if(special_points){
			return parseFloat(square_temp.data("total-winnings"));
		}else{
			return parseFloat(square_temp.data("total-points"));
		}
		//return parseFloat(square.text());
	}

	game.makePlayerList = function(){
		
		let USDollar = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		});
		game.player_holder = $("#player-list-holder").html(" ");
		var data = {
			'name': 'Name',
			'points': 'Points',
		}
		var s = $('<select />');
		for(var val in data) {
			$('<option />', {value: val, text: data[val]}).appendTo(s);
		}
		
		var d = $('<div>Sort by: </div>');
		s.appendTo(d);
		//d.appendTo(game.player_holder);

		game.player_list = $("<ul/>")
				.attr('id','player-list');
		players = game.players;
		super_bowl = false;
		if(Object.keys(game.super_bowl).length === 0 && game.super_bowl.constructor === Object){
		}else{
			super_bowl = true;
		}
		for(i = 0; i < players.length; i++) {
			//console.log(game.super_bowl);
			player = players[i];
			if(player.squares.length == 0){
				continue;
			}
			if(!player.away_score){
				player.away_score = 0;
			}
			if(!player.home_score){
				player.home_score = 0;
			}
			player.total_score = (player.away_score + player.home_score);
			player.total_score_diff = Math.abs(game.super_bowl['total_score'] - player.total_score);
			player.team_score_diff = Math.abs(game.super_bowl['away'] - player.away_score) + Math.abs(game.super_bowl['home'] - player.home_score);

			if(super_bowl){
				player.master_points = player.points + '' + (1000-player.total_score_diff) + '' + player.special_points + '' + (1000-player.team_score_diff);
			}else{
				player.master_points = player.points
			}
			total_winnings_display = "";
			if(player.total_winnings > 0){
				total_winnings_display = USDollar.format(player.total_winnings);
			}

			
			//console.log(player);

			list_player = $("<li/>")
				.attr('id','player_' + player.index)
				.addClass('player')
				.data( "points", player.points)
				.data( "special-points", player.special_points)
				.data( "total-points", player.master_points)
				.data( "name", player.name);
			//console.log(list_player.data());

			color_swatch = $("<div/>")
				.css("backgroundColor", game.colors[player.index])
				.addClass("player-info")
				.addClass("player-swatch");

			player_name = $("<div/>")
				.addClass("player-info")
				.addClass("player-name")
				.text(player.name + " ("+player.squares.length+")");

			player_points = $("<div/>")
				.addClass("player-info")
				.addClass("player-points")
				.text(total_winnings_display);
				//.text("");

			

			player_secondary = $("<div/>")
				.addClass("player-secondary");

			player_sb_points = $("<div/>")
				.addClass("player-info")
				.addClass("player-special-points")
				.text("SB Points: " + player.special_points);

			player_game_score = $("<div/>")
				.addClass("player-info")
				.addClass("player-game-score")
				//.text("Guessed SB Score: " + player.away_score + "-" + player.home_score);
				.text("");

			player_ts_diff = $("<div/>")
				.addClass("player-info")
				.addClass("player-game-score")
				.text("Total Differential: " + player.total_score_diff);

			player_team_diff = $("<div/>")
				.addClass("player-info")
				.addClass("player-game-score")
				.text("Team Differential: " + player.team_score_diff);

			player.list_element = list_player;

			list_player.append(color_swatch);
			list_player.append(player_name);
			list_player.append(player_points);
			player_secondary.append(player_game_score);

			if(super_bowl){
				player_secondary.append(player_ts_diff);
				player_secondary.append(player_sb_points);
				player_secondary.append(player_team_diff);
				player_secondary.append($("<div style='clear:both;'/>"));
			}
			list_player.append(player_secondary);

			game.player_list.append(list_player);
			list_player.bind("mouseover", {player:player} , function(event){
				var data = event.data;
				player = data.player;
				squares = player.squares;
				game.highlightSquares(squares);
				game.highlightPlayer(player.list_element);
			});
			list_player.bind("mouseout", {player:player} , function(event){
				var data = event.data;
				player = data.player;
				game.unhighlightSquares();
				game.unHighlightPlayer(player.list_element);
			});
		}
		game.player_holder.append(game.player_list);
		$("#player-list li").sort(sort_players_by_name).appendTo('#player-list');
		s.bind("change", function(event){
			sort_by = $(this).val();
			switch(sort_by){
				case "points":
					$("#player-list li").sort(sort_players_by_points).appendTo('#player-list');
					break;
				case "name":
					$("#player-list li").sort(sort_players_by_name).appendTo('#player-list');
					break;
			}
			console.log(sort_by);
		});
	}

	game.highlightPlayer = function(player){
		player.addClass("active-player");
	}	

	game.unHighlightPlayer = function(player){
		player.removeClass("active-player");
	}

	game.highlightScores = function(score_class, color){
		$("#game-container").find("."+score_class).css("backgroundColor", color);
	}

	game.unHighlightScores = function(score_class){
		$("#game-container").find("."+score_class).css("backgroundColor", "transparent");
	}

	game.colorSquares = function(){
		for(i = 0; i < game.players.length; i++) {
			player = game.players[i];
			color = game.colors[player.index];
			for(k = 0; k < player.squares.length; k++) {
				square = player.squares[k];
				game.colorSquare(color, square[0],square[1],player.index);
			}
		}
	}

	game.colorSquare = function(color, h, a, player_index){
		player = game.players[player_index];
		//console.log(player);
		square = $("#square_"+h+"_"+a+"");
		square.css("backgroundColor", color);
		square.data( "player-index", player_index);
		square.text(player.initials);
	}

	game.classToCoords = function(class_name){
		class_name = class_name.replace("qi_","");
		class_name = class_name.replace("square_","");
		if(class_name == "-_-"){
			return null;
		}
		class_name = class_name.split("_");
		return class_name;
	}

	game.highlightSquare = function(score_class){
		$("."+score_class).addClass("active-score");
		score_class = game.classToCoords(score_class);
		squares = [];
		squares.push(score_class);
		if(game.live && score_class){
			game.highlightSquares(squares);
		}
		//$("#game-container").find("."+score_class).addClass("active-score");
		//$("#game-container").find("."+score_class).css("backgroundColor", color);
	}

	game.unHighlightSquare = function(){
		if(game.live){
			game.unhighlightSquares();
		}
	}

	game.highlightSquares = function(squares){
		for(a=-1; a<game.square_count; a++){
			for(h=-1; h<game.square_count; h++){
				if(h >=0 && a>=0){
					$("#square_"+h+"_"+a+"").css({ 'opacity' : 0.25 });
					$("#square_"+h+"_"+a+"").css('box-shadow', 'none');
				}
			}
		}
		for(k = 0; k < squares.length; k++) {
			square = squares[k];
			sq_element = $("#square_"+square[0]+"_"+square[1]+"");
			sq_element.css({ 'opacity' : 1 });
			sq_element.css('box-shadow', '5px 5px 5px #888');
		}
	}

	game.unhighlightSquares = function(){
		
		$(".quarter-score").removeClass("active-score");
		for(a=-1; a<game.square_count; a++){
			for(h=-1; h<game.square_count; h++){
				if(h >=0 && a>=0){
					$("#square_"+h+"_"+a+"").css({ 'opacity' : 1 });
					$("#square_"+h+"_"+a+"").css('box-shadow', 'none');
				}
			}
		}
	}

	game.makeScoreTicker = function(){
		let USDollar = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		});
		console.log(game.scores);
		
		gameDate = new Date();
		gameDate.setTime(game.scores.time);
		square_price = USDollar.format(game.scores.square_price);

		$("#game_year").html(gameDate.getFullYear());
		$("#game_date").html(gameDate.toLocaleDateString());

		$("#square_cost").html(square_price);

		$("#payout_q1").html(USDollar.format(game.scores.payouts["1"]));
		$("#payout_q2").html(USDollar.format(game.scores.payouts["2"]));
		$("#payout_q3").html(USDollar.format(game.scores.payouts["3"]));
		$("#payout_q4").html(USDollar.format(game.scores.payouts["4"]));

		game.scores_holder = $("#game-scores").html(" ");
		game_container = $("<div/>").attr("id", "game-container");

		var data = {
			'playoffs': 'Playoffs',
			'full': 'Full Season'
		}

		
		var s = $('<select />');
		for(var val in data) {
			selected = false;
			if(game.season_type == val){
				console.log(val);
				selected = " selected";
			}
			$('<option />', {value: val, text: data[val]})
				.attr("selected", selected)
				.appendTo(s);
		}
		
		var d = $('<div class="season_type"><div id="refresh-text"></div></div>');
		//s.prependTo(d);
		//d.appendTo(game.scores_holder);
		//console.log(game.scores);
		
		s.bind("change", function(event){
			sort_by = $(this).val();
			game.season_type = sort_by;
			game.refreshScores();
			//window.location.href = 'http://ff.spindleco.com/?type='+sort_by;
			/*switch(sort_by){
				case "full":
					window.location.href = 'http://ff.spindleco.com/?type=full';
					break;
				case "playoffs":
					window.location.href = 'http://ff.spindleco.com/?type=playoffs';
					break;
			}*/
		});

		if(Date.now() >= game.og_time){
			//console.log('live');
			game.live = true;
			game.current_refresh = game.live_refresh;
		}else{
			//console.log('dead');
			//console.log('start time:',game.og_time);
			game.live = false;
			game.current_refresh = game.dead_refresh;
			
			game.checkForGameStart = setInterval(function(){
				if(Date.now() >= game.scores.time){
					console.log("GAME STARTED!!!");
					clearInterval(game.checkForGameStart);
					game.refreshScores();
				}else{
					//console.log(Date.now());
					//console.log("GAME NOT STARTED");
				}
			}, 10000);
		}
		

		game.countDown = setInterval(function(){
			$("#refresh-text").text($("#refresh-text").text() - 1);
		}, 1000);
		game.refreshInt = setInterval(function(){
			game.refreshScores();
		}, game.current_refresh * 1000);
		
		//for(w = 0; w < game.scores.length; w++){
			/*week = game.scores;
			console.log(week);
			week.week = week.week.replace("Playoffs", "");
			week_label = $("<div/>")
				.addClass("week-label")
				.html("<div class='week-holder'>" + week.week + "<div>");
			game_container.append(week_label);*/
			//for(k = 0; k < week.games.length; k++) {
				/*if(k % 2 == 0){
					game_column = $("<div/>")
						.addClass("game-column");
				}*/
				
				game_column = $("<div/>")
					.addClass("game-column");
				g = game.scores;
				
				//console.log(g.quarters);
				away_total = 0;
				home_total = 0;
				for(var p in g.score) {
				//for(p = 1; p <= g.score.length; p++) {
					//console.log(g.score[p]['away']);
					if(parseInt(g.score[p]['away'])){
						away_total = parseInt(g.score[p]['away']);
					}
					if(parseInt(g.score[p]['home'])){
						home_total = parseInt(g.score[p]['home']);
					}
					//away_total = parseInt(g.score[1]['away']) + parseInt(g.score[2]['away']) + parseInt(g.score[3]['away']) + parseInt(g.score[4]['away']);
					
					//home_total = parseInt(g.score[1]['home']) + parseInt(g.score[2]['home']) + parseInt(g.score[3]['home']) + parseInt(g.score[4]['home']);
				}
				game_holder = $("<div/>")
					.addClass("game-holder");

				game_table = $("<table/>")
					.addClass("game-table");

				away_win_class = "";
				home_win_class = "";
				if(g.winner == "away_team"){
					away_win_class = " winning-team";
					home_win_class = "";
				}else if(g.winner == "home_team"){
					home_win_class = " winning-team";
					away_win_class = "";
				}
				/*quarter_classes = {
					"1"	:	"qi_" + g.quarters[1]['home'] + "_" + g.quarters[1]['away'],
					"2"	:	"qi_" + g.quarters[2]['home'] + "_" + g.quarters[2]['away'],
					"3"	:	"qi_" + g.quarters[3]['home'] + "_" + g.quarters[3]['away'],
					"4"	:	"qi_" + g.quarters[4]['home'] + "_" + g.quarters[4]['away'],
				};*/
				quarter_classes = {
					"1"	:	"qi_" + g.quarters[1]['away'] + "_" + g.quarters[1]['home'],
					"2"	:	"qi_" + g.quarters[2]['away'] + "_" + g.quarters[2]['home'],
					"3"	:	"qi_" + g.quarters[3]['away'] + "_" + g.quarters[3]['home'],
					"4"	:	"qi_" + g.quarters[4]['away'] + "_" + g.quarters[4]['home'],
				};
				//console.log(quarter_classes);return false;
				game.away_team_label = g.away_team['team']['name']['rawName'];
				game.home_team_label = g.home_team['team']['name']['rawName'];
				//console.log(quarter_classes);
				away_row = $("<tr/>")
					.addClass("game-away-row")
					.html("<td class='team-name "+away_win_class+"'>"+g.away_team['team']['name']['rawName']+"</td><td class='team-logo'><img src='./images/logos/"+g.away_team['team']['name']['rawName']+" Logo.png' /></td><td class='quarter-score "+quarter_classes[1]+"' onmouseout='javascript:game.unHighlightSquare();'  onmouseover='javascript:game.highlightSquare(\""+quarter_classes[1]+"\");'>"+g.score[1]['away']+"</td><td class='quarter-score "+quarter_classes[2]+"' onmouseout='javascript:game.unHighlightSquare();'  onmouseover='javascript:game.highlightSquare(\""+quarter_classes[2]+"\");'>"+g.score[2]['away']+"</td><td class='quarter-score "+quarter_classes[3]+"' onmouseout='javascript:game.unHighlightSquare();' onmouseover='javascript:game.highlightSquare(\""+quarter_classes[3]+"\");'>"+g.score[3]['away']+"</td><td class='quarter-score "+quarter_classes[4]+"' onmouseout='javascript:game.unHighlightSquare();' onmouseover='javascript:game.highlightSquare(\""+quarter_classes[4]+"\");'>"+g.score[4]['away']+"</td>");

				home_row = $("<tr/>")
					.addClass("game-home-row")
					.html("<td class='team-name "+home_win_class+"'>"+g.home_team['team']['name']['rawName']+"</td><td class='team-logo'><img src='./images/logos/"+g.home_team['team']['name']['rawName']+" Logo.png' /></td><td class='quarter-score "+quarter_classes[1]+"' onmouseout='javascript:game.unHighlightSquare();' onmouseover='javascript:game.highlightSquare(\""+quarter_classes[1]+"\");'>"+g.score[1]['home']+"</td><td class='quarter-score "+quarter_classes[2]+"' onmouseout='javascript:game.unHighlightSquare();' onmouseover='javascript:game.highlightSquare(\""+quarter_classes[2]+"\");'>"+g.score[2]['home']+"</td><td class='quarter-score "+quarter_classes[3]+"' onmouseout='javascript:game.unHighlightSquare();' onmouseover='javascript:game.highlightSquare(\""+quarter_classes[3]+"\");'>"+g.score[3]['home']+"</td><td class='quarter-score "+quarter_classes[4]+"' onmouseout='javascript:game.unHighlightSquare();' onmouseover='javascript:game.highlightSquare(\""+quarter_classes[4]+"\");'>"+g.score[4]['home']+"</td>");

				game_table.append(away_row);
				game_table.append(home_row);
				game_holder.append(game_table);
				game_column.append(game_holder);
				game_container.append(game_column);
				/*
				
				score_class = $(this).attr('id').replace("square","qi");
				color = $(this).css('backgroundColor');
				game.highlightScores(score_class, color);
				*/
			//}
		//}
		game.scores_holder.append(game_container);
		$("#refresh-text").text(game.current_refresh);
	}
