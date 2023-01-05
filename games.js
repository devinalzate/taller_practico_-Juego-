const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');


window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timeWin;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
};

const giftPosition = {
    x: undefined,
    y: undefined,
};

let enemiesPositions = [];

function fixNumber(n){
    return Number(n.toFixed(2));
}

function setCanvasSize() {

    if (window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
    }

    canvasSize = Number(canvasSize.toFixed(0));


    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10.2;

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
};

function startGame()
{
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];

    if(!map){
        gameWin();
        return;
    }

    if(!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTimes, 100);
    }

    enemiesPositions = [];
    game.clearRect(0,0,canvasSize,canvasSize);

    const mapRows = map.trim().split('\n');
    const mapRowsCols = mapRows.map (row => row.trim().split(''));

    showLives();

    mapRowsCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                  playerPosition.x = posX;
                  playerPosition.y = posY;
                  console.log({playerPosition});
                }
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col == 'X'){
                enemiesPositions.push({
                    x: posX,
                    y: posY,
                });
            }
            


            game.fillText(emoji, posX, posY);
            // console.log({row, rowI, col, colI});
        })
    });

    movePlayer();

    // for (let row = 1; row <= 10; row++) {   **esto solo es una forma mas de hacer lo de arriba para renderizar el mapa pero esta es mas complicada
    //     for (let col = 1; col <=10; col++) {
    //         game.fillText(emojis[mapRowsCols[row - 1][col - 1]], elementSize * col, elementSize * row)
    //     }
    // }   
};

function movePlayer() {

    const giftColisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftColisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftColision = giftColisionX && giftColisionY;

    if(giftColision){
        levelWin();
    };

    const enemyColision = enemiesPositions.find(enemy => {

       const enemyColisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
       const enemyColisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);

       return enemyColisionX && enemyColisionY;
    });
    
    if(enemyColision){
        levelDefeat();
    };

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
    
};


function levelDefeat(){
    console.log('Perdiste');
    lives--;
    
    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }
    
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    setCanvasSize();
}

function showLives(){
    // const heartsArray = Array(lives).fill(emojis['HEART']); **Esta era mi solucion

    // spanLives.innerHTML = heartsArray;
    spanLives.innerHTML = emojis["HEART"].repeat(lives)
}

function showTimes(){
    spanTime.innerHTML = Date.now() - timeStart;
    spanRecord.innerHTML = localStorage.getItem('record_time')
}

function levelWin(){
    console.log('Subiste de nivel');
    level ++;
    setCanvasSize();
}


function gameWin(){
    console.log('Juego terminado');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = spanTime.innerHTML = Date.now() - timeStart;

    if(recordTime){
        if(recordTime > playerTime){
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'Superaste el record';
        } else{
            pResult.innerHTML = 'No superaste el record';
        }
    }else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'Felicidades por tu primera vez, intenta superar tu record';
    }
    console.log(recordTime, playerTime);
}


    // codigo para moverse con flechas

    
    document.addEventListener('keydown', keyDown);
    

    const btnUp = document.querySelector('#up');
    const btnLeft = document.querySelector('#left');
    const btnRight = document.querySelector('#right');
    const btnDown = document.querySelector('#down');

    btnUp.addEventListener('click', moveUp); //Si encima del boton "Arriba" se escucha un evento "click", se realizara la funcion "moveUp"
    btnLeft.addEventListener('click', moveLeft); // ""
    btnRight.addEventListener('click', moveRight); // ""
    btnDown.addEventListener('click', moveDown); // ""


function keyDown(evento) {
    if (evento.key == 'ArrowUp') moveUp();
    else if (evento.key == 'ArrowLeft') moveLeft();
    else if (evento.key == 'ArrowRight') moveRight();
    else if (evento.key == 'ArrowDown') moveDown();
};

    function moveUp() {
    console.log('Me quiero mover hacia arriba');

        if ((playerPosition.y - elementsSize) < elementsSize) {
            console.log('OUT');
        } else {
            playerPosition.y -= elementsSize;
            startGame();
        }
    }
    function moveLeft() {
    console.log('Me quiero mover hacia izquierda');

        if ((playerPosition.x - elementsSize) < elementsSize) {
            console.log('OUT');
        } else {
            playerPosition.x -= elementsSize;
            startGame();
        }
    }
    function moveRight() {
    console.log('Me quiero mover hacia derecha');

        if ((playerPosition.x + elementsSize) > canvasSize) {
            console.log('OUT');
        } else {
            playerPosition.x += elementsSize;
            startGame();
        }
    }
    function moveDown() {
    console.log('Me quiero mover hacia abajo');
    
        if ((playerPosition.y + elementsSize) > canvasSize) {
            console.log('OUT');
        } else {
            playerPosition.y += elementsSize;
            startGame();
        }
    }