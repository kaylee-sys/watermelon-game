
const wolf = document.getElementById('wolf');
const eggContainer = document.getElementById('egg-container');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const gameContainer = document.getElementById('game-container');
const menuContainer = document.getElementById('menu-container');
const startButton = document.getElementById('start-button');
const leftArrowBtn = document.getElementById('left-arrow');
const rightArrowBtn = document.getElementById('right-arrow');

let score = 0;
let lives = 3;
let wolfPosition = 50; // Позиция волка в процентах
const eggSpeed = 2;
let eggs = [];
const eggInterval = 1500; // Задержка появления яйца
let gameInterval = null; // Идентификатор интервала игры
let createEggInterval = null; // Идентификатор интервала создания яиц
let isGameRunning = false; // флаг для проверки, запущена ли игра

function createEgg() {
    const egg = document.createElement('div');
    egg.classList.add('egg');
    egg.style.left = Math.random() * 560 + 'px'; // Случайная горизонтальная позиция
    egg.style.top = -40 + 'px';
    eggContainer.appendChild(egg);
    eggs.push(egg);
}

function moveEggs() {
    for (let i = 0; i < eggs.length; i++) {
        const egg = eggs[i];
        let eggTop = parseInt(egg.style.top);
        eggTop += eggSpeed;

        egg.style.top = eggTop + 'px';

        // Расчет центров и границ
        const wolfCenterX = wolf.offsetLeft + wolf.offsetWidth / 2; // Центр волка
        const eggCenterX = parseInt(egg.style.left) + 15;          // Центр яйца (15 - половина ширины яйца)
        const eggBottom = eggTop + 40;                            // Нижняя граница яйца
        const wolfTop = wolf.offsetTop;                            // Верхняя граница волка
        const wolfBottom = wolf.offsetTop + wolf.offsetHeight;    // Нижняя граница волка

        // Проверка столкновения
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
        } else if (eggTop > 400) { // Яйцо упало на землю
            lives--;
            livesDisplay.innerText = "Жизни: " + lives;
            eggContainer.removeChild(egg);
            eggs.splice(i, 1);
            i--;
            if (lives <= 0) {
                alert('Игра окончена! Ваш счёт: ' + score);
                stopGame(); // Остановить игру если кончились жизни
            }
        }
    }
}

// Функция запуска игры
function startGame() {
    if (isGameRunning) { // если игра уже запущена, ничего не делать
        return;
    }
    isGameRunning = true;
    menuContainer.style.display = "none"; // Скрываем меню
    gameContainer.style.display = "block"; // Показываем игровое поле
    score = 0;
    lives = 3;
    scoreDisplay.innerText = "Счёт: " + score;
    livesDisplay.innerText = "Жизни: " + lives;

    wolfPosition = 50;
    wolf.style.left = wolfPosition + '%';
    eggs = [];
    eggContainer.innerHTML = ''; // Очистка яиц из предыдущей игры

    // Запускаем создание яиц
    createEggInterval = setInterval(createEgg, eggInterval);

    // Запускаем движение яиц
    gameInterval = setInterval(() => {
        moveEggs();
    }, 16);
}

// Функция остановки игры
function stopGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    clearInterval(createEggInterval);
    gameContainer.style.display = 'none';
    menuContainer.style.display = 'flex';
}

// Обработчик касаний экрана
function handleTouch(event) {
    if (!isGameRunning) { return; } // Если игра не запущена - не обрабатываем касания
    const touchX = event.touches[0].clientX;
    const gameRect = gameContainer.getBoundingClientRect(); // Получаем координаты контейнера

    // Вычисляем позицию касания относительно контейнера игры
    const relativeTouchX = touchX - gameRect.left;

    if (relativeTouchX < gameRect.width / 2 && wolfPosition > 5) {
        // Касание в левой части экрана
        wolfPosition -= 10; // Двигаем волка влево
    } else if (relativeTouchX > gameRect.width / 2 && wolfPosition < 95) {
        // Касание в правой части экрана
        wolfPosition += 10; // Двигаем волка вправо
    }
    // Устанавливаем позицию волка
    wolf.style.left = wolfPosition + '%';
}
// Обработчики для кнопок стрелок
function moveWolfLeft() {
    if (!isGameRunning) { return; }
    if (wolfPosition > 5) {
        wolfPosition -= 10;
        wolf.style.left = wolfPosition + '%';
    }
}
function moveWolfRight() {
    if (!isGameRunning) { return; }
    if (wolfPosition < 95) {
        wolfPosition += 10;
        wolf.style.left = wolfPosition + '%';
    }
}
// Обработчик для клавиш клавиатуры
function handleKeyDown(event) {
  if (!isGameRunning) { return; }
    if (event.key === 'a' || event.key === 'A') {
        moveWolfLeft();
    } else if (event.key === 'd' || event.key === 'D') {
        moveWolfRight();
    }
}

// Добавляем обработчики touchstart и touchmove
gameContainer.addEventListener('touchstart', handleTouch, { passive: false });
gameContainer.addEventListener('touchmove', handleTouch, { passive: false });

// Добавляем обработчики для кнопок стрелок
leftArrowBtn.addEventListener('click', moveWolfLeft);
rightArrowBtn.addEventListener('click', moveWolfRight);

// Добавляем обработчик для клавиш клавиатуры
document.addEventListener('keydown', handleKeyDown);

// Обработчик для кнопки старта
startButton.addEventListener('click', startGame);

