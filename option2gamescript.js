let origBoard;

let player1 = "X";
let player2 = "O";

// storing all the possible winning scenarios
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];
const cells = document.querySelectorAll(".cell");

startGame();

function startGame() {
  player1 = "X";
  player2 = "O";
  //hide the message
  document.querySelector(".winner").style.display = "none";
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());

  // remove all the X and O from the table, reset the game
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    //removing the winning colour that could have occurred
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  //to ensure only one click on a given square
  if (typeof origBoard[square.target.id] == "number") {
    //passing id of the square and the token taken by the player1
    turn(square.target.id, player1);
    let temp = player1;
    player1 = player2;
    player2 = temp;
  }
  let gameWon = checkWin(origBoard, player2);
  if (gameWon) gameOver(gameWon);
}

function turn(squareId, player) {
  //initialising the selected square with the given token
  origBoard[squareId] = player;
  //updating the display
  document.getElementById(squareId).innerText = player;
  //after each turn checking the win-win scenario
  let gameWon = checkWin(origBoard, player);
  //if the game is won, game over
  if (gameWon) gameOver(gameWon);
}

//parameters being the current board and the token of the player
function checkWin(board, player) {
  //here it iterates through the board, if the particular index has the player's token then the index is concateneted to the accumulator
  let plays = board.reduce(
    (accumulator, element, index) =>
      element === player ? accumulator.concat(index) : accumulator,
    []
  );
  //checking for the win-win scenario
  let gameWon = null;
  //iterating through all the winning combinations
  for (let i = 0; i < winCombos.length; i++) {
    let count = 0;
    //checking if any entry by the player falls in the winning scenario
    for (let j = 0; j < plays.length; j++) {
      if (plays[j] === winCombos[i][0]) count++;
      if (plays[j] === winCombos[i][1]) count++;
      if (plays[j] === winCombos[i][2]) count++;
    }
    if (count === 3) {
      //storing the winning trio index and the player who won
      gameWon = { index: i, player: player };
      break;
    }
  }
  checkTie();
  return gameWon;
}

// two tasks -->
// highlight the squares which are a part of the winning combination
// disable the squares
function gameOver(gameWon) {
  //setting the background colour of the squares
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == "X" ? "#f342f3" : "#716dee";
  }
  //disabling the squares
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == "X" ? "Player1 won!🎉" : "Player2 won!🎉");
}

function declareWinner(who) {
  if (who === "Player1 won!🎉" || who === "Player2 won!🎉") {
    document.querySelector(".winner").style.display = "block";
  }
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
  return origBoard.filter((s) => typeof s == "number");
}

function checkTie() {
  // if there is no empty square and no one has won yet implies a tie
  if (emptySquares().length == 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}
