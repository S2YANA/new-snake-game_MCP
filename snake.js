const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = 20;
let count = 0;
const fruits = ["🍎", "🍌", "🍇", "🍓", "🍊", "🍉", "🍍", "🥝", "🥥"];
const bodyBlocks = ["🟩", "🟪", "🟦", "🟧", "🟫"];
let snake, apple, gameOver;

function resetGame() {
  snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 };
  apple = { x: 320, y: 320, emoji: fruits[Math.floor(Math.random() * fruits.length)] };
  gameOver = false;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function spawnFruit() {
  apple.x = getRandomInt(0, 20) * grid;
  apple.y = getRandomInt(0, 20) * grid;
  apple.emoji = fruits[Math.floor(Math.random() * fruits.length)];
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  if (++count < 4) return;
  count = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameOver) {
    ctx.font = "bold 36px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText("스페이스바를 눌러 재시작", canvas.width/2, canvas.height/2 + 20);
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
      ctx.fillText(bodyBlocks[(index-1) % bodyBlocks.length], cell.x + grid/2, cell.y + grid/2); // 몸통
    }
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      spawnFruit();
    }
    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver = true;
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
