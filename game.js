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
// =========================
// SISTEM MUSUH
// =========================

let enemies = [];

function createEnemy() {

    const enemy = document.createElement("div");

    enemy.classList.add("enemy");

    const side = Math.floor(Math.random() * 4);

    let x;
    let y;

    if (side === 0) {
        // Atas
        x = Math.random() * window.innerWidth;
        y = -40;
    }

    if (side === 1) {
        // Kanan
        x = window.innerWidth + 40;
        y = Math.random() * window.innerHeight;
    }

    if (side === 2) {
        // Bawah
        x = Math.random() * window.innerWidth;
        y = window.innerHeight + 40;
    }

    if (side === 3) {
        // Kiri
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
        speed: 1.2
    });
}


// Membuat musuh setiap 1,5 detik
setInterval(function() {
    createEnemy();
}, 1500);


// Gerakkan semua musuh menuju pemain
function updateEnemies() {

    enemies.forEach(function(enemy) {

        const dx = playerX - enemy.x;
        const dy = playerY - enemy.y;

        const distance = Math.sqrt(
            dx * dx + dy * dy
        );

        if (distance > 1) {

            enemy.x +=
                (dx / distance) * enemy.speed;

            enemy.y +=
                (dy / distance) * enemy.speed;
        }

        enemy.element.style.left =
            enemy.x + "px";

        enemy.element.style.top =
            enemy.y + "px";
    });

    requestAnimationFrame(updateEnemies);
}

updateEnemies();
// =========================
// SISTEM MAGIC OTOMATIS
// =========================

let projectiles = [];

function findNearestEnemy() {

    let nearest = null;
    let nearestDistance = Infinity;

    enemies.forEach(function(enemy) {

        const dx = enemy.x - playerX;
        const dy = enemy.y - playerY;

        const distance = Math.sqrt(
            dx * dx + dy * dy
        );

        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearest = enemy;
        }

    });

    return nearest;
}


function shootMagic() {

    const target = findNearestEnemy();

    if (!target) {
        return;
    }

    const magic = document.createElement("div");

    magic.classList.add("magic");

    let x = playerX;
    let y = playerY;

    magic.style.left = x + "px";
    magic.style.top = y + "px";

    game.appendChild(magic);

    const dx = target.x - x;
    const dy = target.y - y;

    const distance = Math.sqrt(
        dx * dx + dy * dy
    );

    projectiles.push({
        element: magic,
        x: x,
        y: y,
        vx: dx / distance * 7,
        vy: dy / distance * 7
    });
}


// Magic ditembak setiap 700ms
setInterval(function() {
    shootMagic();
}, 700);


// Gerakkan magic
function updateProjectiles() {

    projectiles.forEach(function(projectile, projectileIndex) {

        projectile.x += projectile.vx;
        projectile.y += projectile.vy;

        projectile.element.style.left =
            projectile.x + "px";

        projectile.element.style.top =
            projectile.y + "px";


        // Cek tabrakan dengan musuh
        enemies.forEach(function(enemy, enemyIndex) {

            const dx =
                projectile.x - enemy.x;

            const dy =
                projectile.y - enemy.y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (distance < 25) {

                // Hapus musuh
                enemy.element.remove();

                enemies.splice(
                    enemyIndex,
                    1
                );

                // Hapus magic
                projectile.element.remove();

                projectiles.splice(
                    projectileIndex,
                    1
                );
            }

        });

    });

    requestAnimationFrame(updateProjectiles);
}

updateProjectiles();
