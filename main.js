let words = ["any", "word", "will", "do", "launch", "legal", "peripheral", "wood", "forest", "trees"];
words.push("kitten", "trash", "couch", "carpet", "laundry", "economy", "twist", "style", "skate");
words.push("alabaster", "baboon", "cowtail", "definite", "every", "foolish", "groundhog", "hectic", "interesting");
words.push("jewel", "kangaroo", "lament", "monster", "nocturnal", "offering", "position", "quest", "reptile");
words.push("staff", "transistor", "universal", "verse", "wicker", "zealous");
let word;
const GAME = document.getElementById("game");
let gallows;
let characters;
let gameDisplay;
let board;
let keyInput;
let guessBox;
let guesses = [];
let wrongGuesses = [];
let bodyParts;

let randomWord = () => {
  let randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};

let wordIntoBlanks = () => {
  gameDisplay =  [];
  word = word.toLowerCase();
  characters = word.split("");
  characters.forEach(char => {
    gameDisplay.push("_");
  });
  return gameDisplay.join(" ");
};

let blanksToPage = () => {
  let blanks = wordIntoBlanks();
  board = document.createElement("div");
  board.classList.add("board");
  board.innerHTML = blanks;
  GAME.appendChild(board);
};

let createGuessBox = () => {
  guessBox = document.createElement("div");
  guessBox.classList.add("guessBox");
  gallows.appendChild(guessBox);
};

let createMan = () => {
  let man = document.createElement("div");
  man.classList.add("man");

  let head = document.createElement("div");
  head.classList.add("head");
  man.appendChild(head);

  let torso = document.createElement("div");
  torso.classList.add("torso");
  man.appendChild(torso);

  let leftLeg = document.createElement("div");
  leftLeg.classList.add("leftLeg");
  man.appendChild(leftLeg);

  let rightLeg = document.createElement("div");
  rightLeg.classList.add("rightLeg");
  man.appendChild(rightLeg);

  let leftArm = document.createElement("div");
  leftArm.classList.add("leftArm");
  man.appendChild(leftArm);

  let rightArm = document.createElement("div");
  rightArm.classList.add("rightArm");
  man.appendChild(rightArm);

  gallows.appendChild(man);
};

let createGallows = () => {
  gallows = document.createElement("div");
  gallows.classList.add("gallows");

  let platform = document.createElement("div");
  platform.classList.add("platform");
  gallows.appendChild(platform);

  let post = document.createElement("div");
  post.classList.add("post");
  gallows.appendChild(post);

  let boom = document.createElement("div");
  boom.classList.add("boom");
  gallows.appendChild(boom);

  let dropper = document.createElement("div");
  dropper.classList.add("dropper");
  gallows.appendChild(dropper);

  let noose = document.createElement("div");
  noose.classList.add("noose");
  gallows.appendChild(noose);

  createMan();
  createGuessBox();

  GAME.appendChild(gallows);
};

let createDialog = () => {
  let dialog = document.createElement("div");
  dialog.classList.add("dialog");
  dialog.setAttribute("id", "dialog");
  GAME.appendChild(dialog);
};

let setDialog = (string) => {
  document.getElementById("dialog").innerHTML = string;
};

let turnManRed = () => {
  for (i = 0; i < bodyParts.length; i++) {
    bodyParts[i].style.setProperty("background-color", "red");
  }
};

let revealWord = () => {
  board.innerHTML = characters.join(" ");
};

let reinitialize = () => {
  word = "";
  gallows = [];
  characters = [];
  gameDisplay = [];
  board = "";
  keyInput = "";
  guessBox = "";
  guesses = [];
  wrongGuesses = [];
  bodyParts = [];
};

let newGame = () => {
  let gameParts = GAME.children;
  let count = gameParts.length;
  for (i = 0; i < count; i++) {
    GAME.removeChild(gameParts[0]);
  }
  reinitialize();
  createGame();
};

let spaceToPlay = () => {
  if (event.keyCode == 32) {
    newGame();
    window.removeEventListener("keydown", spaceToPlay);
  }
};

let gameOver = () => {
  //set dialog for invitation to play again
  setDialog("Press spacebar to play again!");
  //guessBox to read GAME OVER
  guessBox.innerHTML = "GAME OVER";
  //reveal the word
  revealWord();
  //remove the event listener for keys
  window.removeEventListener("keydown", gameListener);
  //add event listener to play again
  window.addEventListener("keydown", spaceToPlay);
  //turn the man red
  turnManRed();
};

let showBody = () => {
  if (wrongGuesses.length < 7) {
    let bodyPart = bodyParts[wrongGuesses.length - 1];
    bodyPart.style.setProperty("visibility", "visible");
  }
  else if (wrongGuesses.length == 7) {
    setDialog("Only one guess left!");
    for (i = 0; i < bodyParts.length; i++) {
      bodyParts[i].style.setProperty("background-color", "yellow");
    }
  }
  else if (wrongGuesses.length == 8) {
    gameOver();
  }
};

let guessWrong = () => {
  //make sure it's a letter
  if (event.keyCode >= 65 && event.keyCode <= 90) {
  //make sure it hasn't been guessed
    if (!wrongGuesses.includes(keyInput)) {
      wrongGuesses.push(keyInput);
      //add it to guess box
      guessBox.innerHTML = wrongGuesses.join("  ");
      //show part of body
      showBody();
    }
  }
};

let gameWon = () => {
  guessBox.innerHTML = "YOU WIN!";
  setDialog("Press spacebar to play again!");
  //remove the event listener for keys
  window.removeEventListener("keydown", gameListener);
  //add event listener to play again
  window.addEventListener("keydown", spaceToPlay);
};

let checkIfWon = () => {
  if (!gameDisplay.includes("_")) {
    gameWon();
  }
};

let guess = () => {
  if (characters.includes(keyInput)) {
    revealCharacters();
    checkIfWon();
  }
  else {
    guessWrong();
  }
  //add it to an array of guessed letters
  guesses.push(keyInput);
};

let revealCharacters = () => {
  for (i = 0; i < gameDisplay.length; i++) {
    if (keyInput == characters[i]) {
      gameDisplay[i] = characters[i];
    }
  }
  board.innerHTML = gameDisplay.join(" ");
};

let updateGameStatus = () => {
  if (guesses.length == 1) {
    setDialog("");
  }
};

let createGame = () => {
  //generate a random word
  word = randomWord();
  //make and display the classic hangman gallows
  createGallows();
  //make _ _ _s for each letter of the word
  //display the _ _ _s
  blanksToPage();
  //create dialog box
  createDialog();
  //set dialog to instructions
  setDialog("press any letter to guess!");
  bodyParts = document.getElementsByClassName("man")[0].children;
  window.addEventListener("keydown", gameListener);
};

let gameListener = () => {
  keyInput = event.key.toLowerCase();
  //check input against word and act on it
  guess();
  updateGameStatus();
};

createGame();
