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

let level = 1;
let xp = 0;
let xpNeeded = 5;

let damage = 25;

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
        hp: 50,
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

    if (keys.up) playerY -= speed;
    if (keys.down) playerY += speed;
    if (keys.left) playerX -= speed;
    if (keys.right) playerX += speed;

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
// KONTROL HP
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
}

buttonControl("up", "up");
buttonControl("down", "down");
buttonControl("left", "left");
buttonControl("right", "right");

// =========================
// HP BAR
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
// XP BAR
// =========================

function createXPBar() {

    const xpContainer =
        document.createElement("div");

    xpContainer.id = "xpContainer";

    const xpBar =
        document.createElement("div");

    xpBar.id = "xpBar";

    xpContainer.appendChild(xpBar);

    game.appendChild(xpContainer);
}

createXPBar();

function updateXP() {

    const xpBar =
        document.getElementById("xpBar");

    const percentage =
        (xp / xpNeeded) * 100;

    xpBar.style.width =
        percentage + "%";
}

// =========================
// LEVEL
// =========================

function updateLevelText() {

    const levelText =
        document.getElementById("levelText");

    if (levelText) {
        levelText.textContent =
            "LEVEL " + level;
    }
}

function gainXP(amount) {

    xp += amount;

    if (xp >= xpNeeded) {

        xp -= xpNeeded;

        level++;

        xpNeeded =
            Math.floor(xpNeeded * 1.4);

        updateLevelText();

        updateXP();

        showLevelUp();

        return;
    }

    updateXP();
}

// =========================
// DAMAGE PLAYER
// =========================

function damagePlayer(amount) {

    playerHP -= amount;

    if (playerHP < 0) {
        playerHP = 0;
    }

    updateHP();

    if (playerHP <= 0) {
        gameOver();
    }
}

// =========================
// MUSUH MENGEJAR
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
// MAGIC
// =========================

let projectiles = [];

function findNearestEnemy() {

    let nearest = null;
    let nearestDistance = Infinity;

    enemies.forEach(function(enemy) {

        const dx =
            enemy.x - playerX;

        const dy =
            enemy.y - playerY;

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        if (distance < nearestDistance) {

            nearestDistance = distance;
            nearest = enemy;
        }
    });

    return nearest;
}

function shootMagic() {

    const target =
        findNearestEnemy();

    if (!target) return;

    const magic =
        document.createElement("div");

    magic.classList.add("magic");

    let x = playerX;
    let y = playerY;

    magic.style.left =
        x + "px";

    magic.style.top =
        y + "px";

    game.appendChild(magic);

    const dx =
        target.x - x;

    const dy =
        target.y - y;

    const distance =
        Math.sqrt(dx * dx + dy * dy);

    projectiles.push({
        element: magic,
        x: x,
        y: y,
        vx: dx / distance * 7,
        vy: dy / distance * 7
    });
}

setInterval(function() {
    shootMagic();
}, 700);

// =========================
// UPDATE MAGIC
// =========================

function updateProjectiles() {

    projectiles.forEach(function(
        projectile,
        projectileIndex
    ) {

        projectile.x += projectile.vx;
        projectile.y += projectile.vy;

        projectile.element.style.left =
            projectile.x + "px";

        projectile.element.style.top =
            projectile.y + "px";

        enemies.forEach(function(
            enemy,
            enemyIndex
        ) {

            const dx =
                projectile.x - enemy.x;

            const dy =
                projectile.y - enemy.y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (distance < 25) {

                enemy.hp -= damage;

                projectile.element.remove();

                projectiles.splice(
                    projectileIndex,
                    1
                );

                if (enemy.hp <= 0) {

                    enemy.element.remove();

                    enemies.splice(
                        enemyIndex,
                        1
                    );

                    // Dapat XP
                    gainXP(1);
                }
            }
        });
    });

    requestAnimationFrame(updateProjectiles);
}

// =========================
// LEVEL UP MENU
// =========================

function showLevelUp() {

    const menu =
        document.createElement("div");

    menu.id = "levelUp";

    menu.innerHTML = `
        <div class="levelUpBox">

            <h1>LEVEL UP!</h1>

            <p>Pilih peningkatan:</p>

            <button id="skillDamage">
                🔥 DAMAGE +10
            </button>

            <button id="skillSpeed">
                ⚡ MAGIC SPEED
            </button>

            <button id="skillHP">
                ❤️ MAX HP +20
            </button>

        </div>
    `;

    game.appendChild(menu);

    document.getElementById(
        "skillDamage"
    ).onclick = function() {

        damage += 10;

        menu.remove();
    };

    document.getElementById(
        "skillSpeed"
    ).onclick = function() {

        menu.remove();

        alert("Magic Speed akan dikembangkan pada versi berikutnya!");
    };

    document.getElementById(
        "skillHP"
    ).onclick = function() {

        maxHP += 20;

        playerHP += 20;

        updateHP();

        menu.remove();
    };
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

            <p>Level kamu: ${level}</p>

            <button onclick="location.reload()">
                MAIN LAGI
            </button>

        </div>
    `;

    game.appendChild(screen);
}

// =========================
// MULAI
// =========================

updatePlayer();
updateEnemies();
updateProjectiles();
updateHP();
updateXP();
