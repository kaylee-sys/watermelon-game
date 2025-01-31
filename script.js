const wolf = document.getElementById('wolf');
const eggContainer = document.getElementById('egg-container');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const gameContainer = document.getElementById('game-container');
const menuContainer = document.getElementById('menu-container');
const startButton = document.getElementById('start-button');
const leftArrowBtn = document.getElementById('left-arrow');
const rightArrowBtn = document.getElementById('right-arrow');

let selectedSkin = 'wolf.png';
let score = 0;
let lives = 3;
let wolfPosition = 50;
const eggSpeed = 2;
let eggs = [];
const eggInterval = 1500;
let gameInterval = null;
let createEggInterval = null;
let isGameRunning = false;

function handleTouch(event) {
    if (!isGameRunning) { return; }

    // Ничего не делаем, касания экрана больше не перемещают волка
}

function moveWolfLeft() {
    if (!isGameRunning) { return; }
    wolfPosition -= 10;
     if (wolfPosition < 0) {
       wolfPosition = 0
     }
    wolf.style.left = wolfPosition + '%';
}

function moveWolfRight() {
    if (!isGameRunning) { return; }
     wolfPosition += 10;
     if (wolfPosition > 100) {
       wolfPosition = 100
     }
    wolf.style.left = wolfPosition + '%';
}

function moveWolf() {
    requestAnimationFrame(moveWolf);
}

function moveEggs() {
    for (let i = 0; i < eggs.length; i++) {
        const egg = eggs[i];
        let eggTop = parseInt(egg.style.top);
        eggTop += eggSpeed;
        egg.style.top = eggTop + 'px';

        // Получаем актуальное положение волка при каждом кадре
        const wolfCenterX = wolf.offsetLeft + wolf.offsetWidth / 2;
        const eggCenterX = parseInt(egg.style.left) + 15;
        const eggBottom = eggTop + 40;
        const wolfTop = wolf.offsetTop;
        const wolfBottom = wolf.offsetTop + wolf.offsetHeight;


        if (
            eggBottom > wolfTop &&
            eggTop < wolfBottom &&
            Math.abs(eggCenterX - wolfCenterX) < wolf.offsetWidth / 2
        ) {
            score++;
            scoreDisplay.innerText = "Счёт: " + score;
            eggContainer.removeChild(egg);
            eggs.splice(i, 1);
            i--;
        } else if (eggTop > 400) {
            lives--;
            livesDisplay.innerText = "Жизни: " + lives;
            eggContainer.removeChild(egg);
            eggs.splice(i, 1);
            i--;
            if (lives <= 0) {
                alert('Игра окончена! Ваш счёт: ' + score);
                stopGame();
            }
        }
    }
}

        function moveEggs() {
        for (let i = 0; i < eggs.length; i++) {
            const egg = eggs[i];
            let eggTop = parseInt(egg.style.top);
            eggTop += eggSpeed;
            egg.style.top = eggTop + 'px';

           const eggWidth = 30; //  Ширина яйца
            const eggHeight = 40; // Высота яйца
             const eggCenterX = parseInt(egg.style.left) + eggWidth / 2; //центр яйца
             const eggBottom = eggTop + eggHeight;  // нижняя граница яйца

            const wolfLeft = wolf.offsetLeft; // левая граница волка
            const wolfRight = wolfLeft + wolf.offsetWidth // правая граница волка
             const wolfTop = wolf.offsetTop; // Верхняя граница волка
           const wolfBottom = wolfTop + wolf.offsetHeight; // Нижняя граница волка

            if (
                eggBottom > wolfTop &&
                eggTop < wolfBottom &&
               eggCenterX + eggWidth/2 > wolfLeft && //яйцо справа от левой границы волка
                eggCenterX - eggWidth/2 < wolfRight   //яйцо слева от правой границы волка
            ) {
                score++;
                scoreDisplay.innerText = "Счёт: " + score;
                eggContainer.removeChild(egg);
                eggs.splice(i, 1);
                i--;
            } else if (eggTop > 400) {
                lives--;
                livesDisplay.innerText = "Жизни: " + lives;
                eggContainer.removeChild(egg);
                eggs.splice(i, 1);
                i--;
                if (lives <= 0) {
                    alert('Игра окончена! Ваш счёт: ' + score);
                    stopGame();
                }
            }
        }
    }
    

function startGame() {
    if (isGameRunning) {
        return;
    }
    isGameRunning = true;
    menuContainer.style.display = "none";
    gameContainer.style.display = "block";
    score = 0;
    lives = 3;
    scoreDisplay.innerText = "Счёт: " + score;
    livesDisplay.innerText = "Жизни: " + lives;
    wolfPosition = 50;
    wolf.style.left = wolfPosition + '%';
    wolf.style.backgroundImage = `url('${selectedSkin}')`;
    eggs = [];
    eggContainer.innerHTML = '';
    createEggInterval = setInterval(createEgg, eggInterval);
    gameInterval = setInterval(() => {
        moveEggs();
    }, 16);
    requestAnimationFrame(moveWolf);
}

function stopGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    clearInterval(createEggInterval);
    gameContainer.style.display = 'none';
    menuContainer.style.display = 'flex';
}

function handleKeyDown(event) {
    if (!isGameRunning) { return; }
    if (event.key === 'a' || event.key === 'A') {
        moveWolfLeft();
    } else if (event.key === 'd' || event.key === 'D') {
        moveWolfRight();
    }
}

function createEgg() {
    const egg = document.createElement('div');
    egg.classList.add('egg');
    egg.style.left = Math.random() * 560 + 'px';
    egg.style.top = -40 + 'px';
    eggContainer.appendChild(egg);
    eggs.push(egg);
}

const skinButtons = document.querySelectorAll('.skins-container button');
skinButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedSkin = button.getAttribute('data-skin');
    });
});

gameContainer.addEventListener('touchstart', handleTouch, { passive: false });
gameContainer.addEventListener('touchmove', handleTouch, { passive: false });

leftArrowBtn.addEventListener('click', moveWolfLeft);
rightArrowBtn.addEventListener('click', moveWolfRight);

document.addEventListener('keydown', handleKeyDown);

startButton.addEventListener('click', startGame);