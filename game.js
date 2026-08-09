const player = document.getElementById("player");
const game = document.getElementById("game");

let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;

const speed = 5;

// =========================
// PLAYER
// =========================

let playerHP = 100;
let maxHP = 100;

let keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

// =========================
// MUSUH
// =========================

let enemies = [];

function createEnemy() {

    const enemy = document.createElement("div");

    enemy.classList.add("enemy");

    const side = Math.floor(Math.random() * 4);

    let x;
    let y;

    if (side === 0) {
        x = Math.random() * window.innerWidth;
        y = -40;
    }

    if (side === 1) {
        x = window.innerWidth + 40;
        y = Math.random() * window.innerHeight;
    }

    if (side === 2) {
        x = Math.random() * window.innerWidth;
        y = window.innerHeight + 40;
    }

    if (side === 3) {
        x = -40;
        y = Math.random() * window.innerHeight;
    }

    enemy.style.left = x + "px";
    enemy.style.top = y + "px";

    game.appendChild(enemy);

    enemies.push({
        element: enemy,
        x: x,
        y: y,
        speed: 1.2,
        damageCooldown: 0
    });
}

setInterval(function() {
    createEnemy();
}, 1500);


// =========================
// GERAK PLAYER
// =========================

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

    const maxX =
        window.innerWidth - player.offsetWidth;

    const maxY =
        window.innerHeight - player.offsetHeight;

    playerX = Math.max(
        0,
        Math.min(playerX, maxX)
    );

    playerY = Math.max(
        0,
        Math.min(playerY, maxY)
    );

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    requestAnimationFrame(updatePlayer);
}


// =========================
// TOMBOL HP
// =========================

function buttonControl(id, direction) {

    const button =
        document.getElementById(id);

    button.addEventListener(
        "touchstart",
        function(e) {

            e.preventDefault();
            keys[direction] = true;

        }
    );

    button.addEventListener(
        "touchend",
        function(e) {

            e.preventDefault();
            keys[direction] = false;

        }
    );

    button.addEventListener(
        "touchcancel",
        function() {

            keys[direction] = false;

        }
    );

    button.addEventListener(
        "mousedown",
        function() {

            keys[direction] = true;

        }
    );

    button.addEventListener(
        "mouseup",
        function() {

            keys[direction] = false;

        }
    );

    button.addEventListener(
        "mouseleave",
        function() {

            keys[direction] = false;

        }
    );
}

buttonControl("up", "up");
buttonControl("down", "down");
buttonControl("left", "left");
buttonControl("right", "right");


// =========================
// HP PLAYER
// =========================

function createHPBar() {

    const hpContainer =
        document.createElement("div");

    hpContainer.id = "hpContainer";

    const hpBar =
        document.createElement("div");

    hpBar.id = "hpBar";

    hpContainer.appendChild(hpBar);

    game.appendChild(hpContainer);
}

createHPBar();


function updateHP() {

    const hpBar =
        document.getElementById("hpBar");

    const percentage =
        (playerHP / maxHP) * 100;

    hpBar.style.width =
        percentage + "%";
}


// =========================
// DAMAGE PLAYER
// =========================

function damagePlayer(damage) {

    playerHP -= damage;

    if (playerHP < 0) {
        playerHP = 0;
    }

    updateHP();

    // Efek terkena serangan
    player.style.transform =
        "translate(-50%, -50%) scale(1.2)";

    setTimeout(function() {

        player.style.transform =
            "translate(-50%, -50%) scale(1)";

    }, 100);

    if (playerHP <= 0) {

        gameOver();

    }
}


// =========================
// MUSUH MENGEJAR PLAYER
// =========================

function updateEnemies() {

    enemies.forEach(function(enemy) {

        const dx =
            playerX - enemy.x;

        const dy =
            playerY - enemy.y;

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {

            enemy.x +=
                (dx / distance) *
                enemy.speed;

            enemy.y +=
                (dy / distance) *
                enemy.speed;
        }

        enemy.element.style.left =
            enemy.x + "px";

        enemy.element.style.top =
            enemy.y + "px";


        // Tabrakan dengan player
        if (distance < 35) {

            if (enemy.damageCooldown <= 0) {

                damagePlayer(10);

                enemy.damageCooldown = 60;
            }
        }

        if (enemy.damageCooldown > 0) {

            enemy.damageCooldown--;
        }

    });

    requestAnimationFrame(updateEnemies);
}


// =========================
// GAME OVER
// =========================

function gameOver() {

    const screen =
        document.createElement("div");

    screen.id = "gameOver";

    screen.innerHTML = `
        <div class="gameOverBox">

            <h1>GAME OVER</h1>

            <p>Kamu bertahan sampai HP habis.</p>

            <button onclick="location.reload()">
                MAIN LAGI
            </button>

        </div>
    `;

    game.appendChild(screen);
}


// =========================
// MULAI GAME
// =========================

updatePlayer();
updateEnemies();
updateHP();
