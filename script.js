const joystickZone = document.getElementById('joystick');
const hpBar = document.getElementById('hpBar');
let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;
let playerHP = 100;
let speed = 2;
let score = 0;
let skillUsed1 = false;
let skillUsed2 = false;
let skillUsed3 = false;
let activeSkill = null;
let isSkillActive = false;


const idleSpriteURL = 'idle100px.png';
const runSpriteURL = 'right100px.png';

const downSpriteURL = 'doown100px.png';

const upSpriteURL = 'up100px.png';

const instructions = document.createElement('div');
instructions.textContent = 'Tap and drag anywhere to move around. Enemies will respawn as you explore. Collect skill potions for new abilities. Use your skills wisely to navigate and conquer challenges!';

instructions.className = 'instructions'; // You can style this class in your CSS

// Append the instructions element to the body
document.body.appendChild(instructions);

// Fade the instructions when joystick starts
function fadeInstructions() {
  instructions.style.opacity = '0.5'; // Set initial opacity to 0
  setTimeout(() => {
    instructions.style.display = 'none'; // Hide the instructions after fading
  }, 10000); // Set the duration of the fade (1 second in this example)
}



setPlayerSprite(idleSpriteURL);

player.style.left = `${playerX}px`;
player.style.top = `${playerY}px`;

const manager = nipplejs.create({
  zone: joystickZone,
  color: 'gray',
  multitouch: true,
});

let joystickAngle = 0;
let isJoystickActive = false;

manager.on('move', handleJoystickMove);
manager.on('start', handleJoystickStart);
manager.on('end', handleJoystickEnd);

function handleJoystickMove(event, nipple) {
  const angle = nipple.angle.radian;
  const moveX = Math.cos(angle) * speed;
  const moveY = Math.sin(angle) * speed;
  const invertedMoveY = -moveY;

  playerX += moveX;
  playerY += invertedMoveY;

  playerX = Math.min(Math.max(playerX, 0), window.innerWidth - player.offsetWidth + 1000);
  playerY = Math.min(Math.max(playerY, 0), window.innerHeight - player.offsetHeight);

  updatePlayerPosition();

  // Check the direction of movement and set the appropriate sprite
  if (Math.abs(moveY) > Math.abs(moveX)) {
    // Moving vertically more than horizontally
    if (moveY > 0) {
      // Moving down
      setPlayerSprite(upSpriteURL);
    } else {
      // Moving up
      setPlayerSprite(downSpriteURL);
    }
  } else {
    // Moving horizontally more than vertically
    if (moveX > 0) {
      player.classList.remove('flipped');
    } else if (moveX < 0) {
      player.classList.add('flipped');
    }
    setPlayerSprite(runSpriteURL);
  }

  joystickAngle = angle;
}


function handleJoystickStart() {
fadeInstructions();
  isJoystickActive = true;
  gameLoop();
  setPlayerSprite(runSpriteURL);


}

function handleJoystickEnd() {
  isJoystickActive = false;
  setPlayerSprite(idleSpriteURL);
}

function setPlayerSprite(spriteURL) {
  player.style.backgroundImage = `url('${spriteURL}')`;
}

function updatePlayerPosition() {
  player.style.left = `${playerX}px`;
  player.style.top = `${playerY}px`;
}

// ...

function createEnemy(direction) {
  const enemy = document.createElement('div');
  enemy.className = 'enemy';

  switch (direction) {
    case 'up':
      enemy.style.backgroundImage = "url('enemyup1.png')";
      break;
    case 'down':
      enemy.style.backgroundImage = "url('enemydown1.png')";
      break;
    case 'left':
      enemy.style.backgroundImage = "url('enemyleft.png')";
       enemy.style.width = '68px';
      break;
    case 'right':
      enemy.style.backgroundImage = "url('enemyright.png')";
       enemy.style.width = '68px';
      break;
    default:
      break;
  }

  const spawnPosition = Math.floor(Math.random() * 4);

  switch (spawnPosition) {
    case 0:
      enemy.style.top = '0';
      enemy.style.left = `${Math.random() * window.innerWidth}px`;
      break;
    case 1:
      enemy.style.bottom = '0';
      enemy.style.left = `${Math.random() * window.innerWidth}px`;
      break;
    case 2:
      enemy.style.left = '0';
      enemy.style.top = `${Math.random() * window.innerHeight}px`;
      break;
    case 3:
      enemy.style.right = '0';
      enemy.style.top = `${Math.random() * window.innerHeight}px`;
      break;
    default:
      break;
  }

  document.body.appendChild(enemy);

  return enemy;
}

function moveEnemyTowardsPlayer(enemy, playerX, playerY) {
   if (!isGameOver) {
  const enemyX = parseFloat(enemy.style.left) || 0;
  const enemyY = parseFloat(enemy.style.top) || 0;

  const angle = Math.atan2(
    playerY + player.offsetHeight / 2 - (enemyY + enemy.offsetHeight / 2),
    playerX + player.offsetWidth / 2 - (enemyX + enemy.offsetWidth / 2)
  );

    if (isCollision(player, enemy, 10)) {
        handlePlayerDamage();
      }

  const moveX = Math.cos(angle) * speed * 0.3;
  const moveY = Math.sin(angle) * speed * 0.3;

  enemy.style.left = `${enemyX + moveX}px`;
  enemy.style.top = `${enemyY + moveY}px`;

  // Adjust the sprite based on the movement direction
  if (Math.abs(moveY) > Math.abs(moveX)) {
    // Moving vertically more than horizontally
    if (moveY > 0) {
      // Moving down
      enemy.style.backgroundImage = "url('https://raw.githubusercontent.com/Ben00000000/asstes/main/enemyup1.png')";
      enemy.style.height = '54px';
    } else {
      // Moving up
      enemy.style.backgroundImage = "url('https://raw.githubusercontent.com/Ben00000000/asstes/main/enemydown1.png')";
      enemy.style.height = '54px';
    }
  } else {
    // Moving horizontally more than vertically
    if (moveX > 0) {
      enemy.style.backgroundImage = "url('https://raw.githubusercontent.com/Ben00000000/asstes/main/enemyleft.png')";
       enemy.style.width = '69px';
       enemy.style.height = '48px';
    } else if (moveX < 0) {
      enemy.style.backgroundImage = "url('https://raw.githubusercontent.com/Ben00000000/asstes/main/enemyright.png')";
       enemy.style.width = '69px';
       enemy.style.height = '48px';
    }
  }
   }
}

function handlePlayerDamage() {
  // Check if player is not using a skill and the skill is not active
  if (!isSkillActive && !activeSkill) {
    playerHP -= 0.01;
    updateHPBar();
  }
}





let blockSpawnTimer = 0;
const blockSpawnInterval = 5000; // 1 second in milliseconds

function gameLoop() {
  if (isJoystickActive) {
    const moveX = Math.cos(joystickAngle) * speed;
    const moveY = Math.sin(joystickAngle) * speed;
    const invertedMoveY = -moveY;

    playerX += moveX;
    playerY += invertedMoveY;

    playerX = Math.min(Math.max(playerX, 0), window.innerWidth - player.offsetWidth);
    playerY = Math.min(Math.max(playerY, 0), window.innerHeight - player.offsetHeight);

    updatePlayerPosition();
    checkBlockCollisions();


    if (Math.random() < 0.01) {
      const enemy = createEnemy();

      function move() {
        moveEnemyTowardsPlayer(enemy, playerX, playerY);
        requestAnimationFrame(move);
      }

      move();

      // Add a delay (e.g., 1000 milliseconds) before creating a new enemy
      setTimeout(function () {
        // Call the code to create a new enemy after the delay
        if (Math.random() < 0.01) {
          const newEnemy = createEnemy();
          moveEnemyTowardsPlayer(newEnemy, playerX, playerY);
        }
      }, 5000);
    }

    // Increment the timer
    blockSpawnTimer += 16; // Assuming 60 frames per second (1000 ms / 60 frames)

    // Check if it's time to spawn a block
    if (blockSpawnTimer >= blockSpawnInterval) {
      createBlock();
      blockSpawnTimer = 0; // Reset the timer
    }
    updateSkillButtonVisibility();
    updateHPBar();
    requestAnimationFrame(gameLoop);
  }
}








function updateHPBar() {
  const hpBar = document.getElementById('hpBar');
  const maxHP = 100;
  const greenThreshold = 80;
  const blueThreshold = 30;

  // Update HP bar width based on player HP
  hpBar.style.width = `${playerHP}%`;

  // Change color based on HP range
  if (playerHP >= greenThreshold) {
    hpBar.style.backgroundColor = 'green';
  } else if (playerHP >= blueThreshold) {
    hpBar.style.backgroundColor = 'blue';
  } else {
    hpBar.style.backgroundColor = 'red';
  }

  // You can also add visual effects or additional styling based on the color if needed

  // Check if player HP is zero and handle game over logic
  if (playerHP <= 0) {
    gameOver();
  }
}

let isGameOver = false; // Add a flag to track game over state

function gameOver() {

  // Display the game over screen
  const gameOverScreen = document.getElementById('gameOverScreen');
  const scoreDisplay = document.getElementById('scoreDisplay');
  scoreDisplay.textContent = `Score: ${score}`;
  gameOverScreen.style.display = 'flex'; // Assuming you want to use flex for centering

  // Stop the game loop and enemy movements
  isJoystickActive = false;
  isGameOver = true;
}

// Add an event listener to restart the game when the player clicks the restart button
document.getElementById('restartButton').addEventListener('click', () => {
  // Remove all enemies
  removeAllEnemies();
  const gameOverScreen = document.getElementById('gameOverScreen');
  gameOverScreen.style.display = 'none';
  isJoystickActive = false;
   playerHP = 100;
  updateHPBar();

   // Reset yellow fill to 0
  const yellowFill = document.getElementById('yellowFill');
  yellowFill.style.width = '0';

  // Reset the score and any other game variables
  score = 0;
  updateScoreDisplay();



  // Restart the game loop
  isJoystickActive = true;
  isGameOver = false;
  gameLoop();
});

function createBlock() {
  const block = document.createElement('div');
  block.className = 'block';
  const blockSize = 30; // Adjust the block size
  block.style.width = `${blockSize}px`;
  block.style.height = `${blockSize}px`;
  block.style.backgroundImage = "url('https://raw.githubusercontent.com/Ben00000000/asstes/main/skillpotion.png')";
  block.style.backgroundSize = 'cover';
  block.style.position = 'absolute';
  block.style.left = `${Math.random() * (window.innerWidth - blockSize)}px`;
  block.style.top = `${Math.random() * (window.innerHeight - blockSize)}px`;
  document.body.appendChild(block);
}

function checkBlockCollisions() {
  const blocks = document.querySelectorAll('.block');

  blocks.forEach((block) => {
    if (isCollision(player, block, 10)) {
      removeBlock(block);
      increaseYellowFillWidth();
    }
  });
}

function increaseYellowFillWidth() {
  const yellowFill = document.getElementById('yellowFill');
  const yellowBar = document.getElementById('yellowBar');
  const skillButton1 = document.getElementById('skillButton1');
  const skillButton2 = document.getElementById('skillButton2');
  const skillButton3 = document.getElementById('skillButton3');

  // Get the computed style to ensure we get the actual width, even if set inline
  const computedStyles = window.getComputedStyle(yellowFill);
  let currentWidth = parseFloat(computedStyles.width) || 0;
  const newWidth = Math.min(currentWidth + 10, yellowBar.offsetWidth);

  yellowFill.style.width = `${newWidth}px`;

  // Check for specific yellow fill values and show/hide corresponding skill buttons
  if (newWidth >= 30) {
    skillButton1.style.display = 'block';
  } else {
    skillButton1.style.display = 'none';
  }

  if (newWidth >= 70) {
    skillButton2.style.display = 'block';
  } else {
    skillButton2.style.display = 'none';
  }

  if (newWidth >= 100) {
    skillButton3.style.display = 'block';
  } else {
    skillButton3.style.display = 'none';
  }
}

function isCollision(element1, element2, margin = 0) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  return (
    rect1.left + margin < rect2.right - margin &&
    rect1.right - margin > rect2.left + margin &&
    rect1.top + margin < rect2.bottom - margin &&
    rect1.bottom - margin > rect2.top + margin
  );
}

function removeBlock(block) {
  block.parentNode.removeChild(block);
}

document.getElementById('skillButton1').addEventListener('click', () => {
  if (!activeSkill) {
    activeSkill = 1;
    useSkill(1);
  }
});

document.getElementById('skillButton2').addEventListener('click', () => {
  if (!activeSkill) {
    activeSkill = 2;
    useSkill(2);
  }
});

document.getElementById('skillButton3').addEventListener('click', () => {
  if (!activeSkill) {
    activeSkill = 3;
    useSkill(3);
  }
});

function useSkill(skillNumber) {
  const skillFramesOverlay = document.getElementById('skillFramesOverlay');
  skillFramesOverlay.innerHTML = '';

  const framePrefix = `https://raw.githubusercontent.com/Ben00000000/asstes/main/hit${skillNumber}%20(`;

  for (let i = 1; i <= 10; i++) {
    const skillFrame = document.createElement('img');
    skillFrame.src = `${framePrefix}${i}).png`;
    skillFrame.className = 'skill-frame';
    skillFramesOverlay.appendChild(skillFrame);
  }

  skillFramesOverlay.style.display = 'block';
isSkillActive = true;

  let currentFrame = 0;
  const frameInterval = 100; // 100 milliseconds interval

  const intervalId = setInterval(() => {
    skillFramesOverlay.children[currentFrame].style.display = 'block';

    if (currentFrame > 0) {
      skillFramesOverlay.children[currentFrame - 1].style.display = 'none';
    }

    currentFrame++;

    if (currentFrame === 10) {
      clearInterval(intervalId);
      setTimeout(() => {
        skillFramesOverlay.style.display = 'none';
isSkillActive = false;
        updateSkillButtonVisibility();
        // Handle skill effects based on the skill number
        if (skillNumber === 1) {
          updateSkillButtonVisibility();
          decreaseYellowFill(30);
          removeEnemies(10);
          skillUsed1 = false;
        } else if (skillNumber === 2) {
          updateSkillButtonVisibility();
          decreaseYellowFill(70);
          removeEnemies(15);
          skillUsed2 = false;
        } else if (skillNumber === 3) {
          updateSkillButtonVisibility();
          decreaseYellowFill(100);
          removeAllEnemies();
          skillUsed3 = false;
        }

        activeSkill = null;
        updateSkillButtonVisibility();

      }, frameInterval);
    }
  }, frameInterval);
}

function updateSkillButtonVisibility() {
  const yellowFill = document.getElementById('yellowFill');
  const skillButton1 = document.getElementById('skillButton1');
  const skillButton2 = document.getElementById('skillButton2');
  const skillButton3 = document.getElementById('skillButton3');

  const currentWidth = parseFloat(yellowFill.style.width) || 0;

  // Check and hide relevant skill buttons based on yellow fill
  if (currentWidth < 30) {
    skillButton1.style.display = 'none';
  } else {
    skillButton1.style.display = 'block';
  }

  if (currentWidth < 70) {
    skillButton2.style.display = 'none';
  } else {
    skillButton2.style.display = 'block';
  }

  if (currentWidth < 100) {
    skillButton3.style.display = 'none';
  } else {
    skillButton3.style.display = 'block';
  }
}

function decreaseYellowFill(amount) {
  const yellowFill = document.getElementById('yellowFill');
  let currentWidth = parseFloat(yellowFill.style.width) || 0;
  const newWidth = Math.max(currentWidth - amount, 0);
  yellowFill.style.width = `${newWidth}px`;
}

function removeEnemies(count) {
  const enemies = document.querySelectorAll('.enemy');
  for (let i = 0; i < Math.min(count, enemies.length); i++) {
    const enemy = enemies[i];
    removeEnemy(enemy);
  }
}

function removeAllEnemies() {
  const enemies = document.querySelectorAll('.enemy');
  enemies.forEach((enemy) => {
    removeEnemy(enemy);
  });
}

function removeEnemy(enemy) {
  enemy.parentNode.removeChild(enemy);
  increaseScore();
}

function increaseScore() {
  score++;
  updateScoreDisplay();
}

function updateScoreDisplay() {
  const scoreDisplay = document.getElementById('scoreDisplay'); // Assuming you have an element with the id 'scoreDisplay' to show the score
  if (scoreDisplay) {
    scoreDisplay.textContent = `Score: ${score}`;
  }
}


updateSkillButtonVisibility();
// To test, call the gameLoop function
gameLoop();