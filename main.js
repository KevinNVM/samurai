const canvas = document.querySelector("#canvas");
const c = canvas.getContext("2d");
const gameDisplayText = document.querySelector("#displayText");

let PLAYER1_JUMP_HEIGHT = 17.5;
let PLAYER1_MOVEMENT_SPEED = 5;
let PLAYER1_DAMAGE = 10;
let PLAYER1_HEALTH = 100;
let PLAYER1_REACH = 100;

let PLAYER2_JUMP_HEIGHT = 17.5;
let PLAYER2_MOVEMENT_SPEED = 5;
let PLAYER2_DAMAGE = 9;
let PLAYER2_HEALTH = 100;
let PLAYER2_REACH = 100;

const PLAYER_COLOR = "#ffff";
const ENEMY_COLOR = "red";

let timer = 91;
const GAME_BACKGROUND_COLOR = "gray";
const gameTimer = document.querySelector("#timer");

canvas.width = 1024;
canvas.height = 568;

c.fillRect(0, 0, canvas.width, canvas.height);

c.rect(100, 40, 200, 100);
c.fillStyle = "black";
c.shadowColor = "#000";
c.shadowBlur = 50;
c.shadowOffsetX = 10;
c.shadowOffsetY = -20;
c.fill();

let gravity = 0.7;

const background = new Game({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Game({
  position: {
    x: 625,
    y: 160,
  },
  imageSrc: "./img/shop.png",
  scale: 2.5,
  framesMax: 6,
});

const player = new Samurai({
  health: PLAYER1_HEALTH,
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: -10,
  },
  color: PLAYER_COLOR,
  imageSrc: "./img/samuraiMack/idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 200,
    y: 155,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: PLAYER1_REACH,
      y: 50,
    },
    width: 100,
    height: 50,
  },
});

const enemy = new Samurai({
  health: PLAYER2_HEALTH,
  position: {
    x: canvas.width - 100,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: ENEMY_COLOR,
  imageSrc: "./img/kenji/idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -1 * PLAYER2_REACH,
      y: 50,
    },
    width: 100,
    height: 50,
  },
});
player.draw();
enemy.draw();

// console.log(player);

decreaseTimer();

function animate() {
  requestAnimationFrame(animate);
  if (!document.hidden) {
    c.fillStyle = GAME_BACKGROUND_COLOR;
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = "rgba(255, 255, 255, .2)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    enemy.update();
    player.update();

    // debug
    // console.log(player.velocity);
    // console.log(enemy.velocity);
    // console.log(player.position.y, player.velocity.y);

    // Player Movement
    player.velocity.x = 0;
    console.log(player.position.x);
    if (key.a.pressed && player.lastKey == "a") {
      if (player.position.x !== 0) {
        player.switchSprite("run");
        player.velocity.x = -1 * PLAYER1_MOVEMENT_SPEED;
      }
    } else if (key.d.pressed && player.lastKey == "d") {
      if (player.position.x < 924) {
        player.switchSprite("run");
        player.velocity.x = PLAYER1_MOVEMENT_SPEED;
      }
    } else {
      player.switchSprite("idle");
    }
    // jumping
    if (player.velocity.y < 0) {
      player.switchSprite("jump");
    }
    // falling
    else if (player.velocity.y > 0) {
      player.switchSprite("fall");
    }

    // Enemy Movement
    enemy.velocity.x = 0;
    if (key.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
      if (enemy.position.x >= 0) {
        enemy.velocity.x = -1 * PLAYER2_MOVEMENT_SPEED;
        enemy.switchSprite("run");
      }
    } else if (key.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
      if (enemy.position.x < 924) {
        enemy.velocity.x = PLAYER2_MOVEMENT_SPEED;
        enemy.switchSprite("run");
      }
    } else {
      enemy.switchSprite("idle");
    }
    // jumping
    if (enemy.velocity.y < 0) {
      enemy.switchSprite("jump");
    }
    // falling
    else if (enemy.velocity.y > 0) {
      enemy.switchSprite("fall");
    }

    // Detect Collision
    // Player
    if (
      rectangularCollision({ rect1: player, rect2: enemy }) &&
      player.isAttacking &&
      player.framesCurrent === 2
    ) {
      enemy.takeHit(PLAYER1_DAMAGE);
      player.isAttacking = false;
      gsap.to("#playerHealth", {
        width: `${enemy.health}%`,
      });
      console.log("player hit");
    }
    // if player misses
    if (player.isAttacking && player.framesCurrent == 2) {
      player.isAttacking = false;
    }

    // Enemy
    if (
      rectangularCollision({ rect1: player, rect2: enemy }) &&
      enemy.isAttacking &&
      enemy.framesCurrent == 2
    ) {
      player.takeHit(PLAYER2_DAMAGE);
      enemy.isAttacking = false;
      gsap.to("#enemyHealth", {
        width: `${player.health}%`,
      });
      console.log("enemy hit");
    }
    // if player misses
    if (enemy.isAttacking && enemy.framesCurrent == 2) {
      enemy.isAttacking = false;
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
      gameDisplayText.style.display = "flex";
      determineWinner({ player, enemy, timerId });
    }
  }
}

const key = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

let lastKey;

animate();
window.addEventListener("keydown", (e) => {
  if (!player.dead) {
    switch (e.key) {
      case "d":
        key.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        key.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = PLAYER1_JUMP_HEIGHT * -1;
        break;
      case " ":
        player.attack();
        break;
    }
  }
  if (!enemy.dead) {
    switch (e.key) {
      case "ArrowRight":
        key.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        key.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = PLAYER2_JUMP_HEIGHT * -1;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (e) => {
  //   console.log(e.key);
  switch (e.key) {
    case "d":
      key.d.pressed = false;
      break;
    case "a":
      key.a.pressed = false;
      break;
    case "w":
      key.w.pressed = false;
      break;

    // Enemy Keys
    case "ArrowRight":
      key.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      key.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      key.ArrowUp.pressed = false;
      break;
  }
});
