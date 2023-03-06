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

  function currentPlayerIndexes(player) {
    const result = playerMoves.map((element, index) => {
      if (element === player.getName()) {
        return index;
      }
      return -1;
    });
    return result;
  }

  function turnResult(player) {
    const playerIndexes = currentPlayerIndexes(player);

    for (let i = 0; i < winConditions.length; i += 1) {
      const test = winConditions[i].every((val) => playerIndexes.includes(val));
      if (test) {
        return "WIN";
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

  return { getName };
};

const xMarker = (winner) => {
  const xContainer = document.createElement("div");
  const x1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const x2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const x1Path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const x2Path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  xContainer.setAttribute("class", "x-mark");
  if(!winner){
    x1.setAttribute("class", "x1");
    x2.setAttribute("class", "x2");
  }
  else{
    xContainer.setAttribute("id", "x-winner");
  }

  x1.setAttribute("viewBox", "0 0 807 743");
  x1.setAttribute("fill", "none");
  x1.setAttribute("stroke", "black");

  x2.setAttribute("viewBox", "0 0 807 743");
  x2.setAttribute("fill", "none");
  x2.setAttribute("stroke", "black");

  x1Path.setAttribute(
    "d",
    "M197.719 124.671C201.107 126.553 203.395 130.514 205.649 133.469C212.861 142.927 219.999 152.441 227.731 161.484C260.716 200.06 297.267 235.457 330.906 273.487C384.151 333.68 435.776 394.993 486.668 457.176C515.578 492.5 542.549 529.93 574.881 562.262"
  );
  x1Path.setAttribute("stroke-linecap", "round");
  x1Path.setAttribute("stroke-width", "50");

  x2Path.setAttribute(
    "d",
    "M602.011 133.527C601.824 136.715 595.704 138.323 593.503 139.46C584.147 144.292 575.994 150.69 567.282 156.622C515.05 192.187 470.229 237.139 429.233 285.034C369.737 354.541 312.523 426.192 259.522 500.733C243.243 523.626 226.976 546.512 210.264 569.092C204.553 576.808 195.685 595.517 184.737 592.476"
  );
  x2Path.setAttribute("stroke-linecap", "round");
  x2Path.setAttribute("stroke-width", "50");

  x1.appendChild(x1Path);
  x2.appendChild(x2Path);
  xContainer.appendChild(x1);
  xContainer.appendChild(x2);

  return { xContainer };
};

const oMarker = (winner) => {
  const oContainer = document.createElement("div");
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const circlePath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  oContainer.setAttribute("class", "o-mark");
  if(!winner){
    circle.setAttribute("class", "circle");
  }
  else {
    oContainer.setAttribute("id", "o-winner");
  }

  circle.setAttribute("viewBox", "0 0 760 680");
  circle.setAttribute("fill", "none");
  circle.setAttribute("stroke", "black");

  circlePath.setAttribute(
    "d",
    "M452.209 34.4086C423.754 28.0591 395.516 26.2946 366.543 30.5304C337.2 34.8204 308.699 44.8314 280.935 54.9568C240.219 69.8057 201.148 88.4829 166.762 115.183C128.468 144.918 92.9461 182.018 69.1433 224.523C42.9912 271.223 28.0341 322.486 25.5579 375.972C23.5633 419.056 26.4214 466.362 42.2859 506.931C60.0127 552.263 90.3079 590.835 132.814 615.084C176.1 639.779 226.751 650.523 276.073 653.229C328.326 656.096 379.713 652.599 430.966 642.116C483.717 631.326 536.256 614.288 583.023 587.185C630.872 559.455 670.244 519.702 699.772 473.07C759.401 378.9 739.191 249.531 663.422 170.027C635.265 140.483 601.151 115.337 566.99 93.217C540.6 76.1293 512.218 61.9396 482.829 50.7893C452.116 39.1369 419.967 30.6806 387.265 27.1443C338.17 21.8354 290.068 27.5377 241.228 31.8039"
  );
  circlePath.setAttribute("stroke-linecap", "round");
  circlePath.setAttribute("stroke-width", "50");

  circle.appendChild(circlePath);
  oContainer.appendChild(circle);

  return { oContainer };
};

// Module for game
const game = (() => {
  const modal = document.querySelector(".modal");
  const resetGameBtn = document.getElementById("reset-game-btn");
  const backdrop = document.querySelector(".backdrop");
  const winnerDisplay = document.getElementById("winner-mark");
  const cells = [];
  const playerO = playerFactory("O");
  const playerX = playerFactory("X");
  let currentPlayer = playerX;

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

  function cellClicked() {
    // Create X or O and insert into cell
    const playerType = currentPlayer.getName();
    if (playerType === "X") {
      // console.log("Player X");
      const x = xMarker();
      this.appendChild(x.xContainer);
    } else {
      const o = oMarker();
      this.appendChild(o.oContainer);
    }
    const id = this.id.at(-1);
    const turnResult = gameboard.playerMove(currentPlayer, id);
    if (turnResult === "WIN") {
      const playerMark = currentPlayer.getName() === "X" ? xMarker("winner").xContainer : oMarker("winner").oContainer;
      winnerDisplay.appendChild(playerMark);
      modal.classList.add("open");
      backdrop.classList.add("open");
    } else if (turnResult === "TIE") {
      winnerDisplay.textContent = "TIE"
      modal.classList.add("open");
      backdrop.classList.add("open");
    } else {
      toggleTurn();
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
  }

  function closeModal() {
    backdrop.classList.remove("open");
    modal.classList.remove("open");
    winnerDisplay.textContent = "";
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
