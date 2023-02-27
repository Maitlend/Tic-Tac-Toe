const gameboard = (() => {
  let _playerMoves = ["","","","","","","","",""];

  function playerMove(player, position){
    if(player === 'X' || player === 'O'){
      _playerMoves[position] = player;
    }
    else{
      console.log("Invalid player picked to move...");
    }
  }

  function viewGameboard(){
    console.log(_playerMoves);
  }

  return {playerMove, viewGameboard};
})();

const playerFactory = (name) => {
  const getName = () => name;

  function makeMove(position){
    gameboard.playerMove(name, position);
  }

  if(name === 'X' || name === 'O'){
    return {getName, makeMove}
  }
  else{
    console.log(`ERROR: player name = ${name} but must be 'X' or 'O'`);
  }
}

const displayController = (() => {

})();


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




