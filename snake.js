const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = 20;
let count = 0;
const fruits = ["🍎", "🍌", "🍇", "🍓", "🍊", "🍉", "🍍", "🥝", "🥥"];
const bodyCircles = ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣"];
let snake, apple, gameOver, score, highScore = 0, scoreHistory = [];

function resetGame() {
  snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 };
  apple = { x: 320, y: 320, emoji: fruits[Math.floor(Math.random() * fruits.length)] };
  gameOver = false;
  score = 0;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function spawnFruit() {
  apple.x = getRandomInt(0, 20) * grid;
  apple.y = getRandomInt(0, 20) * grid;
  apple.emoji = fruits[Math.floor(Math.random() * fruits.length)];
}

function drawScore() {
  ctx.font = "bold 18px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.fillText(`점수: ${score}`, 10, 25);
  ctx.fillText(`최고점수: ${highScore}`, 10, 50);
  if (scoreHistory.length > 0) {
    ctx.font = "12px Arial";
    ctx.fillText(`이전 점수: ${scoreHistory.slice(-5).join(', ')}`, 10, 70);
  }
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  if (++count < 4) return;
  count = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawScore();

  if (gameOver) {
    ctx.font = "bold 36px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText(`최종 점수: ${score}`, canvas.width/2, canvas.height/2 + 10);
    ctx.fillText("스페이스바를 눌러 재시작", canvas.width/2, canvas.height/2 + 40);
    return;
  }

  snake.x += snake.dx;
  snake.y += snake.dy;
  if (snake.x < 0) snake.x = canvas.width - grid;
  else if (snake.x >= canvas.width) snake.x = 0;
  if (snake.y < 0) snake.y = canvas.height - grid;
  else if (snake.y >= canvas.height) snake.y = 0;
  snake.cells.unshift({ x: snake.x, y: snake.y });
  if (snake.cells.length > snake.maxCells) snake.cells.pop();
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(apple.emoji, apple.x + grid/2, apple.y + grid/2);
  snake.cells.forEach((cell, index) => {
    if (index === 0) {
      ctx.fillText("🥹", cell.x + grid/2, cell.y + grid/2); // 머리
    } else {
      ctx.fillText(bodyCircles[(index-1) % bodyCircles.length], cell.x + grid/2, cell.y + grid/2); // 몸통
    }
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      if (score > highScore) highScore = score;
      spawnFruit();
    }
    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver = true;
        scoreHistory.push(score);
      }
    }
  });
}
document.addEventListener('keydown', function(e) {
  if (gameOver && e.code === 'Space') {
    resetGame();
    return;
  }
  if (e.key === 'ArrowLeft' && snake.dx === 0) {
    snake.dx = -grid; snake.dy = 0;
  } else if (e.key === 'ArrowUp' && snake.dy === 0) {
    snake.dy = -grid; snake.dx = 0;
  } else if (e.key === 'ArrowRight' && snake.dx === 0) {
    snake.dx = grid; snake.dy = 0;
  } else if (e.key === 'ArrowDown' && snake.dy === 0) {
    snake.dy = grid; snake.dx = 0;
  }
});
resetGame();
requestAnimationFrame(gameLoop);
