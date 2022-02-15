let hero;
let heroSize = 30;
let heroSpeed = 2;
let diagonalSpeed = heroSpeed * (1 / 1.44);

let enemies = [];

let enemies_total = 20;
let enemySpeed = 1;
let enemySize = 30;
let enemyHP = 60;

let bullets = [];

let bullet_total = 100;
let bulletSize = 5;
let bulletSpeed = 10;

let bonuses = [];
let bonus;
let bonuses_total = 5;
let bonusSize = 20;


let rightPressed = false,
    leftPressed = false,
    upPressed = false,
    downPressed = false;


let score = 0;
let HP = 100;
let press_F = false;
let press_START = false;

let BGmusic;

document.addEventListener("click", mouseClick, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function mouseClick(e) {
    e.preventDefault();

    bullets.push(new componentBullet(bulletSize, bulletSize, "black", (hero.x + heroSize / 2) - bulletSize / 2, (hero.y + heroSize / 2) - bulletSize / 2, e.offsetX, e.offsetY));

    for (let i = 0; i < bullets.length; i++) {
        if (bullets[i].x > (myGameArea.canvas.width + bullets[i].width) || bullets[i].y > (myGameArea.canvas.height + bullets[i].height) || bullets[i].y < 0 || bullets[i].x < 0) {
            bullets.splice(i, 1);
        }
    }
}


function keyDownHandler(e) {
    e.preventDefault();
    if (e.keyCode == 68 || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.keyCode == 65 || e.key == "ArrowLeft") {
        leftPressed = true;
    } else if (e.keyCode == 87 || e.key == "ArrowUp") {
        upPressed = true;
    } else if (e.keyCode == 83 || e.key == "ArrowDown") {
        downPressed = true;
    }
    if (e.keyCode == 70) {
        press_F = true;
    }
    if (e.keyCode == 13) {
        press_START = true;
    }
}

function keyUpHandler(e) {
    e.preventDefault();
    if (e.keyCode == 68 || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.keyCode == 65 || e.key == "ArrowLeft") {
        leftPressed = false;
    } else if (e.keyCode == 87 || e.key == "ArrowUp") {
        upPressed = false;
    } else if (e.keyCode == 83 || e.key == "ArrowDown") {
        downPressed = false;
    }
    if (e.keyCode == 70) {
        press_F = false;
    }

}

function arrowController() {
    if (rightPressed) {
        hero.speedX = heroSpeed;
        if (hero.x + hero.width > myGameArea.canvas.width) { //wall collide
            hero.x = myGameArea.canvas.width - hero.width;

        }
    } else if (leftPressed) {
        hero.speedX = -heroSpeed;
        if (hero.x < 0) { //wall collide
            hero.x = 0;
        }
    } else {
        hero.speedX = 0;
    }
    if (downPressed) {
        hero.speedY = heroSpeed;
        if (hero.y + hero.height > myGameArea.canvas.height) {
            hero.y = myGameArea.canvas.height - hero.height;
        }
    } else if (upPressed) {
        hero.speedY = -heroSpeed;
        if (hero.y < 0) { //wall collide
            hero.y = 0;
        }
    } else {
        hero.speedY = 0;
    }
    if (upPressed && rightPressed) {
        hero.speedX = diagonalSpeed;
        hero.speedY = -diagonalSpeed;
    } else if (rightPressed && downPressed) {
        hero.speedX = diagonalSpeed;
        hero.speedY = diagonalSpeed;
    } else if (downPressed && leftPressed) {
        hero.speedX = -diagonalSpeed;
        hero.speedY = diagonalSpeed;
    } else if (leftPressed && upPressed) {
        hero.speedX = -diagonalSpeed;
        hero.speedY = -diagonalSpeed;
    }

}

//A.X < B.X + B.Width
//A.X + A.Width > B.X
//A.Y < B.Y + B.Height
//A.Y + A.Height > B.Y

function collision() {
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].x <= (hero.x + hero.width) &&
            enemies[i].x + enemies[i].width >= hero.x &&
            enemies[i].y <= (hero.y + hero.height) &&
            enemies[i].y + enemies[i].height >= hero.y
        ) {
            enemies.splice(i, 1);
            HP -= 10;
        }
    }
    for (let i = 0; i < bonuses.length; i++) {
        if (bonuses[i].x <= (hero.x + hero.width) &&
            bonuses[i].x + bonuses[i].width >= hero.x &&
            bonuses[i].y <= (hero.y + hero.height) &&
            bonuses[i].y + bonuses[i].height >= hero.y
        ) {
            bonuses.splice(i, 1);
            HP += 10;
        }
    }
}

function hitDetection() {
    let remove = false;
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (bullets[i].x <= (enemies[j].x + enemies[j].width) &&
                (bullets[i].x + bullets[i].width) >= enemies[j].x &&
                bullets[i].y <= (enemies[j].y + enemies[j].height) &&
                (bullets[i].y + bullets[i].height) >= enemies[j].y
            ) {
                remove = true;
                enemies[j].health -= 10;
                if ((hero.x + heroSize / 2) <= enemies[j].x) {
                    enemies[j].x += 3;
                } else if ((hero.x + heroSize / 2) >= enemies[j].x) {
                    enemies[j].x -= 3;
                } else if ((hero.y + heroSize / 2) >= enemies[j].y) {
                    enemies[j].y -= 3;
                } else if ((hero.y + heroSize / 2) >= enemies[j].y) {
                    enemies[j].y += 3;
                }

                enemies[j].y = enemies[j].y - (-1);
                if (enemies[j].health <= 0) {
                    enemies.splice(j, 1);
                    score++;
                }

            }
        }
        if (remove == true) {
            bullets.splice(i, 1);

            remove = false;
        }
    }
}

function enemySpawn() {
    if (enemies.length == 0) {
        enemies_total += 10;
        enemySpeed += 0.2;
        if (enemyHP > 10) {
            enemyHP -= 10;
        } else {
            enemyHP = 10;
        }

        if (enemySize > 5) {
            enemySize -= 5;
        }
        for (let i = 0; i < enemies_total / 4; i++) {
            enemies.push(new componentEnemy(enemySize, enemySize, "red", Math.floor(Math.random() * (-myGameArea.canvas.width - enemySize)), Math.floor(Math.random() * (myGameArea.canvas.height - enemySize)), enemyHP));
            enemies.push(new componentEnemy(enemySize, enemySize, "red", Math.floor(Math.random() * (myGameArea.canvas.width - enemySize)), Math.floor(Math.random() * (-myGameArea.canvas.height - enemySize)), enemyHP));
            enemies.push(new componentEnemy(enemySize, enemySize, "red", Math.floor(Math.random() * ((myGameArea.canvas.width - enemySize) + myGameArea.canvas.width)), Math.floor(((myGameArea.canvas.height - enemySize) + Math.random() * myGameArea.canvas.height)), enemyHP));
            enemies.push(new componentEnemy(enemySize, enemySize, "red", Math.floor(((myGameArea.canvas.width - enemySize) + Math.random() * myGameArea.canvas.width)), Math.floor(Math.random() * ((myGameArea.canvas.height - enemySize) + myGameArea.canvas.height)), enemyHP));
        }

    }
}

function bonusSpawn() {
    if (bonuses.length == 0) {
        for (let i = 0; i < bonuses_total; i++) {
            bonus = new component(bonusSize, bonusSize, "green", Math.floor(Math.random() * (myGameArea.canvas.width - bonusSize)), Math.floor(Math.random() * (myGameArea.canvas.height - bonusSize)));
            bonuses.push(bonus);
        }
    }

}

function startGame() {
    myGameArea.start();
    hero = new component(heroSize, heroSize, "black", myGameArea.canvas.width / 2, myGameArea.canvas.height / 2);
    BGmusic = new sound('./music/Power Bots Loop.wav');
    BGmusic2 = new sound('./music/DNB1 130.wav');
    BGmusic3 = new sound('./music/DNBTTLoop 174.wav');

    for (let i = 0; i < enemies_total / 4; i++) {
        enemies.push(new componentEnemy(enemySize, enemySize, "red", Math.floor(Math.random() * (-myGameArea.canvas.width - enemySize)), Math.floor(Math.random() * (myGameArea.canvas.height - enemySize)), enemyHP));
        enemies.push(new componentEnemy(enemySize, enemySize, "red", Math.floor(Math.random() * (myGameArea.canvas.width - enemySize)), Math.floor(Math.random() * (-myGameArea.canvas.height - enemySize)), enemyHP));
        enemies.push(new componentEnemy(enemySize, enemySize, "red", Math.floor(Math.random() * ((myGameArea.canvas.width - enemySize) + myGameArea.canvas.width)), Math.floor(((myGameArea.canvas.height - enemySize) + Math.random() * myGameArea.canvas.height)), enemyHP));
        enemies.push(new componentEnemy(enemySize, enemySize, "red", Math.floor(((myGameArea.canvas.width - enemySize) + Math.random() * myGameArea.canvas.width)), Math.floor(Math.random() * ((myGameArea.canvas.height - enemySize) + myGameArea.canvas.height)), enemyHP));

    }
}


let myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = window.innerWidth * 0.99;
        this.canvas.height = window.innerHeight * 0.99;
        this.canvas.style.cursor = "crosshair"; //hide the original cursor
        this.canvas.offsetLeft = this.canvas.offsetLeft;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}


function drawScore() {
    myGameArea.context.font = "16px Arial";
    myGameArea.context.fillStyle = "black";
    myGameArea.context.fillText("Score: " + score, 8, 20);
}

function drawHP() {
    myGameArea.context.font = "16px Arial";
    myGameArea.context.fillStyle = "black";
    myGameArea.context.fillText("HP: " + HP, myGameArea.canvas.width - 65, 20);
    if (HP <= 0) {
        myGameArea.context.font = "30px Arial ";
        myGameArea.context.fillStyle = "#ff0000";
        myGameArea.context.fillText("You DIED", myGameArea.canvas.width / 2 - 60, myGameArea.canvas.height / 2);
        myGameArea.context.fillText("Press <F> to restart", myGameArea.canvas.width / 2 - 130, myGameArea.canvas.height / 2 + 60);
        if (press_F) {
            document.location.reload();
        }
    }
}

function drawStartScene() {

    myGameArea.context.font = "30px Arial ";
    myGameArea.context.fillStyle = "#ff0000";
    myGameArea.context.fillText("Start tutorial", myGameArea.canvas.width / 2 - 60, myGameArea.canvas.height / 2);
    myGameArea.context.fillText("WASD - moove/CLICK - shoot", myGameArea.canvas.width / 2 - 180, myGameArea.canvas.height / 2 + 60);
    myGameArea.context.fillText("Press <ENTER> to start", myGameArea.canvas.width / 2 - 150, myGameArea.canvas.height / 2 + 120);
}

function component(width, height, color, x, y, health) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.health = health;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function componentBullet(width, height, color, x, y, clickPosX, clickPosY) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.clickPosX = clickPosX;
    this.clickPosY = clickPosY;

    this.trajectoryX = this.clickPosX - (hero.x + heroSize / 2);
    this.trajectoryY = this.clickPosY - (hero.y + heroSize / 2);
    this.mag = Math.sqrt(this.trajectoryX ** 2 + this.trajectoryY ** 2);
    this.speedX = (this.trajectoryX / this.mag) * bulletSpeed; //*speed
    this.speedY = (this.trajectoryY / this.mag) * bulletSpeed; //*speed

    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function componentEnemy(width, height, color, x, y, health) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.health = health;

    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function () {
        this.trajectoryX = (hero.x + heroSize / 2) - this.x;
        this.trajectoryY = (hero.y + heroSize / 2) - this.y;
        this.mag = Math.sqrt(this.trajectoryX ** 2 + this.trajectoryY ** 2);
        this.speedX = (this.trajectoryX / this.mag) * enemySpeed;
        this.speedY = (this.trajectoryY / this.mag) * enemySpeed;
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

function updateGameArea() {

    myGameArea.clear();

    if (!press_START) {
        drawStartScene();
    } else {
        if (enemySpeed <= 1.2) {
            BGmusic.play();
        } else if (enemySpeed > 1.2 && enemySpeed < 1.6) {
            BGmusic.stop();
            BGmusic2.play();
        } else if (enemySpeed >= 1.6) {
            BGmusic2.stop();
            BGmusic3.play();
        }

        if (HP > 0) {
            arrowController();
            if (enemies.length == 0) {
                setTimeout(enemySpawn, 5000);
                bonusSpawn();
            }

            collision();

            hitDetection();

            hero.newPos();
            hero.update();

            if (bullets.length) {
                bullets.forEach(function (bullet) {
                    bullet.newPos();
                    bullet.update();
                })

            };
            if (enemies.length) {
                enemies.forEach(function (enemy) {
                    enemy.newPos();
                    enemy.update();
                })
            };

            if (bonuses.length) {
                bonuses.forEach(function (bonus) {
                    bonus.update();
                })
            }
        };
        drawScore();
        drawHP();
    }
}
