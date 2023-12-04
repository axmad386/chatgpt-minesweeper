document.addEventListener("DOMContentLoaded", function() {
  const boardSize = 10;
  const totalMines = 10;
  let gameBoard = [];
  let mines = [];
  let totalMarked = 0;

  function initializeBoard() {
    for (let i = 0; i < boardSize; i++) {
      gameBoard[i] = [];
      for (let j = 0; j < boardSize; j++) {
        gameBoard[i][j] = {
          isMine: false,
          isRevealed: false,
          mineCount: 0,
        };
      }
    }
  }

  function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < totalMines) {
      const row = Math.floor(Math.random() * boardSize);
      const col = Math.floor(Math.random() * boardSize);

      if (!gameBoard[row][col].isMine) {
        gameBoard[row][col].isMine = true;
        minesPlaced++;
        mines.push({ row, col });
      }
    }
  }

  function calculateMineCounts() {
    for (const mine of mines) {
      const { row, col } = mine;
      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          if (i >= 0 && i < boardSize && j >= 0 && j < boardSize) {
            gameBoard[i][j].mineCount++;
          }
        }
      }
    }
  }

  function renderBoard() {
    const gameBoardElement = document.getElementById("game-board");

    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = i;
        cell.dataset.col = j;
        gameBoardElement.appendChild(cell);
      }
    }
  }

  function revealCell(row, col) {
    const cell = document.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`,
    );
    const currentCell = gameBoard[row][col];

    if (!currentCell.isRevealed) {
      currentCell.isRevealed = true;
      cell.classList.add("clicked");

      if (currentCell.isMine) {
        cell.classList.add("mine");
        alert("Game Over! You hit a mine.");
        return resetGame();
      }

      cell.textContent = currentCell.mineCount || "";
      if (currentCell.mineCount === 0) {
        // Auto-reveal neighboring cells if mine count is 0
        for (let i = row - 1; i <= row + 1; i++) {
          for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < boardSize && j >= 0 && j < boardSize) {
              revealCell(i, j);
            }
          }
        }
      }
    }
  }

  function handleCellClick(event) {
    console.log(event.button);
    event.preventDefault(); // Prevent the default right-click context menu

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const cell = gameBoard[row][col];

    if (event.button === 0) {
      // Left-click to reveal cell
      revealCell(row, col);
    } else if (event.button === 2 && !cell.isRevealed) {
      // Right-click to mark/unmark mine
      toggleMark(row, col);
    }
  }

  function toggleMark(row, col) {
    const cell = document.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`,
    );

    if (!gameBoard[row][col].isRevealed) {
      gameBoard[row][col].isMarked = !gameBoard[row][col].isMarked;
      cell.classList.toggle("marked", gameBoard[row][col].isMarked);
      totalMarked++;
      if(totalMarked == totalMines){
        // check is mark valid?
        if(gameBoard.filter(cell => cell.isMine).every(cell => cell.isMarked)){
          alert("You won!");
        }
      }
    }
  }

  function resetGame() {
    gameBoard = [];
    mines = [];
    initializeBoard();
    placeMines();
    calculateMineCounts();
    document.getElementById("game-board").innerHTML = "";
    renderBoard();
    totalMarked = 0;
  }

  initializeBoard();
  placeMines();
  calculateMineCounts();
  renderBoard();

  document
    .getElementById("game-board")
    .addEventListener("click", handleCellClick);
  document
    .getElementById("game-board")
    .addEventListener("contextmenu", function(event) {
      event.preventDefault(); // Prevent the default context menu on right-click
      handleCellClick(event);
    });
});
