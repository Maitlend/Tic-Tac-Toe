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
const miniMaxVal = (cell) => {
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

  function calcMiniMax(board, cell, lanes){
    // Use filter method to find all lanes that intersect current cell.
    const cellLanes = lanes.filter((lane) => lane.includes(cell));
    const cellMiniMax = miniMaxVal(cell);
    // Loop through each lane in our cellLanes array.
    for (let lane = 0; lane < cellLanes.length; lane += 1) {
      const boardLaneValues = board.filter((cell, index) => cellLanes[lane].includes(index));
      // Check lane for two current player marks (win scenario).
      if ((boardLaneValues[0] === this.getName() && boardLaneValues[0] === boardLaneValues[1]) ||
          (boardLaneValues[1] === this.getName() && boardLaneValues[1] === boardLaneValues[2]) ||
          (boardLaneValues[0] === this.getName() && boardLaneValues[0] === boardLaneValues[2])) {
        cellMiniMax.winningCell();
        // break;
      }  
      // If lane does not contain opponent mark maxVal of cell increments by one.
      if(!boardLaneValues.includes(this.getOpponent()) && cellMiniMax.getMaxVal() !== 10){
        cellMiniMax.incMax();
        // If lane also does not contain current players mark maxVal of cell increments by one.
        if(boardLaneValues.includes(this.getName())){
          cellMiniMax.incMax();
        }
      }
      // Check lane for two opponent marks (lose scenario).
      if ((boardLaneValues[0] === this.getOpponent() && boardLaneValues[0] === boardLaneValues[1]) ||
          (boardLaneValues[1] === this.getOpponent() && boardLaneValues[1] === boardLaneValues[2]) ||
          (boardLaneValues[0] === this.getOpponent() && boardLaneValues[0] === boardLaneValues[2])) {
        cellMiniMax.losingCell();
      }        
      // If lane does not contain current players mark, minVal of cell decrements by one.
      // Only enter if minVal has not already been set to -10 by a previous lane check on current cell.
      if(!boardLaneValues.includes(this.getName()) && cellMiniMax.getMinVal() !== -10){
        cellMiniMax.decMin();
        // If lane also contains opponents mark, minVal of cell decrements by one.
        if(boardLaneValues.includes(this.getOpponent())){
          cellMiniMax.decMin();
        }
      }

    }
    return cellMiniMax;
  }

  function findLoseState(miniMaxVals){
    // Loop through avail cells to prevent a loss if found
    for(let i = 0; i < miniMaxVals.length; i+=1){
      if(miniMaxVals[i].getMinVal() === -10 ){
        return miniMaxVals[i].getIndex();
      }
    }
    return -1;
  }

  // function viewCurrGroup(array){
  //   let string = "[";
  //   for(let i = 0; i < array.length; i+=1){
  //     string = string.concat(array[i].getIndex(), ", ");
  //   }
  //   string = string.concat("]");
  //   return string;
  // }

  // function viewGrouped(array){
  //   let string = "[";
  //   for(let i = 0; i < array.length; i+=1){
  //     string = string.concat("[");
  //     for(let j = 0; j < array[i].length; j+=1){
  //       string = string.concat(array[i][j].getIndex(), ", ");
  //     }
  //     string = string.concat("], ");
  //   }
  //   string = string.concat("]");
  //   return string;
  // }

  function findBestMove(miniMaxVals){
    // Sort miniMaxVals according to cellVal
    miniMaxVals.sort((cell1, cell2) => (cell1.getCellVal() < cell2.getCellVal()) ? 1 : -1);

    let currGroupVal = miniMaxVals[0].getCellVal();
    let currGroup = [];
    const groupedVals = [];
    for(let i = 0; i < miniMaxVals.length; i+=1){
      const currCell = miniMaxVals[i];
      // console.log(`Working on cell: ${currCell.getIndex()} with value: ${currCell.getCellVal()}`);
      // console.log(`currentGroupVal = ${currGroupVal}`);
      if(currCell.getCellVal() === currGroupVal){
        // console.log("currentGroupVal = currentCell val");
        currGroup.push(currCell);
        // console.log(viewCurrGroup(currGroup));
      }
      else {
        // console.log(`currentGroupVal of currCell != ${currGroupVal}`);
        // console.log(`Pushing ${viewCurrGroup(currGroup)} to grouped vals.`);
        groupedVals.push(currGroup);
        // console.log(`groupedVals = ${viewGrouped(groupedVals)}`);
        currGroupVal = currCell.getCellVal();
        currGroup = [currCell];
      }
    }
    groupedVals.push(currGroup);
    // console.log(viewGrouped(groupedVals));
    const randomGroup = Math.random();
    let move = 0;
    if(groupedVals.length > 1){
      if(aiDifficulty === 'hard'){
        if(randomGroup > .90){
          move = 1;
        }
      } else if(aiDifficulty === 'medium'){
        if(randomGroup > .45){
          move = 1;
        }
      }
    }
    const randomCell = Math.floor(Math.random() * groupedVals[move].length);
    return groupedVals[move][randomCell].getIndex();
  }

  function miniMax(board, lanes) {
    const miniMaxVals = []

    // Loop each board cell to determine min/max value of empty cells (vaid moves).
    for (let cell = 0; cell < board.length; cell += 1) {
      if (board[cell] === "") {
        // Check edge case lose scenario for unbeatable player.
        if(cell === 1 && aiDifficulty !== "medium"){
          if(board[0] === this.getOpponent() && board[8] === this.getOpponent() ||
             board[2] === this.getOpponent() && board[6] === this.getOpponent()){
            return 1;
          }
        }
        // Set miniMaxVal to array containing [minVal,MaxVal, abs(minVal) + maxVal (move payoff)] values.
        const miniMaxEl = calcMiniMax.call(this, board, cell, lanes);
        // Check if maxVal is 10 (winning move).
        if(miniMaxEl.getMaxVal() === 10){
          return miniMaxEl.getIndex();
        }
        miniMaxVals.push(miniMaxEl);
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
