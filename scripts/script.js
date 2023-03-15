// Module for gameboard.
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
    // Create an array containing the indexes of current player's moves.
    const playerIndexes = currentPlayerIndexes(player.getName(), playerMoves);

    for (let i = 0; i < winConditions.length; i += 1) {
      // Check every val of each winCondition to see if player has satisfied a win condition yet.
      const test = winConditions[i].every((val) => playerIndexes.includes(val));
      if (test) {
        // Win conditions met return winning cells.
        return winConditions[i];
      }
    }
    // no win yet, check if moves are still left else result is a tie.
    if (playerMoves.includes("")) {
      return "NONE";
    }
    return "TIE";
  }

  function playerMove(player, position) {
    playerMoves[position] = player.getName();
    return turnResult(player);
  }

  function getMiniMaxVal(board, cell, lanes, player){
    // Use filter method to find all lanes that contain current cell.
    const cellLanes = lanes.filter((lane) => lane.includes(cell));
    let minVal = 0;
    let maxVal = 0;
    // Loop through each lane in our cellLanes array.
    for (let lane = 0; lane < cellLanes.length; lane += 1) {
      const boardLaneValues = board.filter((cell, index) => cellLanes[lane].includes(index));
      // Check lane for two current player marks (win scenario) break and return immediately.
      if ((boardLaneValues[0] === player.getName() && boardLaneValues[0] === boardLaneValues[1]) ||
          (boardLaneValues[1] === player.getName() && boardLaneValues[1] === boardLaneValues[2]) ||
          (boardLaneValues[0] === player.getName() && boardLaneValues[0] === boardLaneValues[2])) {
        maxVal = 10;
        break;
      }  
      // If lane does not contain opponent mark maxVal of cell increments by one.
      if(!boardLaneValues.includes(player.getOpponent()) && maxVal !== 10){
        maxVal += 1;
        // If lane also does not contain current players mark maxVal of cell increments by one.
        if(boardLaneValues.includes(player.getName())){
          maxVal += 1;
        }
      }
      // If lane does not contain current players mark, minVal of cell decrements by one.
      // Only enter if minVal has not already been set to -10 by a previous lane check on current cell.
      if(!boardLaneValues.includes(player.getName()) && minVal !== 10){
        minVal -= 1;
        // If lane also contains opponents mark, minVal of cell decrements by one.
        if(boardLaneValues.includes(player.getOpponent())){
          minVal -= 1;
        }
      }
      // Check lane for two opponent marks (lose scenario).
      if ((boardLaneValues[0] === player.getOpponent() && boardLaneValues[0] === boardLaneValues[1]) ||
          (boardLaneValues[1] === player.getOpponent() && boardLaneValues[1] === boardLaneValues[2]) ||
          (boardLaneValues[0] === player.getOpponent() && boardLaneValues[0] === boardLaneValues[2])) {
        minVal = -10;
      }  
    }
    return [minVal, maxVal, maxVal + Math.abs(minVal)];
  }

  function findLose(miniMaxVals){
    for(let i = 0; i < miniMaxVals.length; i+=1){
      const miniMaxVal = miniMaxVals[i];
      // Ensure value is a min/max array instead of player mark (invalid move).
      if(Array.isArray(miniMaxVal)){
        // Win condition accounted for already, check index for lose scenario.
        if(miniMaxVal[0] === -10 ){
          return i;
        }
      }
    }
    return -1;
  }

  function findBestMove(miniMaxVals){
      let max = -50;
      let move = -1;
      for (let i = 0; i < miniMaxVals.length; i+=1) {
        const {2: moveVal} = miniMaxVals[i];
        // Check if potential move is valid and greater than current move value.
        if (typeof moveVal === 'number' && moveVal > max) {
            move = i;
            max = moveVal;
        }
      }
      return move;
  }

  function miniMax(board, lanes, player) {
    const miniMaxVals = []

    // Loop each board cell to determine min/max value of empty cells.
    for (let cell = 0; cell < board.length; cell += 1) {
      if (board[cell] === "") {
        // Check edge case lose scenario for player.
        if(cell === 1){
          if(board[0] === player.getOpponent() && board[8] === player.getOpponent() ||
             board[2] === player.getOpponent() && board[6] === player.getOpponent()){
            return 1;
          }
        }
        // Set miniMaxVal to array containing [minVal,MaxVal, abs(minVal) + maxVal (move payoff)] values.
        const miniMaxVal = getMiniMaxVal(board, cell, lanes, player);
        // Check if maxVal is 10 (winning move).
        if(miniMaxVal[1] === 10){
          return miniMaxVals.length;
        }
        miniMaxVals.push(miniMaxVal);
      }
      // Cell contains a player move, instead push player's mark to array to keep proper length/indexes.
      else{
        miniMaxVals.push(board[cell]);
      }
    }
    // If a lose scenario exists on board assign to move, else assign -1.
    let move = findLose(miniMaxVals);
    
    // If no lose scenario found, choose move according to highest payoff.
    if(move === -1){
      move = findBestMove(miniMaxVals);
    }
    return move;
  }

  function getMove(player) {
    return miniMax(playerMoves, winConditions, player);
  }

  return { resetPlayerMoves, playerMove, viewGameboard, getMove };
})();

// Factory for creating players.
const playerFactory = (name) => {
  const getName = () => name;
  const getOpponent = () => (name === "X" ? "O" : "X");

  return { getName, getOpponent };
};

// Module for game.
const game = (() => {
  const modal = document.querySelector(".modal");
  const resetGameBtn = document.getElementById("reset-game-btn");
  const backdrop = document.querySelector(".backdrop");
  const winnerDisplay = document.getElementById("winner-mark");
  const cells = [];
  const playerO = playerFactory("O");
  const playerX = playerFactory("X");
  let currentPlayer = playerX;
  let gameOver = false;

  // Bind dom cells to cells array.
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

  function openModal() {
    modal.classList.add("open");
    backdrop.classList.add("open");
  }

  function highlightLane(winningCells) {
    winningCells.forEach((cell) => {
      cells[cell].classList.add("winner");
    });
  }

  function drawMark(square, mark) {
    square.appendChild(mark);
  }

  function cellClicked() {
    // Create X or O and insert into DOM cell.
    const playerType = currentPlayer.getName();
    if (playerType === "X") {
      const x = xMarker();
      drawMark(this, x.xContainer);
    } else {
      const o = oMarker();
      drawMark(this, o.oContainer);
    }

    // Grab the id by pulling last character of id attribute of DOM cell.
    const id = this.id.at(-1);
    const turnResult = gameboard.playerMove(currentPlayer, id);
    // If turnResult is an array, game has been won with lane contained in turnResult.
    if (Array.isArray(turnResult)) {
      let playerMark;
      if(currentPlayer.getName() === "X"){
        playerMark = xMarker("winner").xContainer;
      }
      else{
        playerMark = oMarker("winner").oContainer;
      }
      // Highlight winning lane and display winner on screen.
      highlightLane(turnResult);
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
    // Human player has made move, time for ai to make a move if game is not over.
    if(currentPlayer === playerO && gameOver === false){
      const aiMove = gameboard.getMove(playerO);
      cells[aiMove].click();
    }
  }

  function resetCellListeners() {
    cells.forEach((cell) =>
      cell.addEventListener("click", cellClicked, { once: true })
    );
  }

  function resetGame() {
    gameboard.resetPlayerMoves();
    cells.forEach((element, index) => {
      cells[index].textContent = "";
    });
    resetCellListeners();
    gameOver = false;
    currentPlayer = playerX;
  }

  function closeModal() {
    backdrop.classList.remove("open");
    modal.classList.remove("open");
    winnerDisplay.textContent = "";
    cells.forEach((square) => {
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
