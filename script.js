// Module for gameboard
const gameboard = (() => {
  let playerMoves = ["", "", "", "", "", "", "", "", ""];
  const winConditions = [
    ["0", "1", "2", "", "", "", "", "", ""],
    ["", "", "", "3", "4", "5", "", "", ""],
    ["", "", "", "", "", "", "6", "7", "8"],
    ["0", "", "", "", "4", "", "", "", "8"],
    ["", "", "2", "", "4", "", "6", "", ""],
    ["0", "", "", "3", "", "", "6", "", ""],
    ["", "1", "", "", "4", "", "", "7", ""],
    ["", "", "2", "", "", "5", "", "", "8"],
  ];

  function viewGameboard() {
    // console.log(playerMoves);
  }

  function resetPlayerMoves() {
    playerMoves = ["", "", "", "", "", "", "", "", ""];
  }

  function currentPlayerIndexes(player) {
    const result = playerMoves.map((element, index) => {
      if (element === player.getName()) {
        return `${index}`;
      }
      return "";
    });
    return result;
  }

  function checkWinConditions(player) {
    const playerIndexes = currentPlayerIndexes(player);

    for (let i = 0; i < winConditions.length; i += 1) {
      const test = winConditions[i].every((val) => playerIndexes.includes(val));
      if (test) {
        return true;
      }
    }
    return false;
  }

  function playerMove(player, position) {
    playerMoves[position] = player.getName();
    return checkWinConditions(player);
  }

  return { resetPlayerMoves, playerMove, viewGameboard };
})();

// Factory for creating players
const playerFactory = (name) => {
  const getName = () => name;

  return { getName };
};

// Module for game
const game = (() => {
  const cells = [];
  const playerO = playerFactory("O");
  const playerX = playerFactory("X");
  let currentPlayer = playerX;

  for (let i = 0; i <= 8; i += 1) {
    cells.push(document.getElementById(`cell-${i}`));
  }

  function toggleTurn() {
    if (currentPlayer.getName() === "X") {
      currentPlayer = playerO;
    } else {
      currentPlayer = playerX;
    }
  }

  function cellClicked() {
    this.textContent = currentPlayer.getName();
    const { id } = this;
    const gameWon = gameboard.playerMove(currentPlayer, id.at(-1));
    if (gameWon) {
      alert(`Congrats player ${currentPlayer.getName()}, you win!`);
      resetGame();
    } else {
      toggleTurn();
    }
  }

  function resetCellListeners() {
    cells.forEach((cell) => cell.addEventListener("click", cellClicked, {once : true}));
  }

  function resetGame() {
    gameboard.resetPlayerMoves();
    cells.forEach((element, index) => {
      cells[index].textContent = "";
    });
    resetCellListeners();
  }

  function startGame() {
    resetCellListeners();
  }

  return { startGame };
})();

game.startGame();
