var engine = {}

engine.init = function()  {
	setInterval(this.update, 1/60 * 1000)
	setInterval(this.draw, 1/60 * 1000)

	engine.spawPower()
}

var gameScreen = {
	width: 600,
	height: 400
}

var playerSizing = {
	width: 10,
	height: 100
}

var player1 = {
	x: 0,
	y: 0,
	pts: 0
}
var player2 = {
	x: gameScreen.width - playerSizing.width,
	y: 0,
	pts: 0
}
var ball = {
	x: gameScreen.width / 2,
	y: gameScreen.height / 2,

	width: 20,
	height: 20,
	radius: 10,

	movement: {
		x: (Math.random() < 0.5) ? 1 : -1,
		y: (Math.random() < 0.5) ? 1 : -1
	}
}
var powerup = {
	x: 0,
	y: 0,
	radius: 70
}

var playerSpeed = 200;
var ballSpeed = 150;

var deltaTime = 1/60

engine.update = function() {

	// Checks input, moves player 1 and 2
	if (input.isKeyDown('s')) {
		player1.y += playerSpeed * deltaTime
	} else if (input.isKeyDown('w')) {
		player1.y -= playerSpeed * deltaTime	
	}
	if (input.isKeyDown('ArrowDown')) {
		player2.y += playerSpeed * deltaTime
	} else if (input.isKeyDown('ArrowUp')) {
		player2.y -= playerSpeed * deltaTime	
	}

	// Check player bounds
	if (player1.y + playerSizing.height > gameScreen.height) {
		player1.y = gameScreen.height - playerSizing.height
	} else if (player1.y < 0) {
		player1.y = 0
	}
	if (player2.y + playerSizing.height > gameScreen.height) {
		player2.y = gameScreen.height - playerSizing.height
	} else if (player2.y < 0) {
		player2.y = 0
	}

	// Moves ball
	ball.x += ballSpeed * ball.movement.x * deltaTime
	ball.y += ballSpeed * ball.movement.y * deltaTime

	// Checks for ball collision on top and bottom
	if (ball.y + ball.radius >= gameScreen.height) {
		ball.movement.y = -1;
	}
	if (ball.y - ball.radius <= 0) {
		ball.movement.y = 1;
	}

	// Checks for collision with the jogadores
	// jogador one
	// Por que width * 3 eu não sei
	if (ball.x - ball.width < player1.x + playerSizing.width * 2 &&
		ball.y > player1.y &&
		ball.y + ball.radius < player1.y + playerSizing.height) {
		
		ball.movement.x = 1
	}

	// Jogador 2
	if (ball.x > player2.x + ball.radius &&
		ball.y > player2.y &&
		ball.y + ball.radius < player2.y + playerSizing.height) {
		ball.movement.x = -1
	}

	// Check for scoring
	if (ball.x - ball.width - ball.radius < 0) {
		player1.pts++
		engine.relevel()
	}
	if (ball.x + ball.radius - ball.width > gameScreen.width) {
		player2.pts++
		engine.relevel()
	}

	// Check for INTERSTELLAR
	if (input.isKeyDown(' ')) {
		engine.interstellar()
	}

	// Pitágoras
	var dist = Math.sqrt(Math.pow((ball.x + ball.radius) - (powerup.x + powerup.radius), 2) + Math.pow((ball.y + ball.radius) - (powerup.y + powerup.radius), 2))
	if (dist < ball.radius + powerup.radius) {
		engine.spawPower()
		engine.interstellar()

		ball.movement.y = ball.movement.y * -1
	}
}

engine.spawPower = function() {
	powerup.x = Math.random() * 400 + 50
	powerup.y = Math.random() * 200 + 100

	powerup.item = powerups[Math.floor(Math.random()*powerups.length)]
}

engine.relevel = function() {
	ball.x = gameScreen.width / 2 + ball.radius;
	ball.y = gameScreen.height / 2 + ball.radius;

	ball.movement = {
		x: 0,
		y: 0
	}

	// Start 3 seconds after
	setTimeout(function() {
		ball.movement = {
			x: (Math.random() < 0.5) ? 1 : -1,
			y: (Math.random() < 0.5) ? 1 : -1
		}
	}, 2000)
}

var audio = document.getElementById('stellar')

var gameDiv = document.getElementById('game')

var div1 = document.getElementById('player-one')
var div2 = document.getElementById('player-two')
var divBall = document.getElementById('ball')
var pts1div = document.getElementById('player1-pts')
var pts2div = document.getElementById('player2-pts')
var powerDiv = document.getElementById('powerup')
engine.draw = function() {

	div1.style.top = player1.y + 'px';
	div1.style.left = player1.x + 'px';
	div2.style.top = (player2.y - playerSizing.height) + 'px';
	div2.style.left = player2.x + 'px';

	// Some fuckery to work on top of position: relative
	divBall.style.left = (ball.x - playerSizing.width * 2 - ball.radius) + 'px'
	divBall.style.top = (ball.y - playerSizing.height * 2 - ball.radius) + 'px'

	pts1div.innerHTML = `Player 1<br>${player1.pts}`
	pts2div.innerHTML = `Player 2<br>${player2.pts}`

	powerDiv.style.top = powerup.y - playerSizing.height * 2 - ball.height + 'px'
	powerDiv.style.left = powerup.x + 'px'
}

engine.interstellar = function() {

	if (gameDiv.style.animationPlayState != "running") {
		gameDiv.style.animationPlayState = "running"
		audio.play()
	} else {
		gameDiv.style.animationPlayState = "paused"
		audio.pause()
	}

}

var powerups = [
	{
		src: './assets/sprites/star.png',
		callback: engine.interstellar
	},
]

