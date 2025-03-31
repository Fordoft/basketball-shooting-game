const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const shootingGauge = document.getElementById('shooting-gauge');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game variables
let isGameRunning = false;
let isCharging = false;
let chargeLevel = 0;
let score = 0;
let level = 1;

// Character object (Hazel)
const hazel = {
    x: 100,
    y: 500,
    width: 50,
    height: 100,
    draw: function() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.fillText('Hazel', this.x, this.y + this.height + 10);
    }
};

// Ball object
const ball = {
    x: hazel.x + 25,
    y: hazel.y - 15,
    radius: 10,
    isShooting: false
};

// Target object
const target = {
    x: canvas.width - 100,
    y: Math.random() * (canvas.height - 300),
    width: 100,
    height: 100
};

// Start the game
function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        score = 0;
        level = 1;
        nextLevel();
    }
}

// Handle levels
function nextLevel() {
    if (level > 10) {
        gameOver();
        return;
    }

    target.y = Math.random() * (canvas.height - 300);
    chargeLevel = 0;
    shootingGauge.style.width = '200px';
    shootingGauge.style.height = '20px';
    shootingGauge.style.backgroundColor = '#fff';
    document.getElementById('level-value').textContent = level;
}

// Increase charge level when touch starts
function chargeShot(event) {
    if (!isCharging && isGameRunning) {
        isCharging = true;
        chargeLevel = 0;

        const chargingInterval = setInterval(() => {
            if (chargeLevel < 200) {
                chargeLevel += 2;
                shootingGauge.style.width = `${chargeLevel}px`;
                shootingGauge.style.backgroundColor = `hsl(${chargeLevel * 1.2}, 100%, 50%)`;
            } else {
                clearInterval(chargingInterval);
                releaseShot();
            }
        }, 1);
    }
}

// Release the shot
function releaseShot() {
    isCharging = false;
    shootingGauge.style.width = '0px';
    shootingGauge.style.backgroundColor = '#fff';

    shootBall();
}

// Shoot the ball
function shootBall() {
    ball.isShooting = true;
    ball.x = hazel.x + 25;
    ball.y = hazel.y - 15;

    const powerFactor = chargeLevel / 200;
    const targetX = target.x;
    const targetY = target.y;
    let dx = (targetX - ball.x) * powerFactor;
    let dy = (targetY - ball.y) * powerFactor;

    const animate = () => {
        if (ball.isShooting) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hazel.draw();
            drawTarget();
            ball.x += dx;
            ball.y += dy;
            drawBall();

            // Slow down the ball
            dx *= 0.99;
            dy *= 0.99;

            if (ball.x > targetX && ball.x < targetX + target.width &&
                ball.y > targetY && ball.y < targetY + target.height) {
                // Score a point
                score++;
                document.getElementById('score-value').textContent = score;
                resetBall();
                ball.isShooting = false;
                level++;
                nextLevel();
            } else if (ball.x > canvas.width || ball.y > canvas.height) {
                resetBall();
                ball.isShooting = false;
                level++;
                nextLevel();
            } else {
                requestAnimationFrame(animate);
            }
        }
    };

    animate();
}

// Draw the target
function drawTarget() {
    ctx.fillStyle = 'red';
    ctx.fillRect(target.x, target.y, target.width, target.height);
}

// Draw the ball
function drawBall() {
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

// Reset ball position
function resetBall() {
    ball.x = hazel.x + 25;
    ball.y = hazel.y - 15;
}

// Game over
function gameOver() {
    isGameRunning = false;
    alert(`Game Over! Final Score: ${score}`);
    score = 0;
    document.getElementById('score-value').textContent = score;
    document.getElementById('level-value').textContent = 1;
}

// Initialize the game
function init() {
    hazel.draw();
    drawTarget();
    drawBall();

    canvas.addEventListener('touchstart', chargeShot);
    canvas.addEventListener('touchend', releaseShot);
    canvas.addEventListener('touchcancel', releaseShot);
}

init();
