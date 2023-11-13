var colorUniformLocation;
var game = [
	[9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	[9, 1, 1, 1, 1, 6, 1, 1, 1, 1, 9],
	[9, 1, 0, 0, 0, 1, 0, 0, 0, 1, 9],
	[9, 1, 0, 0, 0, 1, 0, 0, 0, 1, 9],
	[9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
	[9, 1, 0, 1, 1, 3, 1, 1, 0, 1, 9],
	[9, 1, 0, 1, 1, 4, 1, 1, 0, 1, 9],
	[9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
	[9, 1, 0, 0, 0, 1, 0, 0, 0, 1, 9],
	[9, 1, 0, 0, 0, 1, 0, 0, 0, 1, 9],
	[9, 1, 1, 1, 1, 5, 1, 1, 1, 1, 9],
	[9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
]

var center=[
	[0,2,0],
	[3,1,3],
	[3,1,3],
	[3,1,3],
	[0,2,0]
]
var pr = 10;
var pc = 5;
var gr1 = 5;
var gc1 = 5;
var gr2 = 6;
var gc2 = 5;
var dot_count = 59;
var score=0;
var timer=0;
var run = 0;
var resume = 1;
var timeleft = 60;
var speed =250;
var up=100;
var down=500;
var life=0;
var sr=0;
var sc=0;
//const ctx = document.getElementById("pacman-canvas").getContext("2d");

window.onload = function init() {

	canvas = document.getElementById("pacman-canvas");
	
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }
	
	var vertexShaderSource = document.getElementById("vs").text;
	var fragmentShaderSource = document.getElementById("fs").text;


	var vertexShader = createShader(
		gl, gl.VERTEX_SHADER, vertexShaderSource
	);
	var fragmentShader = createShader(
		gl, gl.FRAGMENT_SHADER, fragmentShaderSource
	);


	var program = createProgram(
		gl, vertexShader, fragmentShader
	);

	var positionBuffer = gl.createBuffer();


	var positionAttributeLocation =
		gl.getAttribLocation(program, "a_position");


	var resolutionUniformLocation =
		gl.getUniformLocation(program, "u_resolution");


	colorUniformLocation =
		gl.getUniformLocation(program, "u_color");


	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clearColor(0, 0, 0, 0.5);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(program);

	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

	gl.enableVertexAttribArray(positionAttributeLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	var size = 2;
	var type = gl.FLOAT;
	var normalize = false;
	var stride = 0;
	var offset = 0;
	gl.vertexAttribPointer(
		positionAttributeLocation,
		size,
		type,
		normalize,
		stride,
		offset
	);
	render();
}

function createShader(gl, type, source) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	}
	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	var success = gl.getProgramParameter(
		program, gl.LINK_STATUS
	);
	if (success) {
		return program;
	}
	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}

function setRectangle(gl, x, y, width, height) {
	var x1 = x - width;
	var x2 = x + width;
	var y1 = y - height;
	var y2 = y + height;

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		x1, y1,
		x2, y1,
		x1, y2,
		x1, y2,
		x2, y1,
		x2, y2]), gl.STATIC_DRAW);
}



function setPacman(gl, x, y, width, height) {
	var x1 = x - width;
	var x2 = x + width;
	var x3 = (x1 + x2) / 2;
	var y1 = y - height;
	var y2 = y + height;

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		x1, y2,
		x2, y2,
		x3, y1
	]), gl.STATIC_DRAW);
}

function render() {

	if (run == 1) {
		if (resume == 1) {
			for (var i = 0; i < 12; i++) {
				for (var j = 0; j < 11; j++) {
					if (game[i][j] == 9) {
						setRectangle(gl, 25 + 45 * j, 25 + 50 * i, 25, 26)
						gl.uniform4f(
							colorUniformLocation,
							0, //red
							0, //green
							0, //blue
							0.5 //opacity
						);
						gl.drawArrays(gl.TRIANGLES, 0, 6);
					}

				}
			}

			for (var i = 0; i < 5; i++) {
				for (var j = 0; j < 3; j++) {
					if (center[i][j]==0) {
						setRectangle(gl, 225 + 20 *j, 250 + 25 *+i,2, 2)
						gl.uniform4f(
							colorUniformLocation,
							0, //red
							0, //green
							1, //blue
							0.5 //opacity
						);
						gl.drawArrays(gl.TRIANGLES, 0, 6);
					}else if(center[i][j]==2){
						setRectangle(gl, 225 + 20 *j, 250 + 25 *+i,5, 2)
						gl.uniform4f(
							colorUniformLocation,
							0, //red
							0, //green
							1, //blue
							0.5 //opacity
						);
						gl.drawArrays(gl.TRIANGLES, 0, 6);

					}else if(center[i][j]==3){
						setRectangle(gl, 225 + 20 *j, 250 + 25 *+i,2, 5)
						gl.uniform4f(
							colorUniformLocation,
							0, //red
							0, //green
							1, //blue
							0.5 //opacity
						);
						gl.drawArrays(gl.TRIANGLES, 0, 6);
					}

				}
			}


			for (var i = 0; i < 12; i++) {
				for (var j = 0; j < 11; j++) {
					if (game[i][j] == 0) {
						setRectangle(gl, 20 + 45 * j, 20 + 50 * i, 24, 25)
						gl.uniform4f(
							colorUniformLocation,
							0, //red
							1, //green
							0, //blue
							0.5 //opacity
						);
						gl.drawArrays(gl.TRIANGLES, 0, 6);
					}

				}
			}
			setRectangle(gl, 20 + 45 * gc1, 20 + 50 * gr1, 10, 10)
			gl.uniform4f(
				colorUniformLocation,
				1, //red
				0, //green
				0, //blue
				0.5 //opacity
			);
			gl.drawArrays(gl.TRIANGLES, 0, 6);

			setRectangle(gl, 20 + 45 * gc2, 20 + 50 * gr2, 10, 10)
			gl.uniform4f(
				colorUniformLocation,
				0, //red
				0.5, //green
				0.5, //blue
				0.5 //opacity
			);
			gl.drawArrays(gl.TRIANGLES, 0, 6);
			
			

			if (pressed == 1) {
				
				if (game[pr + 1][pc] != 0 && game[pr + 1][pc] != 9 && game[pr + 1][pc] != 4 && game[pr + 1][pc] != 3) {
					pr = pr + 1;
				}
				pressed = 0;
			}
			else if (pressed == 2) {
				
				if (game[pr - 1][pc] != 0 && game[pr - 1][pc] != 9 && game[pr - 1][pc] != 4 && game[pr - 1][pc] != 3) {
					pr = pr - 1;
				}
				pressed = 0;
			}
			else if (pressed == 3) {
				
				if (game[pr][pc - 1] != 0 && game[pr][pc - 1] != 9 && game[pr][pc - 1] != 4 && game[pr][pc - 1] != 3) {
					pc = pc - 1;
				}
				pressed = 0;
			}
			else if (pressed == 4) {
				
				if (game[pr][pc + 1] != 0 && game[pr][pc + 1] != 9 && game[pr][pc + 1] != 4 && game[pr][pc + 1] != 3) {
					pc = pc + 1;
				}
				pressed = 0;
			}

			for (var i = 0; i < 12; i++) {
				for (var j = 0; j < 11; j++) {
					if (game[i][j] == 1) {
						setDots(gl,20+45*j,20+50*i,5,5);
						gl.uniform4f(
							colorUniformLocation,
							0.5, //red
							0.5, //green
							0, //blue
							0.5 //opacity
						);
						gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
					}
					else if(game[i][j]==6){
						setDots(gl,20+45*j,20+50*i,5,5);
						gl.uniform4f(
							colorUniformLocation,
							0, //red
							0, //green
							0, //blue
							0.5 //opacity
						);
						gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
					}
				}
			}
			if(timeleft<30&&game[sr][sc]==8){
				setDots(gl,20+45*sc,20+50*sr,7,7);
				gl.uniform4f(
					colorUniformLocation,
					0.5, //red
					0, //green
					0.5, //blue
					0.5 //opacity
				);
				gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
			}


			setPacman(gl, 20 + 45 * pc, 20 + 50 * pr, 10, 10);
			gl.uniform4f(
				colorUniformLocation,
				0, //red
				0, //green
				1, //blue
				0.7 //opacity
			);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
			randomMove();
			checkCollision();
			document.getElementById("timer").innerHTML = timeleft;
			//ctx.fillText("60",5,30);
		}
	}
	if(dot_count!=0&&score>=0&&timeleft>0){
		window.requestAnimFrame(render);
		
	}else if(score<0 || timeleft==0){
		document.getElementById("msg").innerHTML="GAME OVER!	score:"+(score)
		gl.clearColor(0, 0, 0, 0.5);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}else{
		document.getElementById("msg").innerHTML="WIN!	score:"+(score+timeleft*100)	
		gl.clearColor(0, 0, 0, 0.5);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}

}
var rt=randomNum(5,15)
function checkCollision() {
	if (pr == gr1 && pc == gc1 && life==0) {
		gr1 = 5;
		gc1 = 5;
		score-=down;
	}else if(pr == gr1 && pc == gc1 && life==1){
		life=0;
	}
	if (pr == gr2 && pc == gc2 && life==0) {
		gr2 = 6;
		gc2 = 5;
		score-=down;
	}else if(pr == gr2 && pc == gc2 && life==1){
		life=0;
	}
	if (pr == 1 && pc == 5 && life==0) {
		console.log(life);
		life+=1
		game[pr][pc]=7;
		dot_count-=1;
	}
	if(game[pr][pc]==8&&timeleft<30){
		game[pr][pc]=7;
		speed=200;
		up=200;
		down=700;
	}

	if(game[pr][pc]==1){
		score+=up
		console.log(score);
		game[pr][pc]=7;
		dot_count-=1;
		console.log(dot_count);
		if(timeleft==(60-rt)){
			sr=pr;
			sc=pc;
			console.log("!!!!!!!!!!!!!");
			game[sr][sc]=8;
			console.log(game[sr][sc]);
		}
	}
	document.getElementById("score").innerHTML = score;
}



function randomNum(min, max) {
	var randNum = Math.floor(Math.random() * (max - min + 1)) + min;
	return randNum;
}

function randomMove() {
	var r1 = randomNum(1, 4);
	var r2 = randomNum(1, 4);
	sleep(speed)
	timer+=speed
	if(timer==1000){
		timeleft-=1;
		timer=0;
	}
	
	
	if (r1 == 1) {
		if (game[gr1 + 1][gc1] != 0 && game[gr1 + 1][gc1] != 9) {
			gr1 = gr1 + 1;
		}
	} else if (r1 == 2) {
		if (game[gr1 - 1][gc1] != 0 && game[gr1 - 1][gc1] != 9) {
			gr1 = gr1 - 1;
		}
	} else if (r1 == 3) {
		if (game[gr1][gc1 - 1] != 0 && game[gr1][gc1 - 1] != 9) {
			gc1 = gc1 - 1;
		}
	} else if (r1 == 4) {
		if (game[gr1][gc1 + 1] != 0 && game[gr1][gc1 + 1] != 9) {
			gc1 = gc1 + 1;
		}
	}
	if (r2 == 1) {
		if (game[gr2 + 1][gc2] != 0 && game[gr2 + 1][gc2] != 9) {
			gr2 = gr2 + 1;
		}
	} else if (r2 == 2) {
		if (game[gr2 - 1][gc2] != 0 && game[gr2 - 1][gc2] != 9) {
			gr2 = gr2 - 1;
		}
	} else if (r2 == 3) {
		if (game[gr2][gc2 - 1] != 0 && game[gr2][gc2 - 1] != 9) {
			gc2 = gc2 - 1;
		}
	} else if (r2 == 4) {
		if (game[gr2][gc2 + 1] != 0 && game[gr2][gc2 + 1] != 9) {
			gc2 = gc2 + 1;
		}
	}
}

function sleep(ms) {
	const wakeUpTime = Date.now() + ms;
	while (Date.now() < wakeUpTime) { }
}
window.addEventListener("keydown", getKey, false);
var pressed = 0;
function getKey(key) {
	console.log(key.key);
	if (key.key == "ArrowDown") {
		pressed = 1;
	}
	else if (key.key == "ArrowUp") {
		pressed = 2;
	}
	else if (key.key == "ArrowLeft") {
		pressed = 3;
	}
	else if (key.key == "ArrowRight") {
		pressed = 4;
	}
	else if (key.key == "p") {
		resume = 0;
		document.getElementById("msg").innerHTML="Paused";
	} else if (key.key == "r") {
		resume = 1;
		document.getElementById("msg").innerHTML="";
	} else if (key.key == "s") {
		
		//sleep(500);
		run = 1;
		resume = 1;
		document.getElementById("msg").innerHTML="";		
		
	}else if (key.key == "R") {
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(0, 0, 0, 0.5);
		gl.clear(gl.COLOR_BUFFER_BIT);
		document.getElementById("msg").innerHTML="Press 's' to start";
		timeleft=60;
		score=0;
		pr = 10;
		pc = 5;
		gr1 = 5;
		gc1 = 5;
		gr2 = 6;
		gc2 = 5;
		dot_count = 59;
		run = 0;
		resume = 0;
		speed =250;
		up=100;
		down=500;
		life=0;
		sr=0;
		sc=0;
		life=0;
		sr=0;
		sc=0;
		document.getElementById("timer").innerHTML = timeleft;
		document.getElementById("score").innerHTML = score;
		game = [
			[9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
			[9, 1, 1, 1, 1, 6, 1, 1, 1, 1, 9],
			[9, 1, 0, 0, 0, 1, 0, 0, 0, 1, 9],
			[9, 1, 0, 0, 0, 1, 0, 0, 0, 1, 9],
			[9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
			[9, 1, 0, 1, 1, 3, 1, 1, 0, 1, 9],
			[9, 1, 0, 1, 1, 4, 1, 1, 0, 1, 9],
			[9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
			[9, 1, 0, 0, 0, 1, 0, 0, 0, 1, 9],
			[9, 1, 0, 0, 0, 1, 0, 0, 0, 1, 9],
			[9, 1, 1, 1, 1, 5, 1, 1, 1, 1, 9],
			[9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
		]
		location.reload();
	}
}



function setDots(gl,x,y,width,height){
	var x1=x-width;
	var x2=x+width;
	var y1=y-height;
	var y2=y+height;
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		x, y,
		x1,y,
		x,y1,
		x2,y,
		x,y2,
		x1,y
	]), gl.STATIC_DRAW);
}


	