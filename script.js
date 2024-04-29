document.addEventListener('DOMContentLoaded', function () {
    const player = document.getElementById('player');
    const gameArea = document.getElementById('game-area');
    const goal = document.getElementById('goal');
    const walls = document.querySelectorAll('.wall');

    let canMove = true;

    function resetPlayer() {
        const bottomCenterTop = gameArea.clientHeight - player.clientHeight;
        const bottomCenterLeft = (gameArea.clientWidth / 2) - (player.clientWidth / 2);
        player.style.top = `${bottomCenterTop}px`;
        player.style.left = `${bottomCenterLeft}px`;
        canMove = true;
    }

    function handleOrientation(event) {
        if (!canMove) {
            return;
        }

        let x = event.beta;
        let y = event.gamma;

        let newX = gameArea.clientWidth / 2 + (y / 30) * (gameArea.clientWidth / 2 - player.clientWidth);
        let newY = gameArea.clientHeight / 2 + (x / 30) * (gameArea.clientHeight / 2 - player.clientHeight);

        // update player position
        player.style.left = `${Math.max(0, Math.min(gameArea.clientWidth - player.clientWidth, newX))}px`;
        player.style.top = `${Math.max(0, Math.min(gameArea.clientHeight - player.clientHeight, newY))}px`;

        checkInteractions(newX, newY);
    }

    function checkInteractions(newX, newY) {
        if (checkCollision(newX, newY)) {
            canMove = false;
            setTimeout(() => {
                alert('You hit a wall!');
                resetPlayer();
            }, 100);
        }

        if (checkGoal(newX, newY)) {
            canMove = false;
            setTimeout(() => {
                alert('Congratulations, you reached the goal!');
                resetPlayer();
            }, 100);
        }
    }

    function checkCollision(newX, newY) {
        const playerRect = player.getBoundingClientRect();
        return Array.from(walls).some(wall => {
            const rect = wall.getBoundingClientRect();
            return !(rect.right < playerRect.left ||
                rect.left > playerRect.right ||
                rect.bottom < playerRect.top ||
                rect.top > playerRect.bottom);
        });
    }

    function checkGoal(newX, newY) {
        const rect = goal.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        return !(rect.right < playerRect.left ||
            rect.left > playerRect.right ||
            rect.bottom < playerRect.top ||
            rect.top > playerRect.bottom);
    }

    window.addEventListener('deviceorientation', handleOrientation);

    resetPlayer();
});
