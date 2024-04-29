const overlay = document.getElementById('overlay');
const orientationButton = document.getElementById('orientationButton');
const maze = document.getElementById('maze');
const player = document.getElementById('player');
const end = document.getElementById('end');
const walls = document.querySelectorAll('.wall');
const scoreCounter = document.getElementById('scoreCounter');
const resetButton = document.getElementById('resetButton');
let score = 0;

let prevX = 0;
let prevY = 0;

let endpointPosition = 'topRight';

orientationButton.addEventListener('click', enableOrientation);
resetButton.addEventListener('click', resetPlayerPosition);

function resetPlayerPosition() {
    prevX = 0;
    prevY = 0;
    player.style.left = '0px';
    player.style.top = '0px';
}

function enableOrientation() {
    overlay.style.display = 'none';
    alert("To play this game, please enable device orientation by rotating your device. Tap 'OK' to continue.");
    orientationButton.style.display = 'none';
    window.addEventListener('deviceorientation', movePlayer);
    document.addEventListener('mousemove', movePlayerWithMouse);
}

function movePlayer(event) {
    const mazeRect = maze.getBoundingClientRect();
    const playerSize = parseInt(window.getComputedStyle(player).width);
    const mazeCenterX = mazeRect.width / 2;
    const mazeCenterY = mazeRect.height / 2;

    let newX, newY;

    if (event instanceof MouseEvent) {
        newX = event.clientX - playerSize / 2;
        newY = event.clientY - playerSize / 2;
    } else if (event instanceof DeviceOrientationEvent) {
        newX = mazeCenterX + event.gamma * (mazeRect.width / 90) - playerSize / 2;
        newY = mazeCenterY + event.beta * (mazeRect.height / 180) - playerSize / 2;
    }

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
        if (endpointPosition === 'topRight') {
            moveEndpointToBottomLeft();
        } else if (endpointPosition === 'bottomLeft') {
            endpointPosition = 'disappear';
            end.style.display = 'none';
            playJumpscare();
        }
    }
}

function movePlayerWithMouse(event) {
    movePlayer(event);
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

function moveEndpointToBottomLeft() {
    end.style.top = 'calc(100% - 10px - var(--end-size))';
    end.style.left = '10px';
    endpointPosition = 'bottomLeft';
}

function playJumpscare() {
    const jumpscareImage = document.createElement('img');
    jumpscareImage.src = 'face.jpg';
    jumpscareImage.style.position = 'absolute';
    jumpscareImage.style.width = '100%';
    jumpscareImage.style.height = '100%';
    jumpscareImage.style.top = '0';
    jumpscareImage.style.left = '0';
    document.body.appendChild(jumpscareImage);

    const jumpscareSound = new Audio('sound.mp3');
    jumpscareSound.volume = 1;
    jumpscareSound.play();

    setTimeout(() => {
        document.body.removeChild(jumpscareImage);
    }, 3000);
}