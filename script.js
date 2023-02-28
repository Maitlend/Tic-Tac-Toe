const gameboard = (() => {
  const playerMoves = ["","","","","","","","",""];

  function getPlayerMoves(){
    return playerMoves;
  }

  function resetPlayerMoves(){
      playerMoves.forEach((element, index) => {
        playerMoves[index] = "";
      });
  }

  function playerMove(player, position){
    if(player === 'X' || player === 'O'){
      playerMoves[position] = player;
    }
    else{
      console.log("Invalid player picked to move...");
    }
  }

  function viewGameboard(){
    console.log(playerMoves);
  }

  return {getPlayerMoves, resetPlayerMoves, playerMove, viewGameboard};
})();

const playerFactory = (name) => {
  const getName = () => name;

  function makeMove(position){
    gameboard.playerMove(name, position);
  }
  
  return {getName, makeMove};
}

const game = (() => {
  const cell0 = document.getElementById('cell-0');
  const cell1 = document.getElementById('cell-1');
  const cell2 = document.getElementById('cell-2');
  const cell3 = document.getElementById('cell-3');
  const cell4 = document.getElementById('cell-4');
  const cell5 = document.getElementById('cell-5');
  const cell6 = document.getElementById('cell-6');
  const cell7 = document.getElementById('cell-7');
  const cell8 = document.getElementById('cell-8');

  const playerO = playerFactory("O");
  const playerX = playerFactory("X");

  let currentTurn = 'X';

  function toggleTurn(){
    if(currentTurn === 'X'){
      currentTurn = 'O';
    }
    else{
      currentTurn = 'X';
    }
  }

  function resetGame(){
    gameboard.resetPlayerMoves();
  }

  function getGameboard(){
    return gameboard.getPlayerMoves();
  }

  function updateDisplay(){

  }

  function cellClicked(){
    // console.log(this);
    this.textContent = currentTurn;
    toggleTurn();
    this.removeEventListener('click', cellClicked);

  }

  cell0.addEventListener('click', cellClicked);
  cell1.addEventListener('click', cellClicked);
  cell2.addEventListener('click', cellClicked);
  cell3.addEventListener('click', cellClicked);
  cell4.addEventListener('click', cellClicked);
  cell5.addEventListener('click', cellClicked);
  cell6.addEventListener('click', cellClicked);
  cell7.addEventListener('click', cellClicked);
  cell8.addEventListener('click', cellClicked);

  return {resetGame, getGameboard, cellClicked};

})();

// Test gameboard functionality
// gameboard.viewGameboard(); 
// gameboard.playerMove('X',0);
// gameboard.viewGameboard();
// gameboard.playerMove('O',1);
// gameboard.viewGameboard();

// Test playerfactory() 
// const playerO = playerFactory("O");
// const playerX = playerFactory("X");

// console.log(playerO.getName());
// console.log(playerX.getName());

// const invalidPlayer = playerFactory("A");

// playerO.makeMove(0);
// playerX.makeMove(1);
// gameboard.viewGameboard();


// console.log(game.getGameboard());
// game.resetGame();
// console.log(game.getGameboard());
