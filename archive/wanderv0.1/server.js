#!/usr/bin/env nodejs
let http = require('http');
let fs = require('fs');
let path = require('path');
let socketIO = require('socket.io')
let port = 8080;

function makeServer() {
  let server = http.createServer(function(req, res) {
    req.on('error', err => {console.error(err.stack)});

    let url = path.normalize(req.url).toString();
    let ext = path.extname(url);

    if (url === '/index') {
      sendFileContent(res, 'index.html', 'text/html');

    } else if (url === '/') {
      res.writeHead(301, {'Location': '/index'});
      res.end();

    } else if (ext === '.js' || ext === '.css') {
      sendFileContent(res, url.substring(1), 'text/' + ext.substring(1,))

    } else if (ext === '.ico') {
      sendFileContent(res, url.substring(1), 'image/ico');

    } else {
      res.writeHead(404);
      console.log('url is: ' + req.url)
      res.end();
    }

    function sendFileContent(res, fileName, contentType) {
      fs.readFile(fileName, function(err, data) {
        if (err) {
          res.writeHead(404);
          console.log(fileName)
          res.write(err);
        } else {
          res.writeHead(200, {'Content-Type': contentType});
          res.write(data);
        }
        res.end();
      })
    }

  });

  server.listen(port, function() {
    console.log('Server open on port ' + port);
  })

  function makeSockets() {
    let io = socketIO(server);


    io.on('connection', function(socket) {
      socket.on('new player', function() {
        // this should eventually be a react.js thing that shows in the html
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
        console.log(socket.id + ' -- player left');
        delete state.entities[socket.id];
      });

    });
  }

  makeSockets();

};

makeServer()

class V {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  minus(v) {
    return new V(this.x - v.x, this.y - v.y)
  }
  plus(v) {
    return new V(this.x + v.x, this.y + v.y)
  }
  times(v) {
    return new V(this.x * v, this.y * v)
  }
  norm() {
    return new V(this.x/this.length(), this.y/this.length())
  }
  length() {
    return (Math.sqrt((this.x*this.x)+(this.y*this.y)));
  }
  rotate(d) {
    return new V(
      this.x * (Math.cos(d)) - this.y * (Math.sin(d)),
      this.y * (Math.cos(d)) + this.x * (Math.sin(d))
    )
  }
}

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
        this.coord = this.coord.plus(this.d.times(this.speed))
      }
      if (act.a) {
        this.d = this.d.rotate(-Math.PI/24);
      }
      if (act.s) {
        this.coord = this.coord.minus(this.d.times(this.speed))
      }
      if (act.d) {
        this.d = this.d.rotate(Math.PI/24);
      }
      if (act.q) {
        this.coord = this.coord.plus(this.d.rotate(-Math.PI/2).times(this.speed))
      }
      if (act.e) {
        this.coord = this.coord.plus(this.d.rotate(Math.PI/2).times(this.speed))
      }
      if (act.click) {
        this.coord = this.coord.plus(this.d.times(40 * act.click));
      }
    }

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

setInterval(function() {
  state.update();
}, 1000/60);
