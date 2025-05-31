const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = 20;
let count = 0;
const fruits = ["🍎", "🍌", "🍇", "🍓", "🍊", "🍉", "🍍", "🥝", "🥥"];
const bodyCircles = ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣"];
let snake, apple, gameOver, score, highScore = 0;
let rankingUpdated = false;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function resetGame() {
  snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 };
  apple = { x: 320, y: 320, emoji: fruits[Math.floor(Math.random() * fruits.length)] };
  gameOver = false;
  score = 0;
  rankingUpdated = false;
  updateScoreBoard();
}

function spawnFruit() {
  apple.x = getRandomInt(0, 20) * grid;
  apple.y = getRandomInt(0, 20) * grid;
  apple.emoji = fruits[Math.floor(Math.random() * fruits.length)];
}

function drawGrid() {
  ctx.save();
  ctx.strokeStyle = "#fff2";
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function updateScoreBoard() {
  const scoreEl = document.getElementById('score');
  const highScoreEl = document.getElementById('high-score');
  if (scoreEl) scoreEl.textContent = `점수: ${score}`;
  if (highScoreEl) highScoreEl.textContent = `최고점수: ${highScore}`;
}

function updateRanking(nickname, score) {
  let ranking = JSON.parse(localStorage.getItem('snakeRanking') || '[]');
  // 중복 방지: 닉네임+점수 조합이 이미 있으면 추가하지 않음
  // 그리고, 항상 10개만 유지
  ranking = ranking.filter(r => !(r.nickname === nickname && r.score === score));
  ranking.push({ nickname, score });
  ranking.sort((a, b) => b.score - a.score);
  ranking = ranking.slice(0, 10);
  localStorage.setItem('snakeRanking', JSON.stringify(ranking));
  renderRanking();
}

function renderRanking() {
  let ranking = JSON.parse(localStorage.getItem('snakeRanking') || '[]');
  const list = document.getElementById('ranking-list');
  if (!list) return;
  while (list.firstChild) list.removeChild(list.firstChild); // 완전 초기화
  // 닉네임+점수 조합이 중복되는 항목 제거(최상위만 남김)
  const seen = new Set();
  ranking = ranking.filter(item => {
    const key = item.nickname + ":" + item.score;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  ranking.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = `${i + 1}. ${item.nickname} - ${item.score}점`;
    list.appendChild(li);
  });
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  if (++count < 4) return;
  count = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  if (gameOver) {
    ctx.font = "bold 36px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText(`최종 점수: ${score}`, canvas.width/2, canvas.height/2 + 10);
    ctx.fillText("스페이스바를 눌러 재시작", canvas.width/2, canvas.height/2 + 40);
    if (!rankingUpdated) {
      rankingUpdated = true;
      setTimeout(() => {
        let nickname = prompt('게임 오버! 닉네임을 입력하세요 (최대 8자):', '익명');
        if (!nickname) nickname = '익명';
        nickname = nickname.slice(0, 8);
        updateRanking(nickname, score);
      }, 100);
    }
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
      ctx.fillText("🥹", cell.x + grid/2, cell.y + grid/2);
    } else {
      ctx.fillText(bodyCircles[(index-1) % bodyCircles.length], cell.x + grid/2, cell.y + grid/2);
    }
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      if (score > highScore) highScore = score;
      updateScoreBoard();
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
renderRanking();
requestAnimationFrame(gameLoop);
