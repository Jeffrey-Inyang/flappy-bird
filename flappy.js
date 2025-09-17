const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 640;

// Load assets
const birdImg = new Image();
birdImg.src = "WhatsApp Image 2025-09-15 at 12.06.06_8a4bdc71.jpg";

const bgImg = new Image();
bgImg.src = "bg.png";

const pipeImg = new Image();
pipeImg.src = "8afdf6b0f55c0d6.png"; // Your pipe image

// Game variables
let birdX = 80;
let birdY = canvas.height / 2;
let birdSize = 30;
let velocity = 0;
let gravity = 0.5;
let jump = -8;

let pipes = [];
let pipeWidth = 52;   // typical flappy bird pipe width
let pipeGap = 140;
let pipeSpeed = 2;
let score = 0;
let gameOver = false;

// Create pipes
function spawnPipe() {
    let topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 50)) + 20;
    pipes.push({ x: canvas.width, top: topHeight });
}

// Reset game
function resetGame() {
    birdY = canvas.height / 2;
    velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    spawnPipe();
}

// Draw everything
function draw() {
    // Draw background
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    // Draw pipes
    pipes.forEach(pipe => {
        // Top pipe (flipped vertically)
        ctx.save();
        ctx.translate(pipe.x + pipeWidth / 2, pipe.top);
        ctx.scale(1, -1);
        ctx.drawImage(pipeImg, -pipeWidth / 2, 0, pipeWidth, canvas.height);
        ctx.restore();

        // Bottom pipe (normal)
        ctx.drawImage(pipeImg, pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height);
    });

    // Draw bird
    ctx.drawImage(birdImg, birdX, birdY, birdSize, birdSize);

    // Draw score
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px Courier New";
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameOver) {
        ctx.fillStyle = "#FF0000";
        ctx.font = "40px Courier New";
        ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2);
    }
}

// Update game logic
function update() {
    if (gameOver) return;

    velocity += gravity;
    birdY += velocity;

    // Move pipes
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
    });

    // Remove old pipes
    if (pipes.length && pipes[0].x < -pipeWidth) {
        pipes.shift();
        score++;
    }

    // Spawn new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        spawnPipe();
    }

    // Collision detection
    pipes.forEach(pipe => {
        if (
            birdX + birdSize > pipe.x &&
            birdX < pipe.x + pipeWidth &&
            (birdY < pipe.top || birdY + birdSize > pipe.top + pipeGap)
        ) {
            gameOver = true;
        }
    });

    // Ground collision
    if (birdY + birdSize > canvas.height) {
        gameOver = true;
    }
}

// Main loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener("keydown", e => {
    if (e.code === "Space" && !gameOver) {
        velocity = jump;
    } else if (e.code === "Space" && gameOver) {
        resetGame();
    }
});

canvas.addEventListener("click", () => {
    if (!gameOver) velocity = jump;
    else resetGame();
});

resetGame();
gameLoop();
