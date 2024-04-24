document.addEventListener("DOMContentLoaded", function () {
  let containerDiv = document.createElement("div");
  containerDiv.className = "container";

  let wrapperHangmanDiv = document.createElement("div");
  wrapperHangmanDiv.className = "hangman";

  let imgGallows = document.createElement("img");
  imgGallows.src = "./img/gallows.svg";
  imgGallows.alt = "hangman-img";
  imgGallows.className = "hangman__img";

  let nameGame = document.createElement("h1");
  nameGame.className = "title";
  nameGame.innerHTML = "hangman";

  let gameDiv = document.createElement("div");
  gameDiv.className = "hangman-game";

  let wordGame = document.createElement("ul");
  wordGame.className = "hangman-word text";

  let hintDiv = document.createElement("div");
  hintDiv.className = "hangman-hint";

  let hintText = document.createElement("h2");
  hintText.innerHTML = "Hint: ";
  hintText.className = "hangman-hint__text text";

  let guessText = document.createElement("h2");
  guessText.innerHTML = "Incorrect quesses: ";
  guessText.className = "hangman-guesses__text text";

  let guessTextSpan = document.createElement("span");
  guessTextSpan.innerHTML = " 0 / 6";

  let guessDiv = document.createElement("div");
  guessDiv.className = "hangman-guesses";

  let keyboardDiv = document.createElement("div");
  keyboardDiv.className = "hangman-keyboard";

  let modalWindowDiv = document.createElement("div");
  modalWindowDiv.className = "modal-window";
  let modalContainerDiv = document.createElement("div");
  modalContainerDiv.className = "modal-window__data";
  let modalText = document.createElement("h2");
  modalText.className = "modal-window__text text";
  let modalAnswer = document.createElement("h3");
  modalAnswer.className = "modal-window_answer text";
  let modalBtn = document.createElement("button");
  modalBtn.className = "modal-window__play";
  modalBtn.innerText = "Play again";

  modalWindowDiv.append(modalContainerDiv);
  modalContainerDiv.append(modalText);
  modalContainerDiv.append(modalAnswer);
  modalContainerDiv.append(modalBtn);

  modalBtn.addEventListener("click", () => {
    start();
    errorCount = 0;
    guessTextSpan.innerHTML = `${errorCount} / ${maxAttempt}`;
    correctWord = [];
    imgGallows.src = `./img/gallows.svg`;

    const buttons = document.getElementsByClassName("btn");
    for (let button of buttons) {
      button.disabled = false;
    }

    setTimeout(() => {
      modalWindowDiv.classList.remove("modal-window_disabled");
    }, 500);
  });

  document.body.append(modalWindowDiv);

  // generate keyboard
  for (let i = 65; i <= 90; i++) {
    let alphaBut = document.createElement("button");
    alphaBut.className = "btn";
    alphaBut.innerHTML = String.fromCharCode(i);
    keyboardDiv.appendChild(alphaBut);
    alphaBut.addEventListener("click", (e) =>
      btnClick(e.target, String.fromCharCode(i)),
    );
  }

  let errorCount = 0;
  let correctWord = [];
  let maxAttempt = 6;

  const overGame = (arg) => {
    if (arg) {
      modalWindowDiv.classList.add("modal-window_disabled");
      modalText.innerText = "Congrats!";
      modalAnswer.innerText = `Answer was: ${currentWord}`;
    } else {
      modalWindowDiv.classList.add("modal-window_disabled");
      modalText.innerText = "Failed";
      modalAnswer.innerText = `Answer was: ${currentWord}`;
    }

    document.removeEventListener("keydown", keyaboardHandler);
  };

  const btnClick = (button, activeLetter) => {
    button.disabled = true;

    if (currentWord.includes(activeLetter)) {
      const tmpCurrentWord = currentWord.split("");
      tmpCurrentWord.forEach((letter, index) => {
        if (activeLetter === letter) {
          correctWord[index] = letter;
          wordGame.querySelectorAll("li")[index].innerText = letter;
          wordGame.querySelectorAll("li")[index].classList.add("letter_open");
        }
      });
    } else {
      errorCount++;
      imgGallows.src = `./img/gallows-${errorCount}.svg`;
    }
    guessTextSpan.innerHTML = `${errorCount} / ${maxAttempt}`;

    if (correctWord.join("") === currentWord) return overGame(true);
    if (errorCount === maxAttempt) return overGame(false);
  };
  containerDiv.append(nameGame);
  containerDiv.append(wrapperHangmanDiv);
  wrapperHangmanDiv.append(imgGallows);
  wrapperHangmanDiv.append(gameDiv);
  gameDiv.append(hintDiv);
  hintDiv.append(hintText);
  gameDiv.append(guessDiv);
  guessDiv.append(guessText);
  guessText.append(guessTextSpan);
  gameDiv.append(keyboardDiv);

  // get random hint+word
  const filePath = "./wordList.json";
  let currentWord;

  let hintTextSpan = document.createElement("span");

  async function getRandomHintWordPair() {
    try {
      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      const randomIndex = Math.floor(Math.random() * jsonData.length);
      const randomPair = jsonData[randomIndex];

      currentWord = randomPair.word.toUpperCase();

      if (randomPair.hint) {
        hintTextSpan.innerText = randomPair.hint;
        hintText.append(hintTextSpan);
      }
      wordGame.innerHTML = currentWord
        .split("")
        .map(() => '<li class="letter"></li>')
        .join("");
      gameDiv.prepend(wordGame);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  const keyaboardHandler = (event) => {
    if (
      (event.key >= "a" && event.key <= "z") ||
      (event.key >= "A" && event.key <= "Z")
    ) {
      const letter = event.key.toLocaleUpperCase();
      const buttons = document.getElementsByClassName("btn");
      for (let button of buttons) {
        if (button.innerHTML === letter) {
          return button.click();
        }
      }
    } else {
      alert("Acceptable symbols are only latin letters!");
    }
  }

  // Wait until the question and anwser is ready
  function start() {
    getRandomHintWordPair().then(() => {
      document.body.append(containerDiv);
    });

    document.addEventListener("keydown", keyaboardHandler);
  }

  start();
});
