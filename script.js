const gameboard = (() => {
  const playerMoves = ["","","","","","","","",""];

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

  return {playerMove, viewGameboard};
})();

const playerFactory = (name) => {
  const getName = () => name;

  function makeMove(position){
    gameboard.playerMove(name, position);
  }
  
  return {getName, makeMove}
}

// const displayController = (() => {

// })();


// Test gameboard functionality
// gameboard.viewGameboard(); 
// gameboard.playerMove('X',0);
// gameboard.viewGameboard();
// gameboard.playerMove('O',1);
// gameboard.viewGameboard();

// Test playerfactory() 
const playerO = playerFactory("O");
const playerX = playerFactory("X");

console.log(playerO.getName());
console.log(playerX.getName());

// const invalidPlayer = playerFactory("A");

playerO.makeMove(0);
playerX.makeMove(1);
gameboard.viewGameboard();