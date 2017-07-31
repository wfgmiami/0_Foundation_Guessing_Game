function generateWinningNumber(){
	return Math.floor(Math.random() * 100) + 1;
}

function shuffle(arr){
	var len = arr.length, i, temp;

	while(len){
		i = Math.floor(Math.random() * len--)
		temp = arr[len];
		arr[len] = arr[i];
		arr[i] = temp;
		
	}
	return arr;	
}

function Game(){
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
	return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
	return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num){

	if(num < 1 || num > 100 || isNaN(num)){
		throw new Error("Invalid input. Try again!");
	}
	
	this.playersGuess = num;
	return this.checkGuess();
}


Game.prototype.checkGuess = function(){

	if (this.difference() === 0){
		return "You Win!";

	}else if(this.pastGuesses.indexOf(this.playersGuess) > -1){
		return "You have already guessed that number.";

	}else{
		this.pastGuesses.push(this.playersGuess);
	}

	if (this.pastGuesses.length === 5){
		return "You Lose.";

	}else if(this.difference() < 10){
		return 'You\'re burning up!';

	}else if(this.difference() < 25){
		return 'You\'re lukewarm.';

	}else if(this.difference() < 50){
		return 'You\'re a bit chilly.';

	}else if(this.difference() < 100){
		return 'You\'re ice cold!';

	}else{
		return "";
	}
}	

var newGame = function(){
	var obj = new Game();
	return obj;
}

Game.prototype.provideHint = function(){
	var hint = [];
	hint.push(this.winningNumber);
	hint.push(generateWinningNumber());
	hint.push(generateWinningNumber());
	hint = shuffle(hint);
	return "The winning number is " + hint[0] + ", " + hint[1] + ", or " + hint[2];
}

var resetLi = function(){
	$("#guess-list .guess").each(function(index, li){
		$(li).text("-");	
	})
}

var madeGuess = function(game){
		var guess = +$("#player-input").val();
		console.log(game.winningNumber);
		var listItem = $("#guess-list .guess");
		var flag = true;
		var er = false;
		var check = game.pastGuesses.indexOf(guess);

		try{
			var output = game.playersGuessSubmission(guess);
		}catch(err){
			er = true;
			alert(err);
		}

		if (check === -1 && game.difference() !== 0 && !er){
				listItem.each(function(index, li){

					if($(li).text() === "-" && flag){
						$(li).text(game.pastGuesses[game.pastGuesses.length - 1])
						flag = false;
				}
			})
		}
		
		$("#title").text(output);

		if ((game.difference() == 0 || game.pastGuesses.length === 5) && !er){
			$("#subtitle").text("Click the Reset button to play again");
			$("#submit").attr("disabled", true);
			$("#hint").attr("disabled", true);

		}else if(game.isLower() && !er){
			$("#subtitle").text("Guess higher!");
		}else if (!er){
			$("#subtitle").text("Guess lower!");
		}

		$("#player-input").val("");

	}

$(document).ready(function(){
	var game = new Game();


	$("#submit").click(function(event){
		madeGuess(game);
	})

	$("#hint").click(function(){
		$("#title").text(game.provideHint());
	})

	$("#reset").click(function(){
		game = new Game();
		$("#title").text("Play the Guessing Game!");
		$("#subtitle").text("Guess a number between 1-100!");
		resetLi();
		$("#submit").attr("disabled", false);
		$("#hint").attr("disabled", false);

	})

	$("#player-input").keypress(function(event){
		if (event.which === 13){
			madeGuess(game);
		}
	});
})