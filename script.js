const canvas = document.getElementById("canvas");
const sprite = document.getElementById("sprite");
const brickSprite = document.getElementById("brick");
const ctx = canvas.getContext("2d");

canvas.width = 448;
canvas.height = 400;
// canvas.style.border = "2px solid white";

canvas.style.display = "block";
canvas.style.margin = "0 auto";

//Game variables.

let score = 0;
let lives = 3;

//Ball variable.
const ballRadius = 3;

//Ball position.
let x = canvas.width / 2;
let y = canvas.height - 30;
//Ball velocity.
let dx = 2;
let dy = -2;

//Paddle vars.

const paddleHeight = 10;
const paddleWidth = 50;
const paddleVelocity = 7;
let paddleX = (canvas.width - paddleHeight) / 2;
let paddleY = canvas.height - paddleHeight - 10;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 6;
const brickColumnCount = 13;
const totalBricks = brickRowCount * brickColumnCount;
const scorePerBrick = 100;
const maxScore = totalBricks * scorePerBrick;
const brickWidth = 30;
const brickHeight = 14;
const brickPadding = 2;
const brickOffSetTop = 80;
const brickOffSetLeft = 16;
const bricks = [];
const BRICKS_STATUS = {
  ACTIVE: 1,
  DESTROYED: 0,
};
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    const brickX = c * (brickWidth + brickPadding) + brickOffSetLeft;
    const brickY = r * (brickHeight + brickPadding) + brickOffSetTop;
    const random = Math.floor(Math.random() * 8);
    bricks[c][r] = {
      x: brickX,
      y: brickY,
      status: BRICKS_STATUS.ACTIVE,
      color: random,
    };
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  //I want the fill style to be black.

  //Made the fill style white to see the ball.
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}
function drawPaddle() {
  ctx.drawImage(
    sprite,
    29,
    174,
    paddleWidth,
    paddleHeight,
    paddleX,
    paddleY,
    paddleWidth,
    paddleHeight
  );
}
function initEvent() {
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);
  function keyDownHandler(event) {
    const { key } = event;
    if (key === "Right" || key === "ArrowRight") {
      rightPressed = true;
    } else if (key === "Left" || key === "ArrowLeft") {
      leftPressed = true;
    }
  }
  function keyUpHandler(event) {
    const { key } = event;
    if (key === "Right" || key === "ArrowRight") {
      rightPressed = false;
    } else if (key === "Left" || key === "ArrowLeft") {
      leftPressed = false;
    }
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICKS_STATUS.DESTROYED) continue;
      const clipX = currentBrick.color * 32;
      ctx.drawImage(
        brickSprite,
        clipX,
        0,
        31,
        14,
        currentBrick.x,
        currentBrick.y,
        brickWidth,
        brickHeight
      );
    }
  }
}
function collisionDetection() {
  //Resume me how this bellow works, please.

  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICKS_STATUS.DESTROYED) continue;

      //I want to check if the ball is touching the brick, so we need to check if the ball is colliding with the left or right side of the brick.
      const isCollidingXAxis =
        x + ballRadius > currentBrick.x &&
        x - ballRadius < currentBrick.x + brickWidth;
      const isCollidingYAxis =
        y + ballRadius > currentBrick.y &&
        y - ballRadius < currentBrick.y + brickHeight;
      if (isCollidingXAxis && isCollidingYAxis) {
        currentBrick.status = BRICKS_STATUS.DESTROYED;
        dy = -dy;
        dx = -dx;
        dy += dy / 10;
        dx += dx / 10;
        console.log(dy, dx);
        updateScore();
      }
    }
  }
}
function ballMovement() {
  //Ball touches right or left wall.
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  //Ball touches top wall.
  if (y + dy < ballRadius) {
    dy = -dy;
  }

  //Ball touches paddle.
  //I want to check if the ball is touching the paddle.

  const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth;

  //Here we must use the paddle height to check if the ball is touching the paddle.
  //I want to check if the ball is touching the paddle.

  const isBallSameYAsPaddle =
    y + ballRadius > paddleY && y + ballRadius < paddleY + paddleHeight;

  if (isBallSameXAsPaddle && isBallSameYAsPaddle) {
    dy = -dy;
  }

  //Ball touches floor.

  if (y + dy > canvas.height - ballRadius) {
    updateLives();
    //Reset ball position.
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2;
    dy = -2;
    //Reset paddle position.
    paddleX = (canvas.width - paddleWidth) / 2;
    paddleY = canvas.height - paddleHeight - 10;
  }
  x += dx;
  y += dy;
}
function paddleMovement() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleVelocity;
  }
  if (leftPressed && paddleX > 0) {
    paddleX -= paddleVelocity;
  }
}
function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function draw() {
  cleanCanvas();

  drawBall();
  drawPaddle();
  drawBricks();

  collisionDetection();
  ballMovement();
  paddleMovement();
  window.requestAnimationFrame(draw);
}

function updateScore() {
  score += scorePerBrick;
  document.getElementById("score").innerHTML = `⭐ SCORE:  ${score}`;
  if (score === maxScore) {
    alert("YOU WON");
    document.location.reload();
  }
}
function updateLives() {
  lives -= 1;
  document.getElementById("lives").innerHTML = `❤️ LIVES: ${lives}`;
  if (lives === 0) {
    alert("GAME OVER");
    document.location.reload();
  }
}

draw();
initEvent();
