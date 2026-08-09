const player = document.getElementById("player");
const game = document.getElementById("game");

let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;

const speed = 5;

let keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

function updatePlayer() {

    if (keys.up) {
        playerY -= speed;
    }

    if (keys.down) {
        playerY += speed;
    }

    if (keys.left) {
        playerX -= speed;
    }

    if (keys.right) {
        playerX += speed;
    }

    // Batas arena
    const maxX = window.innerWidth - player.offsetWidth;
    const maxY = window.innerHeight - player.offsetHeight;

    playerX = Math.max(0, Math.min(playerX, maxX));
    playerY = Math.max(0, Math.min(playerY, maxY));

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    requestAnimationFrame(updatePlayer);
}

function buttonControl(id, direction) {

    const button = document.getElementById(id);

    button.addEventListener("touchstart", function(e) {
        e.preventDefault();
        keys[direction] = true;
    });

    button.addEventListener("touchend", function(e) {
        e.preventDefault();
        keys[direction] = false;
    });

    button.addEventListener("touchcancel", function() {
        keys[direction] = false;
    });

    // Supaya bisa dites dengan mouse/PC
    button.addEventListener("mousedown", function() {
        keys[direction] = true;
    });

    button.addEventListener("mouseup", function() {
        keys[direction] = false;
    });

    button.addEventListener("mouseleave", function() {
        keys[direction] = false;
    });
}

buttonControl("up", "up");
buttonControl("down", "down");
buttonControl("left", "left");
buttonControl("right", "right");

updatePlayer();
