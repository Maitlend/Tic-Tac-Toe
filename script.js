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

const gameboard = (() => {
  const playerMoves = ["", "", "", "", "", "", "", "", ""];

  function viewGameboard() {
    // console.log(playerMoves);
  }

  function resetPlayerMoves() {
    playerMoves.forEach((element, index) => {
      playerMoves[index] = "";
    });
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

const playerFactory = (name) => {
  const getName = () => name;

  function makeMove(position) {
    gameboard.playerMove(name, position);
  }

  return { getName, makeMove };
};

const game = (() => {
  const cells = [
    document.getElementById("cell-0"),
    document.getElementById("cell-1"),
    document.getElementById("cell-2"),
    document.getElementById("cell-3"),
    document.getElementById("cell-4"),
    document.getElementById("cell-5"),
    document.getElementById("cell-6"),
    document.getElementById("cell-7"),
    document.getElementById("cell-8"),
  ];

  const playerO = playerFactory("O");
  const playerX = playerFactory("X");

  let currentPlayer = playerX;

  function toggleTurn() {
    if (currentPlayer.getName() === "X") {
      currentPlayer = playerO;
    } else {
      currentPlayer = playerX;
    }
  }

  function cellClicked() {
    // console.log(this);
    this.textContent = currentPlayer.getName();
    this.removeEventListener("click", cellClicked);
    const { id } = this;
    const gameWon = gameboard.playerMove(currentPlayer, id.at(-1));
    gameboard.viewGameboard();
    if (gameWon) {
      alert(`Congrats player ${currentPlayer.getName()}, you win!`);
      resetGame();
    } else {
      toggleTurn();
    }
  }

  function resetCellListeners(){
    cells[0].addEventListener("click", cellClicked);
    cells[1].addEventListener("click", cellClicked);
    cells[2].addEventListener("click", cellClicked);
    cells[3].addEventListener("click", cellClicked);
    cells[4].addEventListener("click", cellClicked);
    cells[5].addEventListener("click", cellClicked);
    cells[6].addEventListener("click", cellClicked);
    cells[7].addEventListener("click", cellClicked);
    cells[8].addEventListener("click", cellClicked);
  }

  function resetGame() {
    gameboard.resetPlayerMoves();
    cells.forEach((element, index) => {
      cells[index].textContent = '';
    });
    resetCellListeners();
  }

  cells[0].addEventListener("click", cellClicked);
  cells[1].addEventListener("click", cellClicked);
  cells[2].addEventListener("click", cellClicked);
  cells[3].addEventListener("click", cellClicked);
  cells[4].addEventListener("click", cellClicked);
  cells[5].addEventListener("click", cellClicked);
  cells[6].addEventListener("click", cellClicked);
  cells[7].addEventListener("click", cellClicked);
  cells[8].addEventListener("click", cellClicked);

  return { resetGame, cellClicked };
})();
