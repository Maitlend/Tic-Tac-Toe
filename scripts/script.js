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

  function getGameboard() {
    return playerMoves;
  }

  function getWinConditions(){
    return winConditions;
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

  return { resetPlayerMoves, playerMove, getGameboard, getWinConditions};
})();

// Factory for creating players.
const playerFactory = (name) => {
  const getName = () => name;
  const getOpponent = () => (name === "X" ? "O" : "X");

  return { getName, getOpponent };
};

// Factory for miniMax vals
const miniMax = (cell) => {
  const index = cell;
  let minVal = 0;
  let maxVal = 0;
  let cellVal = 0;

  const getIndex = () => index;
  const getMinVal = () => minVal;
  const getMaxVal = () => maxVal;
  const getCellVal = () => cellVal;

  function updateCellVal(){
    cellVal = Math.abs(minVal) + maxVal;
  }
  function decMin(){
    minVal -= 1;
    updateCellVal()
  }
  function incMax(){
    maxVal += 1;
    updateCellVal()
  }
  function losingCell(){
    minVal = -10;
  }
  function winningCell(){
    maxVal = 10;
  }  

  return {getIndex, getMinVal, getMaxVal, getCellVal, decMin, incMax, losingCell, winningCell};
}

// Factory for creating ai players.
const aiPlayer = (name) => {
  const getName = () => name;
  const getOpponent = () => (name === "X" ? "O" : "X");
  let aiDifficulty;

  function setDifficulty(difficulty) {
    aiDifficulty = difficulty;
  };

  function getMiniMaxVal(board, cell, lanes){
    // Use filter method to find all lanes that intersect current cell.
    const cellLanes = lanes.filter((lane) => lane.includes(cell));
    let minVal = 0;
    let maxVal = 0;
    // Loop through each lane in our cellLanes array.
    for (let lane = 0; lane < cellLanes.length; lane += 1) {
      const boardLaneValues = board.filter((cell, index) => cellLanes[lane].includes(index));
      // Check lane for two current player marks (win scenario).
      if ((boardLaneValues[0] === this.getName() && boardLaneValues[0] === boardLaneValues[1]) ||
          (boardLaneValues[1] === this.getName() && boardLaneValues[1] === boardLaneValues[2]) ||
          (boardLaneValues[0] === this.getName() && boardLaneValues[0] === boardLaneValues[2])) {
        maxVal = 10;
        // break;
      }  
      // If lane does not contain opponent mark maxVal of cell increments by one.
      if(!boardLaneValues.includes(this.getOpponent()) && maxVal !== 10){
        maxVal += 1;
        // If lane also does not contain current players mark maxVal of cell increments by one.
        if(boardLaneValues.includes(this.getName())){
          maxVal += 1;
        }
      }
      // Check lane for two opponent marks (lose scenario).
      if ((boardLaneValues[0] === this.getOpponent() && boardLaneValues[0] === boardLaneValues[1]) ||
          (boardLaneValues[1] === this.getOpponent() && boardLaneValues[1] === boardLaneValues[2]) ||
          (boardLaneValues[0] === this.getOpponent() && boardLaneValues[0] === boardLaneValues[2])) {
        minVal = -10;
      }        
      // If lane does not contain current players mark, minVal of cell decrements by one.
      // Only enter if minVal has not already been set to -10 by a previous lane check on current cell.
      if(!boardLaneValues.includes(this.getName()) && minVal !== -10){
        minVal -= 1;
        // If lane also contains opponents mark, minVal of cell decrements by one.
        if(boardLaneValues.includes(this.getOpponent())){
          minVal -= 1;
        }
      }

    }
    return [minVal, maxVal, maxVal + Math.abs(minVal)];
  }

  function findLoseState(miniMaxVals){
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

  function miniMax(board, lanes) {
    const miniMaxVals = []

    // Loop each board cell to determine min/max value of empty cells (vaid moves).
    for (let cell = 0; cell < board.length; cell += 1) {
      if (board[cell] === "") {
        // Check edge case lose scenario for player.
        if(cell === 1){
          if(board[0] === this.getOpponent() && board[8] === this.getOpponent() ||
             board[2] === this.getOpponent() && board[6] === this.getOpponent()){
            return 1;
          }
        }
        // Set miniMaxVal to array containing [minVal,MaxVal, abs(minVal) + maxVal (move payoff)] values.
        const miniMaxVal = getMiniMaxVal.call(this, board, cell, lanes);
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
    let move = findLoseState(miniMaxVals);
    
    if(move === -1){
      // Choose move according to highest payoff.
      move = findBestMove(miniMaxVals);
    }
    return move;
  }

  // Returns a random valid move for ai to make
  function getEasyMove(board){
    // Mark valid moves in array with index number
    let openMoves = board.map((position, index) => position === '' ? index : position);
    // Filter non valid moves from array
    openMoves = openMoves.filter(position => Number.isInteger(position));
    return openMoves[Math.floor(Math.random() * openMoves.length)];
  }

  function getMove() {
    const board = gameboard.getGameboard();
    if(aiDifficulty === 'easy'){
      return getEasyMove(board);
    }
    return miniMax.call(this, board, gameboard.getWinConditions());
  }

  return { getName, getOpponent, setDifficulty, getMove };
};

// Module for game.
const game = (() => {
  const gameTypeSelection = document.getElementById("game-option-dropdown");
  const modal = document.querySelector(".modal");
  const resetGameBtn = document.getElementById("reset-game-btn");
  const backdrop = document.querySelector(".backdrop");
  const winnerDisplay = document.getElementById("winner-mark");
  const cells = [];
  const playerX = playerFactory("X");
  let playerO = playerFactory("O");
  let currentPlayer = playerX;
  let playingComputer = false;
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
    // If set to play computer and game is not over, have ai make move.
    if(playingComputer && currentPlayer === playerO && gameOver === false){
      const aiMove = playerO.getMove();
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

  function setGameType(){
    const {value} = document.querySelector('#form-drop-down');
    if(value === 'pvp'){
      playerO = playerFactory("O");
      playingComputer = false;
    } else {
      playerO = aiPlayer("O");
      playerO.setDifficulty(value);
      playingComputer = true;
    }
    resetGame();
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
  gameTypeSelection.addEventListener("change", setGameType);

  function startGame() {
    resetCellListeners();
  }

  return {startGame};
})();

game.startGame();
