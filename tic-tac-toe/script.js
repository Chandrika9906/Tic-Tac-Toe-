// script.js
const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset");
const currentPlayerText = document.getElementById("player");
const scoreXText = document.getElementById("score-x");
const scoreOText = document.getElementById("score-o");
const scoreDrawText = document.getElementById("score-draw");
const statusText = document.getElementById("status");

let currentPlayer = "X";
let gameState = Array(9).fill("");
let gameOver = false;
let scoreX = 0, scoreO = 0, scoreDraw = 0;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function handleClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (gameState[cellIndex] !== "" || gameOver) return;

    gameState[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add("placed");

    if (checkWin()) {
        highlightWinningCells();
        updateScore();
        setStatus(`🎉 Player ${currentPlayer} wins!`, "win");
        gameOver = true;
        document.getElementById("current-player").style.visibility = "hidden";
    } else if (!gameState.includes("")) {
        scoreDraw++;
        scoreDrawText.textContent = scoreDraw;
        setStatus("🤝 It's a draw!", "draw");
        gameOver = true;
        document.getElementById("current-player").style.visibility = "hidden";
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        currentPlayerText.textContent = currentPlayer;
        updateHoverClass();
    }
}

function checkWin() {
    return winningCombinations.some(combo =>
        combo.every(i => gameState[i] === currentPlayer)
    );
}

function highlightWinningCells() {
    winningCombinations.forEach(combo => {
        if (combo.every(i => gameState[i] === currentPlayer)) {
            combo.forEach(i => cells[i].classList.add("winning-cell"));
        }
    });
}

function updateScore() {
    if (currentPlayer === "X") {
        scoreX++;
        scoreXText.textContent = scoreX;
    } else {
        scoreO++;
        scoreOText.textContent = scoreO;
    }
}

function setStatus(message, type) {
    statusText.textContent = message;
    statusText.className = type;
}

function updateHoverClass() {
    document.body.dataset.player = currentPlayer;
}

function resetGame() {
    gameState.fill("");
    currentPlayer = "X";
    gameOver = false;
    currentPlayerText.textContent = currentPlayer;
    document.getElementById("current-player").style.visibility = "visible";
    statusText.textContent = "\u00a0";
    statusText.className = "";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winning-cell", "placed");
    });
    updateHoverClass();
}

// Hover preview: show current player's symbol on empty cells
cells.forEach(cell => {
    cell.addEventListener("click", handleClick);

    cell.addEventListener("mouseenter", () => {
        const idx = Array.from(cells).indexOf(cell);
        if (gameState[idx] === "" && !gameOver) {
            cell.dataset.preview = currentPlayer;
        }
    });

    cell.addEventListener("mouseleave", () => {
        delete cell.dataset.preview;
    });
});

resetButton.addEventListener("click", resetGame);
updateHoverClass();
