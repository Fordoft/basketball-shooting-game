const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game variables
let isGameRunning = false;
let powerLevel = 0;
let level = 1;
let score = 0;
let shootingInterval;

// Character object
const hazel = {
    x: 100,
    y: 500,
    width: 50,
    height: 100
};

// Ball object
const ball = {
    x: hazel.x + 25,
    y: hazel.y - 15,
    radius: 10,
    isShooting: false
};

// Start the game
function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        level = 1;
        score = 0;
        nextLevel();
    }
}

// Handle levels
function nextLevel() {
    if (level > 10) {
        alert("You've completed all levels!");
        isGameRunning = false;
        return;
    }

    alert(`Level ${level}!`);
    let timeLimit = 10 - level; // Decrease time limit with each level

    shootingInterval = setInterval(() => {
        increasePower();
    }, 100);

    setTimeout(() => {
        clearInterval(shootingInterval);
        shootBall();
        level++;
        if (isGameRunning) {
            nextLevel();
        }
    }, timeLimit * 1000);
}

// Increase power level
function increasePower() {
    powerLevel = (powerLevel + 1) % 100;
    document.getElementById('power-level').textContent = powerLevel;
}

// Shoot the ball
function shootBall() {
    ball.isShooting = true;
    ball.x = hazel.x + 25;
    ball.y = hazel.y - 15;

    const powerFactor = powerLevel / 100;
    const targetX = canvas.width - 100;
    const targetY = Math.random() * (canvas.height - 300);

    const dx = (targetX - ball.x) * powerFactor;
    const dy = (targetY - ball.y) * powerFactor;

    const animate = () => {
        if (ball.isShooting) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawHazel();
            ball.x += dx;
            ball.y += dy;
            drawBall();

            if (ball.x > targetX || ball.y < targetY) {
                ball.isShooting = false;
                if (Math.abs(ball.x - targetX) < 20 && Math.abs(ball.y - targetY) < 20) {
                    score++;
                    alert(`Score! Total Score: ${score}`);
                }
            } else {
                requestAnimationFrame(animate);
            }
        }
    };

    animate();
}

// Draw Hazel
function drawHazel() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(hazel.x, hazel.y, hazel.width, hazel.height);
    ctx.fillStyle = 'black';
    ctx.fillText('Hazel', hazel.x, hazel.y + hazel.height + 10);
}

// Draw the ball
function drawBall() {
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

// Initialize the game
function init() {
    drawHazel();
    drawBall();
}

init();
