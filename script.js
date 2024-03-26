const canvas = document.getElementById("canvas");
const sprite = document.getElementById("sprite");
const bricks = document.getElementById("bricks");
const ctx = canvas.getContext('2d');

canvas.width = 448;
canvas.height = 400;

//Game variables.

let counter = 0;

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



function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
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
    paddleHeight,
  )
}
function initEvent() {
  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);
  function keyDownHandler(event) {
    const {key} = event;
    if(key === 'Right' || key === 'ArrowRight') {
      rightPressed = true;
    } else if (key === 'Left' || key === 'ArrowLeft') { 
      leftPressed = true;
    }
  } 
  function keyUpHandler(event) { 
    const {key} = event;
    if(key === 'Right' || key === 'ArrowRight') {
      rightPressed = false;
    } else if (key === 'Left' || key === 'ArrowLeft') { 
      leftPressed = false;
    }
  }
}

function drawBricks() {}
function collisionDetection() {
  
}
function ballMovement() {
  if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  } 
  if( y + dy < ballRadius ) {
    dy = -dy;
  }
  const isBallSameXAsPaddle  =
    x > paddleX && 
    x < paddleX + paddleWidth;

  const isBallSameYAsPaddle  =
    y + dy > paddleY;

  if(
    isBallSameXAsPaddle &&
    isBallSameYAsPaddle
  ) {
    dy = -dy;
  }

  //Balt touches floor.
  if( y + dy > canvas.height - ballRadius) {
    document.location.reload();
  }
  x += dx;
  y += dy;
}
function paddleMovement() {
  if(rightPressed && paddleX < canvas.width - paddleWidth) { 
    paddleX += paddleVelocity;                                                  
  } 
  if(leftPressed && paddleX > 0) {
    paddleX -= paddleVelocity;
  }
}
function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function draw() {
  cleanCanvas();
  drawBall();
  ballMovement();
  drawPaddle();
  collisionDetection();
  paddleMovement();
  drawBricks();
  window.requestAnimationFrame(draw);
}


draw();
initEvent();