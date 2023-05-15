function Player(left, top, play, lifes, score){
    this.left = left;
    this.top = top;
    this.play = play;
    this.lifes = lifes;
    this.score = score;
}

function Enemigo(left, top, boss, points, radio){
    this.left = left;
    this.top = top;
    this.boss = boss;
    this.points = points;
    this.radio = radio;
}

let misiles = [];
let explosiones = [];
let level = 1;
let newrecord = 0;
let enemies = [];
let nojugando = true;

const player = new Player(350, 530, 1, 3, 0);


function gameOver(){
    const modal = document.querySelector(".modal");
    let mensaje = `Juego Terminado\nPuntaje : ${player.score}\nLevel : ${level}`;
    drawScore();
    if (player.score >= newrecord){
        mensaje += `\n\n\n¡Felicidades! Has obtenido un nuevo record`;
        newrecord = player.score;
    }
    player.score = 0;
    player.lifes = 3;
    level = 1;
    misiles = [];
    explosiones = [];
    enemies = [];    
    nojugando = true;
    alert(mensaje);
    modal.style.display = "block";
}

const aleatorio = (a, b) => Math.round(Math.random() * (b - a) + parseInt(a));

function creaEnemigos(enemy, boss){
    for(let i = 0; i < enemy; ++i ){
        if (boss > 0){
            let enemigo = new Enemigo (aleatorio(70, 970), 30, 1, 50, 25);
            boss--;
            enemies.push(enemigo);
        } else {
            let enemigo = new Enemigo (aleatorio(70, 970), 30, 0, 10, 15);
            enemies.push(enemigo);
        }
    }
}

function cr(p1, p2, r) {
    let valor = 0;
    valor = Math.abs(p2 - p1);
    if (valor <= r) {
        return true;
    }
    return false;
}

function drawScore() {
    let content = '<div class="puntaje"> SCORE: [' + player.score + ']</div>';
    content += '<div class="puntaje"> LEVEL: <'+ level + '></div>';
    content += '<div class="puntaje"> LIFES: ('+ player.lifes + ')</div>';
    content += '<div class="puntaje"> RECORD: {'+ newrecord + '}</div>';
    document.getElementById("score").innerHTML = content;
}

function drawEnemies() {
    let content = "";
    for (let i = 0; i < enemies.length; ++i) {
        if (!enemies[i].boss) {
            content += "<div class='enemy1' style='left: " + enemies[i].left + "px; top: " + enemies[i].top + "px'></div>";
        } else {
            content += "<div class='boss' style='left: " + enemies[i].left + "px; top: " + enemies[i].top + "px'></div>";
        }
    }
    document.getElementById("enemies").innerHTML = content;
}

function drawPlayer() {
    let content = "";
    content = "<div class='hero' style='left: " + player.left + "px; top: " + player.top + "px'></div>";
    document.getElementById("hero").innerHTML = content;
}

function drawExplota() {
    let content = "";
    for (let i = 0; i < explosiones.length; ++i) {
        if (explosiones[i].time > 0){
            content += "<div class='explota' style='left: " + explosiones[i].left + "px; top: " + explosiones[i].top + "px'></div>";
            explosiones[i].time--;
        } else {
            explosiones.splice(i, 1);
        }
    }
    document.getElementById("explosion").innerHTML = content;
}

function drawMisiles() {
    let content = "";
    for (let i = 0; i < misiles.length; ++i) {
        content += "<div class='bullet' style='left: " + misiles[i].left + "px; top: " + misiles[i].top + "px'></div>";
    }
    document.getElementById("bullets").innerHTML = content;
}

function moveEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].top = enemies[i].top + aleatorio(7, 12);
        if (enemies[i].top > 550) {
            enemies[i].top = 30;
            enemies[i].left = aleatorio(70, 970);
        }
    }
}

function moveMisiles() {
    for (let i = 0; i < misiles.length; i++) {
        misiles[i].top = misiles[i].top - 13;
        if (misiles[i].top < 0){
            misiles.splice(i, 1);
        }
    }
}

function moveExplosion() {
    for (let i = 0; i < explosiones.length; i++) {
        explosiones[i].top = explosiones[i].top + 8;
    }
}

function colision() {
    let audio = document.getElementById("audio");
    for (let i = 0; i < enemies.length; i++) {
        if (cr(player.top, enemies[i].top, enemies[i].radio) && cr(player.left, enemies[i].left, enemies[i].radio)) {            
            audio.play();
            explosiones.push({
                left: enemies[i].left,
                top: enemies[i].top,
                time: 7
            });
            drawExplota();
            player.lifes--;
            if (player.lifes <= 0){                
                drawScore();
                gameOver();
            }
            enemies[i].top = 30;
            enemies[i].left = aleatorio(70, 970);
        }
    }
}

function tunazo() {
    let t1 = 0;
    let t2 = 0;
    let r = 0;
    let audio = document.getElementById("audio");
    for (let i = 0; i < enemies.length; i++) {
        for (let j = 0; j < misiles.length; j++) {
            t1 = misiles[j].top;
            t2 = enemies[i].top;
            r = enemies[i].radio;
            if (cr(t1, t2, r) && cr(misiles[j].left, enemies[i].left, r)) {
                player.score += enemies[i].points;
                if (player.score > newrecord){
                    newrecord = player.score;
                }
                audio.play();
                explosiones.push({
                    left: enemies[i].left,
                    top: enemies[i].top,
                    time: 7
                });
                drawExplota();
                misiles.splice(j, 1);
                enemies[i].top = 30;
                enemies[i].left = aleatorio(70, 970);
            }
        }
    }
}

function gameLoop() {
    let tiempo = 100;
    moveEnemies();
    moveMisiles();
    moveExplosion();
    colision();
    tunazo();
    drawMisiles();
    drawEnemies();
    drawExplota();
    drawScore();
    if (player.score > (200 * level)) {
        tiempo = tiempo - 5;
        level++;
        if (tiempo < 10) {
            tiempo = 10;
        }
    }
    setTimeout(gameLoop, tiempo);
}

document.onkeydown = function(e) {
    const modal = document.querySelector(".modal"); 
    if (e.keyCode == 13) {
        modal.style.display = "none";       
        drawPlayer();
        if (nojugando) {
            nojugando = false;
            creaEnemigos(10,2);
            gameLoop();   
        }    
    }
    if (e.keyCode == 37 && player.left > 10) {
        player.left = player.left - 10;
    }
    if (e.keyCode == 39 && player.left < 970) {
        player.left = player.left + 10;
    }
    if (e.keyCode == 38 && player.top > 230) {
        player.top = player.top - 10;
    }
    if (e.keyCode == 40 && player.top < 530) {
        player.top = player.top + 10;
    }
    if (e.keyCode == 32 && player.top < 530) {
        misiles.push({
            left: (player.left + 8),
            top: (player.top - 8)
        });
        drawMisiles();
    }
    drawPlayer();
}