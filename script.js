
const wolf = document.getElementById('wolf');
const eggContainer = document.getElementById('egg-container');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const gameContainer = document.getElementById('game-container');
const menuContainer = document.getElementById('menu-container');
const startButton = document.getElementById('start-button');
const wolfSlider = document.getElementById('wolf-slider');
const openSkinsMenuButton = document.getElementById('open-skins-menu');
const skinsMenu = document.getElementById('skins-menu');
const skinsSlider = document.getElementById('skins-slider');
const prevSkinBtn = document.getElementById('prev-skin-btn');
const nextSkinBtn = document.getElementById('next-skin-btn');
const closeSkinsBtn = document.getElementById('close-skins-btn');
let selectedSkin = 'wolf.png';
let score = 0;
let lastScore = 0;
let lives = 3;
let wolfPosition = 50;
let eggSpeed = 2;
let eggs = [];
const eggInterval = 1500;
let gameInterval = null;
let createEggInterval = null;
let isGameRunning = false;
const skins = [
    'wolf.png',
    'wolf2.png',
    'wolf3.png',
    'wolf4.png',
    'wolf5.png',
    'wolf6.png',
    'wolf7.png',
    'wolf8.png',
    'wolf9.png',
     'wolf10.png',
];
let currentSkinIndex = 0;
const skinWidth = 160;


function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function adjustForMobile() {
  if (isMobile()) {
    document.body.classList.add('mobile');
  }
}
window.addEventListener('load', adjustForMobile);

function handleTouch(event) {
    if (!isGameRunning) {
        return;
    }
    // Ничего не делаем, касания экрана больше не перемещают волка
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
    const eggWidth = 30;
    const eggHeight = 40;
    const eggCenterX = parseInt(egg.style.left) + eggWidth / 2;
    const eggBottom = eggTop + eggHeight;
    const wolfLeft = wolf.offsetLeft;
    const wolfRight = wolfLeft + wolf.offsetWidth;
    const wolfTop = wolf.offsetTop;
    const wolfBottom = wolfTop + wolf.offsetHeight;
    if (
      eggBottom > wolfTop &&
      eggTop < wolfBottom &&
      eggCenterX + eggWidth / 2 > wolfLeft &&
      eggCenterX - eggWidth / 2 < wolfRight
    ) {
        score++;
        scoreDisplay.innerText = "Счёт: " + score;
         if (score > 0 && score % 15 === 0 && score > lastScore) { // проверяем, набрал ли игрок 15 очков и не увеличивали ли мы уже скорость в текущий момент
              eggSpeed += 0.5; // увеличиваем скорость
              lastScore = score; // обновляем lastScore
            }
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
        alert("Игра окончена! Ваш счёт: " + score);
        stopGame();
      }
    }
  }
  if (isGameRunning) {
    requestAnimationFrame(moveEggs);
  }
}
function startGame() {
    if (isGameRunning) {
        return;
    }
    isGameRunning = true;
    menuContainer.style.display = "none";
    skinsMenu.style.display = 'none'
    gameContainer.style.display = "block";
    score = 0;
    lastScore = 0;
    lives = 3;
    scoreDisplay.innerText = "Счёт: " + score;
    livesDisplay.innerText = "Жизни: " + lives;
    wolfPosition = 50;
    wolf.style.left = wolfPosition + '%';
    wolf.style.backgroundImage = `url('${selectedSkin}')`;
    eggs = [];
    eggContainer.innerHTML = '';
    eggSpeed = 2;
    createEggInterval = setInterval(createEgg, eggInterval);
     requestAnimationFrame(moveEggs);
    requestAnimationFrame(moveWolf);
}


function stopGame() {
    isGameRunning = false;
    clearInterval(createEggInterval);
    gameContainer.style.display = 'none';
    menuContainer.style.display = 'flex';
}

function handleKeyDown(event) {
    if (!isGameRunning) {
        return;
    }
    if (event.key === 'a' || event.key === 'A') {
           wolfPosition = Math.max(0, wolfPosition - 10);
        wolf.style.left = wolfPosition + '%';
    } else if (event.key === 'd' || event.key === 'D') {
         wolfPosition = Math.min(100, wolfPosition + 10);
        wolf.style.left = wolfPosition + '%';
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

function openSkinsMenu() {
   menuContainer.style.display = 'none';
   skinsMenu.style.display = 'flex';
}

function closeSkinsMenu() {
   menuContainer.style.display = 'flex';
   skinsMenu.style.display = 'none';
}

function createSkinButtons() {
  skins.forEach((skin, index) => {
    const button = document.createElement('div');
    button.classList.add('skin-button');
    button.innerHTML = `
      <img class="skin-image" src="${skin}" alt="Skin ${index + 1}">
    `;
    button.addEventListener('click', () => {
        selectedSkin = skin;
          wolf.style.backgroundImage = `url('${selectedSkin}')`;
        closeSkinsMenu();
      });
    skinsSlider.appendChild(button);
  });
    skinsSlider.style.width = `${skins.length * skinWidth}px`;
}
function prevSkin() {
    currentSkinIndex = Math.max(0, currentSkinIndex - 1);
      skinsSlider.style.transform = `translateX(-${currentSkinIndex * skinWidth}px)`;
}

function nextSkin() {
  currentSkinIndex = Math.min(skins.length - 1, currentSkinIndex + 1);
    skinsSlider.style.transform = `translateX(-${currentSkinIndex * skinWidth}px)`;
}
gameContainer.addEventListener('touchstart', handleTouch, {
    passive: false
});
gameContainer.addEventListener('touchmove', handleTouch, {
    passive: false
});
document.addEventListener('keydown', handleKeyDown);
startButton.addEventListener('click', startGame);
wolfSlider.addEventListener('input', function () {
    if (!isGameRunning) return;
     wolfPosition = parseInt(this.value);
     wolf.style.left = wolfPosition + '%';
});
openSkinsMenuButton.addEventListener('click', openSkinsMenu);
closeSkinsBtn.addEventListener('click', closeSkinsMenu);
prevSkinBtn.addEventListener('click', prevSkin);
nextSkinBtn.addEventListener('click', nextSkin);

createSkinButtons();