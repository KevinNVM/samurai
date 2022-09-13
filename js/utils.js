function rectangularCollision({ rect1, rect2 }) {
  return (
    rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
    rect1.attackBox.position.x + rect1.attackBox.width <=
      rect2.position.x + rect2.width &&
    rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
    rect1.attackBox.position.y <= rect2.position.y + rect2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  if (player.health === enemy.health) {
    gameDisplayText.innerText = "Tie";
  } else if (player.health > enemy.health) {
    gameDisplayText.innerText = "Player 1 Wins";
  } else if (player.health < enemy.health) {
    gameDisplayText.innerText = "Player 2 Wins";
  }
}

let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    gameTimer.innerText = timer;
  }

  if (timer === 0) {
    gameDisplayText.style.display = "flex";
    determineWinner({ player, enemy, timerId });
  }
}
