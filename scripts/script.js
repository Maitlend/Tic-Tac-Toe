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

  // function printGameboard(board, color) {
  //   console.log("******** Printing Board ********");
  //   for(let i = 0; i<9 ; i+=3){
  //     let mark = board[i] !== "" ? board[i] : " ";
  //     let mark2 = board[i] !== "" ? board[i+1] : " ";
  //     let mark3 = board[i] !== "" ? board[i+2] : " ";
  //     console.log(`%c          ${mark} | ${mark2} | ${mark3} `, `color: ${color}`);
  //   }
  //   console.log("*******************************");
  // }

  function resetPlayerMoves() {
    playerMoves = ["", "", "", "", "", "", "", "", ""];
  }

  function currentPlayerIndexes(playerName, board) {
    const result = board.map((element, index) => {
      if (element === playerName) {
        return index;
      }
      return -1;
    });
    return result;
  }

  function turnResult(player) {
    const playerIndexes = currentPlayerIndexes(player.getName(), playerMoves);

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

  return { resetPlayerMoves, playerMove, viewGameboard };
})();

// Factory for creating players
const playerFactory = (name) => {
  const getName = () => name;
  const getOpponent = () => (name === "X" ? "O" : "X");

  return { getName, getOpponent };
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
  let gameOver = false;

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

  function highlightWinner(winningSquares) {
    winningSquares.forEach((square) => {
      squares[square].classList.add("winner");
    });
  }

  function drawMark(square, mark) {
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
      drawMark(this, o.oContainer);
      // console.log(gameboard.getMove(null, playerX));
    }
    const id = this.id.at(-1);
    const turnResult = gameboard.playerMove(currentPlayer, id);
    // console.log(turnResult);
    if (Array.isArray(turnResult)) {
      const playerMark =
        currentPlayer.getName() === "X"
          ? xMarker("winner").xContainer
          : oMarker("winner").oContainer;
      highlightWinner(turnResult);
      winnerDisplay.appendChild(playerMark);
      openModal();
      gameOver = true;
    } else if (turnResult === "TIE") {
      winnerDisplay.textContent = "TIE";
      openModal();
      gameOver = true;
    } else {
      console.log(`Best move for player ${playerO.getName()}: `, gameboard.getMove(null, playerX));
      toggleTurn();
    }
    if(currentPlayer === playerO && gameOver === false){
      const aiMove = gameboard.getMove(null, playerO);
      console.log(`AI Move: ${aiMove}`);
      squares[aiMove].click();
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
    gameOver = false;
    currentPlayer = playerX;
  }

  function closeModal() {
    backdrop.classList.remove("open");
    modal.classList.remove("open");
    winnerDisplay.textContent = "";
    squares.forEach((square) => {
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
