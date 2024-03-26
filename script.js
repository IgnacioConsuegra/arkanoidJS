const canvas = document.getElementById("canvas");
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
let dx = -2;
let dy = -2; 



function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.closePath();
}
function drawPaddle() {}
function drawBricks() {}
function collisionDetection() {
  if(x + dx > canvas.width - ballRadius || 
    x + dx < ballRadius
    ) {
    dx = -dx;
  } 
  if( y + dy < ballRadius ) {
    dy = -dy;
  }
  if( y + dy > canvas.height - ballRadius) {
    alert("Game over");
    document.location.reload();
  }
}
function ballMovement() {
  x += dx;
  y += dy;
}
function paddleMovement() {}
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


draw();