import Vector from './modules/vectors.mjs';
import Color from './modules/color.mjs';

document.addEventListener('DOMContentLoaded', () => {
  const p = document.getElementById('info');
  const c = document.querySelector('canvas');
  const ctx = c.getContext('2d');
  const SIZE = 500;
  c.width = SIZE;
  c.height = SIZE;
  ctx.translate(SIZE / 2, SIZE / 2);
  ctx.lineWidth = 1;

  { let needsUpdate = true;
    let changeScreen = false;
    const screens = new Array().fill(null);

    function State(canvas) {
      this.entities = [];
      this.screen = [0, 0];
    };

    State.prototype = {
      draw() {
        if (changeScreen) {
          ctx.fillStyle = 'rgba(255,255,255,1)';
        } else {
          ctx.fillStyle = 'rgba(80,80,80,1)';
        };
        ctx.fillRect(-SIZE, -SIZE, SIZE*2, SIZE*2)
        if (this.screen[0] === 0 && this.screen[1] === 0) {
          ctx.fillStyle = 'rgba(0,0,0,1)'
          ctx.fillRect(-40,-40,80,80)
        }
        for (let i = 0; i < this.entities.length; i ++) {
          this.entities[i].draw();
        }
      },
      update() {
        for (let i = 0; i < this.entities.length; i ++) {
          this.entities[i].update();
        }
      },
    };

    class Player {
      constructor(type) {
        this.health = type.maxHealth;
        this.size = type.size
        this.color = type.color.rgb;
        this.speed = type.speed;
        this.type = type.name;
        this.keyboarder = new Keyboarder();
        this.spell = type.spell;
        this.spell2 = type.spell2;
        this.coord = new Vector(0,1);
        this.d = new Vector(0,1);
        this.cooldown = 0;
        this.lvl = type.lvl
      }
      draw() {
        let x = this.coord.x, y = this.coord.y
        let startCircle = Math.atan(this.d.y/this.d.x)+Math.PI;
        if (Math.sign(this.d.x) < 0) {
          startCircle = -Math.PI+Math.atan(this.d.y/this.d.x)+Math.PI;
        }
        ctx.beginPath();
        ctx.arc(x,y,this.size,startCircle + .4, startCircle - .4);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.lineWidth =1;

        ctx.beginPath();
        //ctx.strokeStyle = 'rgb(255,255,255)';
        //ctx.strokeRect(x - 10, y - this.size - 8, 20, 4);
        if (this.health/this.type.maxHealth < 1/5) {
          ctx.fillStyle = 'rgb(255, 100, 100)'
        } else {
          ctx.fillStyle = 'rgb(200, 200, 255)';
        }
        ctx.fillRect(x - 9, y - this.size - 7, 18, 2);
      }
      update() {
        if (this.cooldown < 0) {
          this.cooldown = 0;
          needsUpdate = true;
        };
        let k = this.keyboarder;
        let c = this.coord;
        let s = this.speed;
        if (k.isDown(k.KEYS.Q)) {this.coord = this.coord.plus(this.d.rotate(Math.PI/2).times(this.speed))};
        if (k.isDown(k.KEYS.E)) {this.coord = this.coord.plus(this.d.rotate(-Math.PI/2).times(this.speed))};;
        if (k.isDown(k.KEYS.W) || k.isDown(k.KEYS.UP)) {
          this.coord = this.coord.minus(this.d.times(this.speed))
        };
        if (k.isDown(k.KEYS.S) || k.isDown(k.KEYS.DOWN)) {
          this.coord = this.coord.plus(this.d.times(this.speed))
        };
        if (k.isDown(k.KEYS.D) || k.isDown(k.KEYS.RIGHT)) {
          this.d = this.d.rotate(Math.PI/24)
        };
        if (k.isDown(k.KEYS.A) || k.isDown(k.KEYS.LEFT)) {
          this.d = this.d.rotate(-Math.PI/24)
        };
        if (k.isDown(k.KEYS.SPACE)) {this.spell(this)};
        if (k.isDown(k.KEYS.ONE)) {this.spell2(this)};

        if (this.cooldown > 0) {
          needsUpdate = true;
          this.cooldown -= 2;
        }
        if (this.coord.x < -SIZE/2) {
          state.screen[0] -= 1;
          this.coord.x = SIZE/2;
          needsUpdate = true;
          changeScreen = true;
        }
        if (this.coord.x > SIZE/2) {
          state.screen[0] += 1;
          this.coord.x = -SIZE/2;
          needsUpdate = true;
          changeScreen = true;
        }
        if (this.coord.y < -SIZE/2) {
          state.screen[1] += 1;
          this.coord.y = SIZE/2;
          needsUpdate = true;
          changeScreen = true;
        }
        if (this.coord.y > SIZE/2) {
          state.screen[1] -= 1;
          this.coord.y = -SIZE/2;
          needsUpdate = true;
          changeScreen = true;
        }
      }
    };

    function heal(origin) {
      if (origin.cooldown > 500) {
        origin.cooldown = 999;
        return}
      function draw(origin) {
        ctx.beginPath();
        ctx.arc(origin.coord.x, origin.coord.y, origin.size*10, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(130,150,255,.3)';
        ctx.fill();
      };
      draw(origin);
      origin.cooldown += 3;
    };

    function drain(origin) {
      if (origin.cooldown > 500) {
        origin.cooldown = 999;
        return}
      function draw(origin) {
        ctx.beginPath();
        ctx.arc(origin.coord.x, origin.coord.y, origin.size*6, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(255,20,20,.3)';
        ctx.fill();
      };
      draw(origin);
      origin.cooldown += 3;
    }

    function attack(origin) {
      if (!(origin.cooldown === 0)) {return};
      function Swing(origin) {
        this.time = 0;
        this.origin = origin;
        this.damage = 200;
      };

      Swing.prototype = {
        draw() {
          let warriorSize = this.origin.d.times(this.origin.size);
          let lineStart = this.origin.coord.minus(new Vector(warriorSize.x, warriorSize.y));
          let lineEnd = new Vector(lineStart.x - warriorSize.x, lineStart.y-warriorSize.y);
          ctx.beginPath();
          ctx.moveTo(lineStart.x, lineStart.y);
          ctx.lineTo(lineEnd.x, lineEnd.y);
          ctx.strokeStyle = 'rgb(255,255,255)';
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.lineWidth = 1;
        },
        update() {
          if (this.time > 8) {
            state.entities.splice(state.entities.indexOf(this),1);
          }
          this.time += 1;
        }
      }
      state.entities.push(new Swing(origin));
      origin.cooldown = 120;
    };

    function shield(origin) {
      if (origin.cooldown > 100) {
        origin.cooldown = 300;
        return}
      function draw(origin) {
        let warriorSize = origin.d.times(origin.size);
        console.log(warriorSize);
        let x = Math.sqrt((warriorSize.x * warriorSize.x) + (warriorSize.x * warriorSize.x)) * Math.sign(warriorSize.x);
        let y = Math.sqrt((warriorSize.y * warriorSize.y) + (warriorSize.y * warriorSize.y)) * Math.sign(warriorSize.y);
        let lineStart = origin.coord.minus(
          new Vector(x, y).rotate(Math.PI/4)
        );
        let lineEnd = origin.coord.minus(
          new Vector(x, y).rotate(Math.PI/-4)
        );
        ctx.beginPath();
        ctx.moveTo(lineStart.x, lineStart.y);
        ctx.lineTo(lineEnd.x, lineEnd.y);
        ctx.strokeStyle = 'rgb(255,255,255)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.lineWidth = 1;
      };
      draw(origin);
      origin.cooldown += 3;
    }

    function fireball(origin) {
      let fireballs = state.entities.reduce(function(tot, cur) {
        if (cur instanceof Fb) {return tot + 1} else {return tot}
      },0);

      if ((origin.cooldown > 0) || fireballs > 2) {return};
      state.entities.push(new Fb(origin));
      origin.cooldown = 90;
    };

    function teleport(origin) {
      if (origin.cooldown !== 0) {return}
      origin.coord = origin.coord.minus(origin.d.times(40));
      this.cooldown = 250;
    };

    function Fb(origin) {
      this.d = origin.d;
      this.coord = origin.coord.minus(origin.d.times(origin.size));
      this.v = new Vector(this.d.x, this.d.y).norm().times(2);
      this.size = origin.lvl + 8
    };

    Fb.prototype = {
      draw() {
        ctx.beginPath();
        ctx.arc(this.coord.x, this.coord.y, this.size, 0, 2*Math.PI);
        ctx.fillStyle = 'rgba(255,0,0,.5)';
        ctx.fill();
      },
      update() {
        this.coord = this.coord.minus(this.v);
        if (Math.abs(this.coord.x) > SIZE/2 || Math.abs(this.coord.y) > SIZE/2) {
          state.entities.splice(state.entities.indexOf(this),1)
        }
      }
    };

    function Keyboarder() {
      let keyState = {};

      window.onkeydown = function(e) {
        keyState[e.keyCode] = true;
      };

      window.onkeyup = function(e) {
        keyState[e.keyCode] = false;
      };

      this.isDown = function(keyCode) {
        return keyState[keyCode] === true
      };

      this.KEYS = {
        LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40,
        SPACE: 32, ONE: 49,
        R: 82, A: 65, D: 68, Q: 81, E: 69, W: 87, S: 83
      };
    };

    //lets make these a class extension.. ? :)
    let type = {
      warrior: {
        name: 'warrior',
        color: new Color(255,0,0),
        maxHealth: 10,
        size: 7,
        speed: 1.5,
        spell: attack,
        spell2: shield,
        lvl: 1
      },
      wizard: {
        name: 'wizard',
        color: new Color(0,255,150),
        maxHealth: 4,
        size: 6,
        speed: 1,
        spell: fireball,
        spell2: teleport,
        lvl: 1
      },
      healer: {
        name: 'healer',
        color: new Color(230,230,255),
        maxHealth: 6,
        size: 6,
        speed: .75,
        spell: heal,
        spell2: drain,
        lvl: 1
      }
    };

    let newPlayerType = ''

    while (!(
      newPlayerType === 'warrior' ||
      newPlayerType === 'wizard' ||
      newPlayerType === 'healer'
    )) {
      newPlayerType = prompt('warrior, wizard, or healer?').toLowerCase();
    }

    p.style.color = `${type[newPlayerType].color.rgb}`;

    let state = new State(c);
    state.entities.push(new Player(type[newPlayerType]));

    function tick() {
      state.draw();
      if (changeScreen) {changeScreen = false}
      state.update();

      if (needsUpdate) {
        p.innerText = `hp: ${state.entities[0].health}
      space: ${state.entities[0].spell.name}
      1: ${state.entities[0].spell2.name}
      class: ${state.entities[0].type}
      speed: ${state.entities[0].speed}
      screen: ${state.screen}
      cooldown: ${state.entities[0].cooldown}
      movement: wasd`
        needsUpdate = false;
      }

      window.requestAnimationFrame(tick);
    };

    tick();

  }; 
});
