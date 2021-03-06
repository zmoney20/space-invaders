const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results');
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;

for (let i = 0; i < 225; i++) {
	const square = document.createElement('div');
	grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll('.grid div'));

// create alienInvaders array
var alienInvaders = [];
for (let i = 0; i < width - 5; i++) {
	alienInvaders.push(i);
}
for (let i = width; i < width * 2 - 5; i++) {
	alienInvaders.push(i);
}
for (let i = 2 * width; i < width * 3 - 5; i++) {
	alienInvaders.push(i);
}

draw = () => {
	for (let i = 0; i < alienInvaders.length; i++) {
		if (!aliensRemoved.includes(i)) {
			squares[alienInvaders[i]].classList.add('invader');
		}
	}
};

draw();

remove = () => {
	for (let i = 0; i < alienInvaders.length; i++) {
		squares[alienInvaders[i]].classList.remove('invader');
	}
};

squares[currentShooterIndex].classList.add('shooter');

//shooter moves left and right
moveShooter = (e) => {
	squares[currentShooterIndex].classList.remove('shooter');
	//arrow keys
	switch (e.key) {
		case 'ArrowLeft':
			if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
			break;
		case 'ArrowRight':
			if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
			break;
	}
	squares[currentShooterIndex].classList.add('shooter');
};
document.addEventListener('keydown', moveShooter);

//aliens move left and right
moveInvaders = () => {
	const leftEdge = alienInvaders[0] % width === 0;
	const rightEdge =
		alienInvaders[alienInvaders.length - 1] % width === width - 1;
	remove();

	if (rightEdge && goingRight) {
		for (let i = 0; i < alienInvaders.length; i++) {
			alienInvaders[i] += width + 1;
			direction = -1;
			goingRight = false;
		}
	}

	if (leftEdge && !goingRight) {
		for (let i = 0; i < alienInvaders.length; i++) {
			alienInvaders[i] += width - 1;
			direction = 1;
			goingRight = true;
		}
	}

	for (let i = 0; i < alienInvaders.length; i++) {
		alienInvaders[i] += direction;
	}

	draw();

	if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
		resultsDisplay.innerHTML = 'GAME OVER';
		clearInterval(invadersId);
	}

	for (let i = 0; i < alienInvaders.length; i++) {
		if (alienInvaders[i] > squares.length) {
			resultsDisplay.innerHTML = 'GAME OVER';
			clearInterval(invadersId);
		}
	}
	if (aliensRemoved.length === alienInvaders.length) {
		resultsDisplay.innerHTML = 'You won!';
		clearInterval(invadersId);
	}
};
invadersId = setInterval(moveInvaders, 600);

//shoot laser
shoot = (e) => {
	let laserId;
	let currentLaserIndex = currentShooterIndex;
	moveLaser = () => {
		squares[currentLaserIndex].classList.remove('laser');
		currentLaserIndex -= width;
		squares[currentLaserIndex].classList.add('laser');

		if (squares[currentLaserIndex].classList.contains('invader')) {
			squares[currentLaserIndex].classList.remove('laser');
			squares[currentLaserIndex].classList.remove('invader');
			squares[currentLaserIndex].classList.add('boom');

			setTimeout(
				() => squares[currentLaserIndex].classList.remove('boom'),
				300
			);
			clearInterval(laserId);

			const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
			aliensRemoved.push(alienRemoved);
			results++;
			resultsDisplay.innerHTML = results;
			console.log(aliensRemoved);
		}
	};
	//shoot arrow up key
	switch (e.key) {
		case 'ArrowUp':
			laserId = setInterval(moveLaser, 100);
			//pew pew sound
			var audio = new Audio('pew-pew-lame-sound-effect.mp3');
			audio.play();
	}
};

document.addEventListener('keydown', shoot);
