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

  function miniMax(board, lanes, player) {
    const miniMaxVals = []
    // Loop each cell to determine min/max value of empty cells
    for (let cell = 0; cell < board.length; cell += 1) {
      if (board[cell] === "") {
        console.log(`Found empty cell ${cell}`);
        // const miniMaxVal = [];
        const cellLanes = lanes.filter((lane) => lane.includes(cell));
        let minVal = 0;
        let maxVal = 0;
        // Loop through each cell lane
        for (let cellLane = 0; cellLane < cellLanes.length; cellLane += 1) {
          const boardLaneValues = board.filter((cell, index) => cellLanes[cellLane].includes(index));
          console.log(`Adjusting min/max of cell ${cell} for lane ${cellLanes[cellLane]}`);
          console.log(`Board values for lane ${cellLanes[cellLane]} = ${boardLaneValues}`);

          if ((boardLaneValues[0] === player.getName() && boardLaneValues[0] === boardLaneValues[1]) ||
              (boardLaneValues[1] === player.getName() && boardLaneValues[1] === boardLaneValues[2]) ||
              (boardLaneValues[0] === player.getName() && boardLaneValues[0] === boardLaneValues[2])) {
            console.log(`Lane ${cellLanes[cellLane]} contains two own marks ${player.getName()}, maxVal = 10 as this will win game.`);
            minVal = 10;
          }  
          if(!boardLaneValues.includes(player.getOpponent()) && maxVal !== 10){
            console.log(`Lane ${cellLanes[cellLane]} does not contain an ${player.getOpponent()}, incrementing maxVal by 1`);
            maxVal += 1;
            if(boardLaneValues.includes(player.getName())){
              console.log(`Lane ${cellLanes[cellLane]} also contains own mark ${player.getName()}, incrementing maxVal by 1`);
              maxVal += 1;
            }
          }
          if(!boardLaneValues.includes(player.getName()) && minVal !== 10){
            console.log(`Lane ${cellLanes[cellLane]} does not contain own mark ${player.getName()}, decrementing minVal by 1`);
            minVal -= 1;
            if(boardLaneValues.includes(player.getOpponent())){
              console.log(`Lane ${cellLanes[cellLane]} also contains opponent mark ${player.getOpponent()}, decrementing minVal by 1`);
              minVal -= 1;
            }
          }
          if ((boardLaneValues[0] === player.getOpponent() && boardLaneValues[0] === boardLaneValues[1]) ||
              (boardLaneValues[1] === player.getOpponent() && boardLaneValues[1] === boardLaneValues[2]) ||
              (boardLaneValues[0] === player.getOpponent() && boardLaneValues[0] === boardLaneValues[2])) {
            console.log(`Lane ${cellLanes[cellLane]} contains two opponent marks ${player.getOpponent()}, minVal = 10 as this will lose game.`);
            minVal = -10;
          }  
        }
        const miniMaxVal = [minVal,maxVal];
        miniMaxVals.push(miniMaxVal);
      }
      else{
        miniMaxVals.push(board[cell]);
      }
    }
    console.log(miniMaxVals);

    let move = -1;
    for(let i = 0; i < miniMaxVals.length; i+=1){
      const miniMaxVal = miniMaxVals[i];
      if(Array.isArray(miniMaxVal)){
        if(miniMaxVal[1] === 10){
          move = i;
          break;
        }
        else if(miniMaxVal[0] === -10 ){
          move = i;
        }
        else{
          miniMaxVals[i] = Math.abs(miniMaxVal[0]) + miniMaxVal[1];
        }
      }
    }
  
    if(move === -1){
      let max = -50;
      for (let i = 0; i < miniMaxVals.length; i+=1) {
        if (typeof miniMaxVals[i] === 'number' && miniMaxVals[i] > max) {
            move = i;
            max = miniMaxVals[i];
        }
      }
    }
    console.log(move);
    return move;
  }

  function getMove(player) {
    return miniMax(playerMoves, winConditions, player);
  }

  return { resetPlayerMoves, playerMove, viewGameboard, getMove };
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
      toggleTurn();
    }
    if(currentPlayer === playerO && gameOver === false){
      const aiMove = gameboard.getMove(playerO);
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

// const playerO = playerFactory("O");
// const playerX = playerFactory("X");

// gameboard.getMove(["","X","O","","X","O","","",""], playerX);
// gameboard.getMove(["","","O","","X","","","","O"], playerX);