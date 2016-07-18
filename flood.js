window.onload = function(){
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var colors = ['#FF0000', '#FFA500', '#FFFF00', '#00CC00', '#0066FF', '#BB00FF'];
	var x, y;
	var moves = 0;

	var clicked = 0;

	//returns 1 if array is not in the array and 0 otherwise
	function notIn(baseArray, element){
		var count;
		for(arr in baseArray){
			count = 0;
			for(var i = 0; i < element.length; i++){
				if(element[i] == baseArray[arr][i]){
					count += 1;
				}
			}
			if(count == element.length){
				return 0;
			}
		}
		return 1;
	}

	//Board Prototype
	var Board = function(){
		//The color values of all squares
		this.grid = [[],[],[],[],[],[],[],[],[],[]];
		//The squares that are connected to the first square by color
		this.connected = [];
		//Framecount for winning animation
		this.frameCount = 1;
		//Status of game
		this.gameOver = 0;

		this.updatePosition = function(){
			if(canvas.width > canvas.height){
				this.height = canvas.height * .7;
			}
			else{
				this.height = canvas.width * .7;
			}
			this.width = this.height;
			this.leftEdge = (canvas.width - this.width)/2;
			this.topEdge = canvas.height * .1;
		}

		this.randomizeGrid = function(){
			for(var i = 0; i < 10; i++){
				for(var j = 0; j < 10; j++){
					this.grid[i][j] = colors[Math.floor(Math.random() * 6)]
				}
			}
		}

		this.flood = function(color){
			for(var i = 0; i < this.connected.length; i++){
				this.grid[this.connected[i][0]][this.connected[i][1]] = color;
			}
		}

		this.clearConnections = function(){
			this.connected = [];
		}

		this.updateConnections = function(color, xVal, yVal){
			var current = [xVal, yVal];
			var next;
		
			//push to connected
			if(notIn(this.connected, current)){
				this.connected.push(current);
			
				//debugger;
				
				//recursivly call updateConnections on adjacent squares of same color
				
				//left
				if(xVal > 0 && this.grid[xVal - 1][yVal] == color){
					next = [xVal-1, yVal];	
					this.updateConnections(color, xVal-1, yVal);
				}
				
				//right
				if(xVal < 9 && this.grid[xVal + 1][yVal] == color){
					next = [xVal+1, yVal];	
					this.updateConnections(color, xVal+1, yVal);
				}

				//up
				if(yVal > 0 && this.grid[xVal][yVal - 1] == color){
					next = [xVal, yVal-1];	
					this.updateConnections(color, xVal, yVal-1);
				}

				//down
				if(yVal < 9 && this.grid[xVal][yVal + 1] == color){
					next = [xVal, yVal+1];	
					this.updateConnections(color, xVal, yVal+1);
				}
			}
		}

		this.checkIfMove = function(color){
			if(this.grid[0][0] != color && !this.gameOver){
				return 1;
			}
			else{
				return 0;
			}
		}

		this.checkWin = function(){
			if(this.connected.length == 100){
				this.gameOver = 1;
			}
		}

		this.won = function(){
			if(this.frameCount <= 60){
				//ctx.fillRect(this.leftEdge, (this.topEdge-this.height) + (this.height * this.frameCount/60), this.width, this.height);
				//ctx.fillRect(this.leftEdge-this.width + (this.width * this.frameCount/60), this.topEdge, this.width, this.height);
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(this.leftEdge, this.topEdge, this.width * (Math.pow(this.frameCount, .5)/Math.pow(60, .5)), this.height * (Math.pow(this.frameCount, .5)/Math.pow(60, .5)));

			
				ctx.fillStyle = "#F0F0F0";
				ctx.fillRect((this.leftEdge + this.width) - ((this.width/5) * (Math.pow(this.frameCount, .5)/Math.pow(60, .5))), this.topEdge - (this.height/10), this.width/5, this.height/10);
				//Reset the board on frame 60
				if(this.frameCount == 60){
					moves = 0;
					this.randomizeGrid();
					this.clearConnections();
					this.updateConnections(this.grid[0][0], 0, 0);
				}
				this.frameCount++ 
			}
			else if(this.frameCount <= 84){
				if(this.frameCount <= 64){
					ctx.fillStyle = "#FF0000";						
				}
				else if(this.frameCount > 64 && this.frameCount <= 68){
					ctx.fillStyle = "#FFA500";	
				}
				else if(this.frameCount > 68 && this.frameCount <= 72){
					ctx.fillStyle = "#FFFF00";
				}
				else if(this.frameCount > 72 && this.frameCount <= 76){
					ctx.fillStyle = "#00CC00";					
				}
				else if(this.frameCount > 76 && this.frameCount <= 80){
					ctx.fillStyle = "#0066FF";					
				}
				else{
					ctx.fillStyle = "#BB00FF";
				}
				ctx.fillRect(this.leftEdge, this.topEdge, this.width, this.height);

				ctx.fillStyle = "#F0F0F0";
				ctx.fillRect((this.leftEdge + this.width) - (this.width/5), this.topEdge - (this.height/10), this.width/5, this.height/10);

				this.frameCount++;
			}
			else if(this.frameCount > 84 && this.frameCount <= 144){
				ctx.fillStyle = "#FFFFFF";
				//ctx.fillRect(this.leftEdge + (this.width * (this.frameCount - 60)/60), this.topEdge, this.width, this.height);
				ctx.fillRect(this.leftEdge, this.topEdge, this.width * (1-(Math.pow(this.frameCount-84, 2)/Math.pow(60, 2))), this.height * (1-(Math.pow(this.frameCount-84, 2)/Math.pow(60, 2))));

				ctx.fillStyle = "#F0F0F0";
				ctx.fillRect((this.leftEdge + this.width) - ((this.width/5) * (1-(Math.pow(this.frameCount-84, 2)/Math.pow(60, 2)))), this.topEdge - (this.height/10), this.width/5, this.height/10);

				this.frameCount++ 
			}
			else{
				this.frameCount = 0;
				this.gameOver = 0;
			}
		}

		this.draw = function(){

			//Draw Squares
			for(var i = 0; i < 10; i++){
				for(var j = 0; j < 10; j++){
					ctx.fillStyle = this.grid[i][j]; 
					ctx.fillRect(this.leftEdge + (i * this.width/10), this.topEdge + (j * this.height/10), this.width/10, this.height/10);
				}
			}

			//Draw Outline
			ctx.strokeStyle = "#F0F0F0";
			ctx.lineWidth = 3;
			
			ctx.beginPath();
			ctx.moveTo(this.leftEdge, this.topEdge);
			ctx.lineTo(this.leftEdge + this.width, this.topEdge);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(this.leftEdge + this.width, this.topEdge);
			ctx.lineTo(this.leftEdge + this.width, this.topEdge + this.height);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(this.leftEdge + this.width, this.topEdge + this.height);
			ctx.lineTo(this.leftEdge, this.topEdge + this.height);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(this.leftEdge, this.topEdge + this.height);
			ctx.lineTo(this.leftEdge, this.topEdge);
			ctx.stroke();

			//Draw Grid
			for(var i = 1; i < 10; i++){
				ctx.beginPath();
				ctx.moveTo(this.leftEdge + (i * this.width)/10, this.topEdge);
				ctx.lineTo(this.leftEdge + (i * this.width)/10, this.topEdge + this.height);
				ctx.stroke();
			
				ctx.beginPath();
				ctx.moveTo(this.leftEdge, this.topEdge + (i * this.height)/10);
				ctx.lineTo(this.leftEdge + this.width, this.topEdge + (i * this.height)/10);
				ctx.stroke();	
			}
		}
	}

	//Gameboard
	var board = new Board();
	board.randomizeGrid();
	board.updateConnections(board.grid[0][0], 0, 0);

	//Button Prototype
	var Button = function(){

		this.updatePosition = function(){
			if(canvas.width > canvas.height){
				this.width = canvas.height * .7;
			}
			else{
				this.width = canvas.width * .7;
			}
			//this.width = canvas.height * .7;
			this.height = this.width / 6;
			this.leftEdge = (canvas.width - this.width)/2;
			this.topEdge = canvas.height * .85;
		}

		this.isClicked = function(){
			if(y >= this.topEdge && y <= this.topEdge + this.height){
				if(x >= this.leftEdge && x < this.leftEdge + (this.width/6)){
					this.registerClick(colors[0]);
				}
				else if(x >= this.leftEdge + this.width/6 && x < this.leftEdge + (2 * this.width/6)){
					this.registerClick(colors[1]);
				}
				else if(x >= this.leftEdge + (2 * this.width/6) && x < this.leftEdge + (3 * this.width/6)){
					this.registerClick(colors[2]);
				}
				else if(x >= this.leftEdge + (3 * this.width/6) && x < this.leftEdge + (4 * this.width/6)){
					this.registerClick(colors[3]);
				}
				else if(x >= this.leftEdge + (4 * this.width/6) && x < this.leftEdge + (5 * this.width/6)){
					this.registerClick(colors[4]);
				}
				else if(x >= this.leftEdge + (5 * this.width/6) && x <= this.leftEdge + this.width){
					this.registerClick(colors[5]);
				}
			}

		}

		this.registerClick = function(color){
			//board.clearConnections();
			//board.updateConnections(board.grid[0][0], 0, 0);
			if(board.checkIfMove(color)){
				moves++;
				console.log(moves);
				board.flood(color);
				board.clearConnections();
				board.updateConnections(board.grid[0][0], 0, 0);
			}
		}

		this.draw = function(){
			ctx.fillStyle = colors[0];
			ctx.fillRect(this.leftEdge, this.topEdge, this.width/6, this.height);

			ctx.fillStyle = colors[1];
			ctx.fillRect(this.leftEdge + (this.width/6), this.topEdge, this.width/6, this.height);

			ctx.fillStyle = colors[2];
			ctx.fillRect(this.leftEdge + (2 * this.width/6), this.topEdge, this.width/6, this.height);

			ctx.fillStyle = colors[3];
			ctx.fillRect(this.leftEdge + (3 * this.width/6), this.topEdge, this.width/6, this.height);

			ctx.fillStyle = colors[4];
			ctx.fillRect(this.leftEdge + (4 * this.width/6), this.topEdge, this.width/6, this.height);

			ctx.fillStyle = colors[5];
			ctx.fillRect(this.leftEdge + (5 * this.width/6), this.topEdge, this.width/6, this.height);

			//Button grid
			ctx.strokeStyle = "#F0F0F0";
			ctx.lineWidth = 21;

			for(var i = 1; i < 6; i++){
				ctx.beginPath();
				ctx.moveTo(this.leftEdge + (i * this.width)/6, this.topEdge);
				ctx.lineTo(this.leftEdge + (i * this.width)/6, this.topEdge + this.height);
				ctx.stroke();
			}

			//Outline
			ctx.beginPath();
			ctx.moveTo(this.leftEdge, this.topEdge);
			ctx.lineTo(this.leftEdge + this.width, this.topEdge);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(this.leftEdge + this.width, this.topEdge);
			ctx.lineTo(this.leftEdge + this.width, this.topEdge + this.height);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(this.leftEdge + this.width, this.topEdge + this.height);
			ctx.lineTo(this.leftEdge, this.topEdge + this.height);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(this.leftEdge, this.topEdge + this.height);
			ctx.lineTo(this.leftEdge, this.topEdge);
			ctx.stroke();
		}
	}

	//Buttons
	var button = new Button();

	function drawBackground(){
		ctx.fillStyle = '#F0F0F0';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	function drawMovesText(color){
		var movesText = "Moves: " + moves;
		var fontText;
		if(canvas.height <= canvas.width){
			fontText = Math.floor(canvas.height/40) + "px Century Gothic";
		}
		else{
			fontText = Math.floor(canvas.width/40) + "px Century Gothic";
		}
		ctx.fillStyle = color;
		ctx.textAlign = "right";
		ctx.font = fontText;
		ctx.fillText(movesText, (board.leftEdge + board.width), (board.topEdge - (board.height/40)));
	}


	//Event Listeners

	function getMousePos(e){
		return {
			x: e.clientX,
			y: e.clientY
		};
	}
	document.addEventListener("keydown", function(e){
		//console.log("keycode: " + e.keyCode);
		if(e.keyCode == 97){
			button.registerClick(colors[3]);
		}
		if(e.keyCode == 98){
			button.registerClick(colors[4]);
		}
		if(e.keyCode == 99){
			button.registerClick(colors[5]);
		}
		if(e.keyCode == 100){
			button.registerClick(colors[0]);
		}
		if(e.keyCode == 101){
			button.registerClick(colors[1]);
		}	
		if(e.keyCode == 102){
			button.registerClick(colors[2]);
		}
		
	}, false);

	document.addEventListener("mousemove", function(e){
		var mousePos = getMousePos(e);
		x = mousePos.x;
		y = mousePos.y;
	}, false);

	document.addEventListener('mousedown', function(event){
		//If freshly clicked, loop through all the buttons and check if they've been clicked
		if(!clicked){
			button.isClicked();
			clicked = 1;
		}
	}, false);

	document.addEventListener('mouseup', function(event){
		clicked = 0;
	}, false);

	window.addEventListener('resize', resizeCanvas, false);
	function resizeCanvas(){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		board.updatePosition();
		button.updatePosition();
	}
	resizeCanvas();



	//main functions

	function draw(){
		drawBackground();
		board.draw();
		button.draw()
		drawMovesText(board.grid[0][0]);
	}

	function loop(){
		draw();
		board.checkWin();
		if(board.gameOver){
			board.won();
		}
	}

	setInterval(loop, 1000/60);
}