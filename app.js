// Variables initialization
var scores, currentPlayer, roundScore, prevDice, gamePlaying;

var gameTime = {
  startTime: 0,
  finishTime: 0,
  start: function () {
    var currentTime = new Date();
    this.startTime = currentTime.toLocaleTimeString();
    return this.startTime;
  },
  finish: function () {
    var currentTime = new Date();
    this.finishTime = currentTime.toLocaleTimeString();
    return this.finishTime;
  },
};

var dom = {
  dice: ".dice",
  rollBtn: ".btn-roll",
  holdBtn: ".btn-hold",
  panel_0: ".player-0-panel",
  panel_1: ".player-1-panel",
  settingsBtn: ".btn-rules",
  settingsPanel: ".rules-panel",
  query: {}
};

// Fill the `query` object within a loop
for (key in dom) {
  if (key !== 'query') {
      dom.query[key] = document.querySelector(dom[key])
  }
}

// Start the new game
initNewGame();

dom.query.rollBtn.addEventListener("click", function () {
  if (gamePlaying) {
    dice = Math.floor(Math.random() * 6 + 1);
    dom.query.dice.src = "dice-" + dice + ".png";
    dom.query.dice.style.display = "block";

    if (dice === 1) {
      console.info(
        "Player " +
          (currentPlayer === 0 ? "1" : "2") +
          ' you got "one" on a dice. Your current score is nulled. Player ' +
          (currentPlayer === 0 ? "2" : "1") +
          ", now its your turn."
      );
      roundScore = 0;
      prevDice = 0;
      updateCurrentScoreUI();
      updateScoreUI();
      nextPlayer();
    } else if (prevDice === dice && dice === 6) {
      console.info(
        "Oops! Player " +
          (currentPlayer === 0 ? "1" : "2") +
          ' got "six" on two times in a row. Bad luck :) Your score is nulled.'
      );
      scores[currentPlayer] = 0;
      roundScore = 0;
      prevDice = 0;
      updateCurrentScoreUI();
      updateScoreUI();
      nextPlayer();
    } else {
      roundScore += dice;
      prevDice = dice;
    }

    updateCurrentScoreUI();
  }
});

dom.query.holdBtn.addEventListener("click", function () {
  if (gamePlaying) {
    scores[currentPlayer] += roundScore;
    updateScoreUI();

    if (scores[currentPlayer] >= 100) {
      document
        .querySelector(".player-" + currentPlayer + "-panel")
        .classList.add("winner");
      document.querySelector("#name-" + currentPlayer).textContent = "Winner";
      console.info(
        "%s: %c%s",
        gameTime.finish(),
        "color: #1bff00;",
        `The game is finished. Congrats Player ${
          currentPlayer === 0 ? "1" : "2"
        }`
      );
      gamePlaying = false;
    } else {
      roundScore = 0;
      updateCurrentScoreUI();
      nextPlayer();
    }
  }
});

function nextPlayer() {
  dom.query.panel_0.classList.toggle("active");
  dom.query.panel_1.classList.toggle("active");
  dom.query.dice.style.display = "none";

  currentPlayer = currentPlayer === 0 ? 1 : 0;
}

function updateScoreUI() {
  document.querySelector("#score-" + currentPlayer).textContent =
    scores[currentPlayer];
}

function updateCurrentScoreUI() {
  document.querySelector("#current-" + currentPlayer).textContent = roundScore;
}

function initNewGame() {
  console.info(
    "%s: %c%s",
    gameTime.start(),
    "color: #1bff00;",
    "New game has been started!"
  );

  gamePlaying = true;
  scores = [0, 0];
  currentPlayer = 0;
  roundScore = 0;
  prevDice = 0;

  document.querySelector(".dice").style.display = "none";

  document.querySelector("#score-0").textContent = "0";
  document.querySelector("#score-1").textContent = "0";
  document.querySelector("#current-0").textContent = "0";
  document.querySelector("#current-1").textContent = "0";
  document.querySelector("#name-0").textContent = "Player 1";
  document.querySelector("#name-1").textContent = "Player 2";
  dom.query.panel_0.classList.remove("winner");
  dom.query.panel_1.classList.remove("winner");
  dom.query.panel_0.classList.remove("active");
  dom.query.panel_1.classList.remove("active");
  dom.query.panel_0.classList.add("active");
}

// Start new game, if `NEW GAME` button is clicked.
document.querySelector(".btn-new").addEventListener("click", initNewGame);

// Rules Panel
dom.query.settingsBtn.addEventListener("click", function () {
  dom.query.settingsPanel.classList.add("active");
  hideOnClickOutside();
});

function hideOnClickOutside() {
  var outsideClickListener = function (e) {
    if (
      !(
        dom.query.settingsPanel.contains(e.target) ||
        dom.query.settingsBtn === e.target
      )
    ) {
      dom.query.settingsPanel.classList.remove("active");
      removeClickListener();
    }
  };

  var removeClickListener = function () {
    document.removeEventListener("click", outsideClickListener);
  };

  document.addEventListener("click", outsideClickListener);
}
