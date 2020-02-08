let p = document.querySelector('p');
let c = document.getElementById('c');
let ctx = c.getContext('2d');
const SIZE = 500;
c.width = c.height = SIZE;
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

function makeSocket() {
  let socket = io();

  socket.emit('new player');

  socket.on('message', function(data) {
    console.log(data);
    socket.emit('in')
  })

  socket.on('state', function(data) {
    if(data.entities.hasOwnProperty(socket.id)) {
      drawState(data, socket.id);
    };
  })

  setInterval(function() {
    socket.emit('action', act);
    act.click = 0;
    act.shiftClick = 0;
  }, 1000/60);
};

function actions() {
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

};

function drawState(state, id) {

  ctx.fillStyle = "rgba(80,80,80,1)";
  ctx.fillRect(0, 0, SIZE, SIZE)

  if (state.screen[0] === 0 && state.screen[1] === 0) {
    ctx.fillStyle = "rgba(0,0,0,1)"
    ctx.fillRect(230,230,40,40)
  };

  if (state.needsUpdate) {
    p.innerText = `hp: ${state.entities[id].health}
    speed: ${state.entities[id].speed}
    screen: ${state.screen}
    stamina: ${state.entities[id].stamina}
    movement: wasd`
    needsUpdate = false;
  }

  for (let each in state.entities) {
    draw(state.entities[each]);
  };

  function draw(entity) {
    switch (entity.type) {
      case "Player": drawPlayer(entity); break;
    }

    function drawPlayer(p) {
      let x = p.coord.x;
      let y = p.coord.y;
      let dx = p.d.x;
      let dy = p.d.y;
      let size = p.size;
      let drawD = {start: 0, end: 0};
      if (dx === 0) {
        drawD.start = Math.sign(dy) * ((Math.PI * .5) - .4);
        drawD.end = Math.sign(dy) * ((-Math.PI * 1.5) + .4);
      } else {
        let angle = Math.atan(dy/dx);
        if (Math.sign(dx) === 1) {
          drawD.start = angle + .4;
          drawD.end = angle - .4;
        }
        if (Math.sign(dx) == -1) {
          drawD.start = angle + (Math.PI + .4);
          drawD.end = angle - (Math.PI + .4);
        }
      }
      ctx.beginPath();
      ctx.arc(x, y, size, drawD.start, drawD.end);
      ctx.strokeStyle = 'rgb(120,120,0)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

  };

};

actions();
makeSocket();
