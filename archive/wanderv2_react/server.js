#!/usr/bin/env nodejs

//Dependencies:
const http = require('http');
const fs = require('fs');
const socketIO = require('socket.io');
const express = require('express');
const Vector =  require('./modules/vectors.js');  //makes 2d vectors with functions: ._plus, ._minus, ._times, ._ norm, ._length, ._rotate

//Creating the Server:
const app = express();
const server = http.Server(app);
const port = 8080;

server.listen(port, function() {
	console.log(`Wander server listening on ${port}`);
});

app.use(express.static('static'));
app.get('/index', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

//Game logic:
class State {
	constructor() {
		this.needsUpdate = true;
		this.entities = {};
		this.screen = [0, 0];
	}
	update() {
		for (let e in this.entities) {
			this.entities[e].update();
		}
	}
};

	//maybe there should be a player AND a character... and each player makes a character, but the 'player' is just the person connected to the server...?
class Player {
	constructor(x, y) {
		this.d = new V(0, -1);
		this.coord = new V(x, y);
		this.size = 10;
		this.type = 'Player';
		this.speed = 2;
		this.health = 250;
		this.stamina = 200;
		this._action1 = false;
		this._action2 = false;
		this._lastUpdateTime = (new Date()).getTime();
		this._intent = {};
	}

	update(player) {
		if (this._intent) {
			let act = this._intent;
			if (act.w) {
				this.coord = V.plus(this.coord, V.times(this.d, this.speed))
			}
			if (act.a) {
				this.d = V.rotate(this.d, -Math.PI/24);
			}
			if (act.s) {
				this.coord = V.minus(this.coord, V.times(this.d, this.speed))
			}
			if (act.d) {
				this.d = V.rotate(this.d, Math.PI/24);
			}
			if (act.q) {
				this.coord = V.plus(
					this.coord, V.times(
						V.rotate(
							this.d, -Math.PI/2
						), this.speed
					)
				);
			}
			if (act.e) {
				this.coord = V.plus(
					this.coord, V.times(
						V.rotate(
							this.d, Math.PI/2
						), this.speed
					)
				);
			}
			if (act.click) {
				this.coord = V.plus(this.coord, V.times(this.d, 40 * act.click));
			}
		};

		if (this.coord.x < 0) {
			this.coord.x = 500;
			state.screen[0] -= 1;
			state.needsUpdate = true;
		}
		if (this.coord.y < 0) {
			this.coord.y = 500;
			state.screen[1] += 1;
			state.needsUpdate = true;
		}
		if (this.coord.y > 512) {
			this.coord.y = 0;
			state.screen[1] -= 1;
			state.needsUpdate = true;
		}
		if (this.coord.x > 512) {
			this.coord.x = 0;
			state.screen[0] += 1;
			state.needsUpdate = true;
		}

	}
};

let state = new State();

setInterval(state.update, 1000/60);

makeSockets();

function makeSockets() {
	let io = socketIO(server);

	io.on('connection', function(socket) {
		socket.on('new player', function() {
			// this should eventually be a version of the chat server...does the server need to consolelog every player join/disconnect? maybe build the chat app out so that it's super simple and exportable? spend some time thinking about how that could work in other contexts...
			console.log('new player: ' + socket.id);
			state.entities[socket.id] = new Player(250,250);
			socket.emit('message', 'welcome player ' + socket.id)
		});

		socket.on('action', function(data) {
			let player = state.entities[socket.id] || false;
			if (player) {
				player._intent = data;
			};
		});

		socket.on('in', function() {
			state.needsUpdate = true;
			setInterval(function() {
				io.sockets.emit('state', state);
				state.needsUpdate = false;
			}, 1000/60)
		});

		socket.on('disconnecting', function() {
			//change to player.active = false;
			console.log(socket.id + ' -- player left');
			delete state.entities[socket.id];
		});

	});
}
