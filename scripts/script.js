// Module for gameboard
const gameboard = (() => {
  let playerMoves = ["", "", "", "", "", "", "", "", ""];
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  function viewGameboard() {
    // console.log(playerMoves);
  }

  function resetPlayerMoves() {
    playerMoves = ["", "", "", "", "", "", "", "", ""];
  }

  function currentPlayerIndexes(playerName) {
    const result = playerMoves.map((element, index) => {
      if (element === playerName) {
        return index;
      }
      return -1;
    });
    return result;
  }

  function turnResult(player) {
    const playerIndexes = currentPlayerIndexes(player.getName());

    for (let i = 0; i < winConditions.length; i += 1) {
      const test = winConditions[i].every((val) => playerIndexes.includes(val));
      if (test) {
        // Win conditions met return winning squares
        return winConditions[i];
      }
    }
    if (playerMoves.includes("")) {
      return "NONE";
    }
    return "TIE";
  }

  function playerMove(player, position) {
    playerMoves[position] = player.getName();
    return turnResult(player);
  }

  function evalutate(board){
    const xPositions = currentPlayerIndexes("X");
    const oPositions = currentPlayerIndexes("O");

    for(let i=0; i<winConditions.length; i+=1){
      const xWin = winConditions[i].every((val) => xPositions.includes(val));
      const oWin = winConditions[i].every((val) => oPositions.includes(val));
      if(xWin){
        return 10;
      }
      if(oWin){
        return -10;
      }
    }
    return 0;
  }

  function getMove() {
    return evalutate(playerMoves);
  }

  return { resetPlayerMoves, playerMove, viewGameboard , getMove};
})();

// Factory for creating players
const playerFactory = (name) => {
  const getName = () => name;

  return { getName };
};

// Module for game
const game = (() => {
  const modal = document.querySelector(".modal");
  const resetGameBtn = document.getElementById("reset-game-btn");
  const backdrop = document.querySelector(".backdrop");
  const winnerDisplay = document.getElementById("winner-mark");
  const squares = [];
  const playerO = playerFactory("O");
  const playerX = playerFactory("X");
  let currentPlayer = playerX;

  for (let i = 0; i <= 8; i += 1) {
    squares.push(document.getElementById(`cell-${i}`));
  }

  function toggleTurn() {
    if (currentPlayer.getName() === "X") {
      currentPlayer = playerO;
    } else {
      currentPlayer = playerX;
    }
  }

  function openModal() {
    modal.classList.add("open");
    backdrop.classList.add("open");
  }

  function highlightWinner(winningSquares){
    winningSquares.forEach( (square) => {
      squares[square].classList.add("winner");
    });
  }

  function drawMark(square, mark){
    square.appendChild(mark);
  }

  function cellClicked() {
    // Create X or O and insert into cell
    const playerType = currentPlayer.getName();
    if (playerType === "X") {
      // console.log("Player X");
      const x = xMarker();
      drawMark(this, x.xContainer);
    } else {
      const o = oMarker();
      drawMark(this,o.oContainer);
    }
    const id = this.id.at(-1);
    const turnResult = gameboard.playerMove(currentPlayer, id);
    // console.log(turnResult);
    if (Array.isArray(turnResult)) {
      const playerMark = currentPlayer.getName() === "X" ? xMarker("winner").xContainer : oMarker("winner").oContainer;
      highlightWinner(turnResult);
      winnerDisplay.appendChild(playerMark);
      openModal();
    } else if (turnResult === "TIE") {
      winnerDisplay.textContent = "TIE"
      openModal();
    } else {
      toggleTurn();
    }
  }

  function resetCellListeners() {
    squares.forEach((cell) =>
      cell.addEventListener("click", cellClicked, { once: true })
    );
  }

  function resetGame() {
    gameboard.resetPlayerMoves();
    squares.forEach((element, index) => {
      squares[index].textContent = "";
    });
    resetCellListeners();
  }

  function closeModal() {
    backdrop.classList.remove("open");
    modal.classList.remove("open");
    winnerDisplay.textContent = "";
    squares.forEach(square => {
      square.classList.remove("winner");
    });
    resetGame();
  }

  backdrop.addEventListener("click", closeModal);
  resetGameBtn.addEventListener("click", closeModal);

  function startGame() {
    resetCellListeners();
  }

  return { startGame };
})();

game.startGame();
