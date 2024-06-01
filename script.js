// definining initial state of screen
let adjustedScreen = false;
document.querySelector(".screen").style.width = "360px";
const screenWidth = parseInt(document.querySelector(".screen").style.width);
document.querySelector(".screen").style.height = "720px";
const screenHeight = parseInt(document.querySelector(".screen").style.height);

let haveLanded = false;
let alive = true;
let gameIsOver = false;
let keys = { right: false, left: false, jump: false };
let score = 0;
let scoreNum = document.createElement("p");
scoreNum.classList.add("score");
document.querySelector(".screen").appendChild(scoreNum);

startGame();

//start game screen
function startGame() {
  //div to hold text & buttons
  let start = document.createElement("div");
  start.classList.add("start");
  start.innerHTML = "<h1>Start Game</h1>";
  document.querySelector("body").appendChild(start);
  //play button
  let play = document.createElement("button");
  play.classList.add("start-button");
  play.innerText = "Play";
  document.querySelector(".start").appendChild(play);
  document.querySelector(".start-button").addEventListener("click", pressPlay);
}

//creating platforms
let numOfPlat = 7;
let platformArr = [];
for (let i = 0; i < numOfPlat; i++) {
  const platform = document.createElement("div");
  document.querySelector(".platformcontainer").appendChild(platform);
  platform.classList.add("platform");
  platform.style.top =
    String((screenHeight / (numOfPlat + 1)) * (i + 1)) + "px";
  platform.style.left = String(Math.random() * (screenWidth - 120)) + "px";
  platformArr.push(platform);
}

//creating character
const character = document.querySelector(".character");
character.style.top = String(parseInt(platformArr[6].style.top) - 92) + "px";
character.style.left = String(parseInt(platformArr[6].style.left) + 14) + "px";
let charLeft = parseInt(character.style.left);
let charTop = parseInt(character.style.top);

// adjust screen & character down when the character jumps.
function adjustScreen() {
  if (alive === true) {
    haveLanded = false;
    adjustedScreen = true;
    console.log("screen adjusting");
    const drop = setInterval((gravity) => {
      if (
        charTop < (screenHeight / (numOfPlat + 1)) * 7 - 92 &&
        parseInt(platformArr[5].style.top) !==
          screenHeight - screenHeight / (numOfPlat + 1)
      ) {
        charTop += 1;
        character.style.top = String(charTop) + "px";
        for (let i = 0; i < numOfPlat; i++) {
          let platTop = parseInt(platformArr[i].style.top);
          platTop += 1;
          platformArr[i].style.top = String(platTop) + "px";
        }
      } else {
        clearInterval(drop);
        removePlat();
        addPlat();
        adjustedScreen = false;
        console.log("screen reset");
        landed();
        displayScore();
        character.classList.remove("isJumping");
        console.log("jumping removed");
      }
    });
  }
}

// //add platforms
function addPlat() {
  const platform = document.createElement("div");
  document.querySelector(".platformcontainer").prepend(platform);
  platform.classList.add("platform");
  platform.style.top = String(screenHeight / (numOfPlat + 1)) + "px";
  platform.style.left = String(Math.random() * (screenWidth - 120)) + "px";
  platformArr.splice(0, 0, platform);
  console.log("platform added");
}

//remove platforms
function removePlat() {
  platformArr.pop();
  let platform = document.querySelector(".platformcontainer");
  platform.removeChild(platform.lastElementChild);
  console.log("platform removed");
}

//check if character is dead
function landed() {
  if (
    parseInt(character.style.top) ===
    screenHeight - screenHeight / (numOfPlat + 1) - 92
  ) {
    if (
      parseInt(character.style.left) >
        parseInt(platformArr[6].style.left) - 92 &&
      parseInt(character.style.left) < parseInt(platformArr[6].style.left) + 120
    ) {
      console.log("oh im alive");
      haveLanded = true;
      console.log(haveLanded);
      // displayScore();
    } else {
      alive = false;
      if (gameIsOver === false) {
        gameOverMsg();
      }
      console.log(alive);
      haveLanded = false;
      console.log(haveLanded);
      console.log("dead");
      const die = setInterval(() => {
        charTop += 1;
        console.log(charTop);
        character.style.top = String(charTop) + "px";
        if (charTop > screenHeight) {
          // character.remove();
          character.style.display = "none";
          console.log("character cleared");
          clearInterval(die);
          console.log("interval cleared");
        }
      }, 1);
    }
  } else {
    return;
  }
}

//score
function displayScore() {
  // keys.right === false &&
  // keys.left === false &&
  // keys.jump === false &&
  if (haveLanded === true && character.classList.contains("isJumping")) {
    console.log("score display");
    score += 1;
    document.querySelector(".score").style.display = "block";
    scoreNum.innerText = String(score);
    setTimeout(stopScore, 300);
  }
}

function stopScore() {
  document.querySelector(".score").style.display = "none";
  console.log("stop");
}

//keyboard controls

function pressPlay() {
  document.querySelector("div.start").remove();
  // startGame = true;

  document.addEventListener("keydown", (event) => {
    console.log("Event keydown");
    switch (event.key) {
      case "ArrowRight":
        keys.right = true;
        break;
      case "ArrowLeft":
        keys.left = true;
        break;
      case " ":
        keys.jump = true;
        break;
    }
    console.log(keys);

    if (keys.right === true && keys.jump === true && keys.left === false) {
      console.log("jump right");
      moveRight();
      isJump();
    } else if (
      keys.right === false &&
      keys.jump === true &&
      keys.left === true
    ) {
      console.log("jump left");
      moveLeft();
      isJump();
    } else if (
      keys.right === false &&
      keys.jump === true &&
      keys.left === false
    ) {
      console.log("jump only");
      isJump();
    } else if (
      keys.right === false &&
      keys.jump === false &&
      keys.left === true
    ) {
      moveLeft();
    } else if (
      keys.right === true &&
      keys.jump === false &&
      keys.left === false
    ) {
      moveRight();
    }
  });
}

let startLeft;
let startRight;
let keyLeftCount = 0;
let keyRightCount = 0;

document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowRight":
      keys.right = false;
      clearInterval(startRight);
      keyRightCount = 0;
      break;
    case "ArrowLeft":
      keys.left = false;
      clearInterval(startLeft);
      keyLeftCount = 0;
      break;
    case " ":
      keys.jump = false;
      break;
  }
});

const moveLeft = () => {
  document.querySelector(".character").style.backgroundImage =
    "var(--doodle-left-image)";
  if (keyLeftCount > 0) {
    return;
  } else {
    startLeft = setInterval(() => {
      keyLeftCount += 1;
      charLeft -= 2;
      character.style.left = String(charLeft) + "px";
      if (adjustedScreen === false) {
        landed();
      }
    });
  }
};

const moveRight = () => {
  document.querySelector(".character").style.backgroundImage =
    "var(--doodle-right-image)";
  if (keyRightCount > 0) {
    return;
  } else {
    startRight = setInterval(() => {
      keyRightCount += 1;
      charLeft += 2;
      character.style.left = String(charLeft) + "px";
      // console.log("screen adjusted");
      if (adjustedScreen === false) {
        // console.log("screen not adjusted");
        landed();
      }
    });
  }
};

//jumps
function isJump() {
  if (character.classList.contains("isJumping") || alive === false) {
    return;
  } else {
    character.classList.add("isJumping");
    console.log("is jumping");
    charTop -= screenHeight / (numOfPlat + 1);
    character.style.top = String(charTop) + "px";
    adjustScreen();
    // setTimeout(() => character.classList.remove("isJumping"), 400);
    // console.log("jumping removed");
    // displayScore();
  }
}

// Game Over
function gameOverMsg() {
  gameIsOver = true;
  //div to hold text & buttons
  let gameover = document.createElement("div");
  gameover.classList.add("gameover");
  gameover.innerHTML = `<h1>Your Highscore <br> ${score}</h1>`;
  document.querySelector("body").appendChild(gameover);

  //div to hold buttons
  let gameoverButtons = document.createElement("div");
  gameoverButtons.classList.add("gameover-buttons");
  document.querySelector(".gameover").appendChild(gameoverButtons);

  //restart button
  let restart = document.createElement("button");
  restart.classList.add("restart");
  restart.innerText = "Play again";
  document.querySelector(".gameover-buttons").appendChild(restart);
  document.querySelector(".restart").addEventListener("click", replayGame);
}
//   //cancel button
//   let cancel = document.createElement("button");
//   cancel.classList.add("cancel");
//   cancel.innerText = "Cancel";
//   document.querySelector(".gameover-buttons").appendChild(cancel);
//   document.querySelector(".cancel").addEventListener("click", replayGame);

function replayGame() {
  location.reload();
}

// function playAgain() {
//   document.querySelector("div.gameover").remove();
//   character.style.display = "block";
//   character.style.top = String(parseInt(platformArr[6].style.top) - 92) + "px";
//   character.style.left =
//     String(parseInt(platformArr[6].style.left) + 14) + "px";
//   let charLeft = parseInt(character.style.left);
//   let charTop = parseInt(character.style.top);
//   alive = true;
//   gameIsOver = false;
//   pressPlay
// }
