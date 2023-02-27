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

// Test gameboard functionality
gameboard.viewGameboard(); 
gameboard.playerMove('X',0);
gameboard.viewGameboard();
gameboard.playerMove('O',1);
gameboard.viewGameboard();