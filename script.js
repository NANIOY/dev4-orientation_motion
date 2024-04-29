const maze = document.getElementById('maze');
const player = document.getElementById('player');
let end = document.getElementById('end');
const walls = document.querySelectorAll('.wall');
const scoreCounter = document.getElementById('scoreCounter');
let score = 0;

let prevX = 0;
let prevY = 0;

window.addEventListener('deviceorientation', movePlayer);

function movePlayer(event) {
    const mazeRect = maze.getBoundingClientRect();
    const playerSize = parseInt(window.getComputedStyle(player).width);
    const mazeCenterX = mazeRect.width / 2;
    const mazeCenterY = mazeRect.height / 2;

    let newX = mazeCenterX + event.gamma * (mazeRect.width / 90) - playerSize / 2;
    let newY = mazeCenterY + event.beta * (mazeRect.height / 180) - playerSize / 2;

    newX = Math.max(0, Math.min(mazeRect.width - playerSize, newX));
    newY = Math.max(0, Math.min(mazeRect.height - playerSize, newY));

    const dx = newX - prevX;
    const dy = newY - prevY;

    const stepSize = 2;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let finalX = prevX;
    let finalY = prevY;

    for (let step = 0; step < distance; step += stepSize) {
        const nextX = prevX + dx * (step / distance);
        const nextY = prevY + dy * (step / distance);
        if (isCollidingWithWalls(nextX, nextY, playerSize)) {
            finalX = prevX;
            finalY = prevY;
            break;
        }
        finalX = nextX;
        finalY = nextY;
    }

    player.style.left = finalX + 'px';
    player.style.top = finalY + 'px';
    prevX = finalX;
    prevY = finalY;

    if (checkCollision(player, end)) {
        score++;
        scoreCounter.textContent = 'Score: ' + score;
        alert('Congratulations! You made it to the end!');
        moveEndpointToTopRight();
    }
}

function isCollidingWithWalls(x, y, playerSize) {
    for (let wall of walls) {
        const wallRect = wall.getBoundingClientRect();
        if (x + playerSize >= wallRect.left && x <= wallRect.right &&
            y + playerSize >= wallRect.top && y <= wallRect.bottom) {
            return true;
        }
    }
    return false;
}

function checkCollision(player, target) {
    const playerRect = player.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    return !(playerRect.right < targetRect.left ||
        playerRect.left > targetRect.right ||
        playerRect.bottom < targetRect.top ||
        playerRect.top > targetRect.bottom);
}

function moveEndpointToTopRight() {
    end.style.top = '10px';
    end.style.right = '10px';
}
