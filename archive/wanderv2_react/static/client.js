window.onload = init;

function init() {
	const SIZE = {H: 500, W: 500};
	let status = document.getElementById('status');
	let chat = document.getElementById('chat');
	let board = document.getElementById('gameBoard');
	let ctx = board.getContext('2d');
	//turn canvas into a cartesian coordinate grid
	ctx.translate(0, SIZE.H);
	ctx.scale(1, -1);

	board.width = SIZE.W;
	board.height = SIZE.H;
	chat.width = 500;
	console.log(board);
	console.log(chat);
	ctx.lineWidth = 1;

	let act = {
		w: 0,
		a: 0,
		s: 0,
		d: 0,
		q: 0,
		e: 0,
		click: 0,
		shiftClick: 0,
	}

	window.onkeydown = function(e) {
		switch (e.keyCode) {
			case 87: act.w = true; break;
			case 65: act.a = true; break;
			case 83: act.s = true; break;
			case 68: act.d = true; break;
			case 81: act.q = true; break;
			case 69: act.e = true; break;
		}
	};

	window.onkeyup = function(e) {
		switch (e.keyCode) {
			case 87: act.w = false; break;
			case 65: act.a = false; break;
			case 83: act.s = false; break;
			case 68: act.d = false; break;
			case 81: act.q = false; break;
			case 69: act.e = false; break;
		}
	};

	window.onclick = function(e) {
		switch (e.shiftKey) {
			case false: act.click += 1; break;
			case true: act.shiftClick += 1; break;
		}
	};

	makeSocket();

	function makeSocket() {
		let socket = io();

		socket.emit('new player');

		socket.on('message', function(data) {
			//can i use react here?
			//if not, then chat.innerText = data;
			chat.innerText = data;
			socket.emit('in');
		});

		socket.on('state', function(data) {
			//can i use react here?, if so, make the formula: draw(data);
			//if not, then ctx.putImageData(data, 0, 0)
		});

		setInterval(function() {
			socket.emit('action', act);
			act.click = 0;
			act.shiftClick = 0;
		}, 1000/60);
	};

};
