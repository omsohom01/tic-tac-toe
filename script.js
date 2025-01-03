const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restartButton');

let currentPlayer;
let isAITurn;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    currentPlayer = X_CLASS;
    isAITurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.innerHTML = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    statusElement.textContent = "Your turn";
    board.classList.remove('locked');
}

function handleClick(e) {
    const cell = e.target;
    if (isAITurn) return;
    
    placeMark(cell, currentPlayer);
    
    if (checkWin(currentPlayer)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (currentPlayer === O_CLASS) {
            isAITurn = true;
            board.classList.add('locked');
            statusElement.textContent = "AI's turn";
            setTimeout(aiMove, 750);
        } else {
            setBoardHoverClass();
        }
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    if (currentClass === X_CLASS) {
        cell.innerHTML = '<div class="x"></div>';
    }
}

function swapTurns() {
    currentPlayer = currentPlayer === X_CLASS ? O_CLASS : X_CLASS;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    board.classList.add(currentPlayer);
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function endGame(draw) {
    if (draw) {
        statusElement.textContent = "It's a draw!";
    } else {
        statusElement.textContent = currentPlayer === X_CLASS ? "You win!" : "AI wins!";
    }
    board.classList.add('locked');
}

function aiMove() {
    const bestMove = getBestMove();
    placeMark(cellElements[bestMove], O_CLASS);
    if (checkWin(O_CLASS)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        statusElement.textContent = "Your turn";
    }
    isAITurn = false;
    board.classList.remove('locked');
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < 9; i++) {
        if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(O_CLASS)) {
            cellElements[i].classList.add(O_CLASS);
            let score = minimax(false);
            cellElements[i].classList.remove(O_CLASS);
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(isMaximizing) {
    if (checkWin(O_CLASS)) return 1;
    if (checkWin(X_CLASS)) return -1;
    if (isDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(O_CLASS)) {
                cellElements[i].classList.add(O_CLASS);
                let score = minimax(false);
                cellElements[i].classList.remove(O_CLASS);
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(O_CLASS)) {
                cellElements[i].classList.add(X_CLASS);
                let score = minimax(true);
                cellElements[i].classList.remove(X_CLASS);
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

