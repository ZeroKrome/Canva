// declaration de variable
let canvas = document.querySelector("#canvas");
canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;
// score
let score = 0;
//les brique a optimiser selon la dimmension du canvas
let brickRowCount = 3;
let brickCollumCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let paddleHeight = 10;
let paddleWidth = 70;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
// création des collum de brique
let bricks = [];
for (let c = 0; c < brickCollumCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

let paddleX = (canvas.width - paddleWidth) / 2;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let ballRadius = 10;

let rightPressed = false;
let leftPressed = false;

let ctx = canvas.getContext("2d");
// ecoute pour savoir si la toucher et down ou up
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
// ecoute mouvement souris
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}
// fonction pourla touche appuyer
function keyDownHandler(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    rightPressed = true;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    leftPressed = true;
  }
}
//fonction pour la touche relever
function keyUpHandler(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    rightPressed = false;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    leftPressed = false;
  }
}
function collisionDetection() {
  for (let c = 0; c < brickCollumCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickCollumCount * brickRowCount) {
            alert("Bravo tes un dieu !!!!! :D");
            document.location.reload();
            clearInterval(interval);
          }
        }
      }
    }
  }
}
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}
//fonction pour dessiner la ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
// fonction pour la barre
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();
}
// fonction pour les brique
function drawBrick() {
  for (let c = 0; c < brickCollumCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#F00020";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
// fonction pour deplacer la ball
function draw() {
  if (canvas.getContext) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall(); //callback
    drawPaddle();
    collisionDetection();
    drawBrick();
    drawScore();
    //rebond haut et bas
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        // a optimiser
        alert("GAME OVER !!!");
        document.location.reload();
        clearInterval(interval); // chrome pose probleme
      }
    }
    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
      dx = -dx;
    }
    if (rightPressed) {
      paddleX += 7;
      if (paddleX + paddleWidth > canvas.width) {
        paddleX = canvas.width - paddleWidth;
      }
    } else if (leftPressed) {
      paddleX -= 7;
      if (paddleX < 0) {
        paddleX = 0;
      }
    }
    x += dx; // x = x + dx;
    y += dy;
  }
}

let interval = setInterval(draw, 10);
