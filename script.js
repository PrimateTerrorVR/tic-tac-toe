let board;
let currentPlayer;
let rankedMode;
let rank;
let rankPoints;
const botLevelIncrease = 2; // Points required to make bot harder

function init() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    rankedMode = false;
    rank = 'Novice';
    rankPoints = 0;
    updateBoard();
}

function updateBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.className = 'cell';
        cellElement.innerText = cell;
        cellElement.onclick = () => handleClick(index);
        boardElement.appendChild(cellElement);
    });
    document.getElementById('status').innerText = `Current Player: ${currentPlayer}`;
}

function handleClick(index) {
    if (board[index] || checkWinner()) return;
    board[index] = currentPlayer;
    if (checkWinner()) {
        alert(`Player ${currentPlayer} wins!`);
        updateRank(currentPlayer);
    } else if (board.every(cell => cell)) {
        alert('It\'s a draw!');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (currentPlayer === 'O') botPlay();
    }
    updateBoard();
}

function botPlay() {
    let availableSpots = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    let botMove = availableSpots[Math.floor(Math.random() * availableSpots.length)];
    board[botMove] = currentPlayer;
    if (checkWinner()) {
        alert(`Player ${currentPlayer} wins!`);
        updateRank(currentPlayer);
    } else if (board.every(cell => cell)) {
        alert('It\'s a draw!');
    } else {
        currentPlayer = 'X';
    }
    updateBoard();
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function updateRank(winner) {
    if (rankedMode && winner === 'X') {
        rankPoints++;
        if (rankPoints >= botLevelIncrease) {
            rankPoints = 0;
            // Increase bot difficulty or rank here
            alert('You ranked up!');
        }
        document.getElementById('rank').innerText = `Rank: ${rank}`;
    }
}

document.getElementById('ranked-mode').addEventListener('change', (e) => {
    rankedMode = e.target.checked;
});

document.getElementById('settings-button').addEventListener('click', () => {
    document.getElementById('settings-modal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('settings-modal').style.display = 'none';
});

document.getElementById('save-settings').addEventListener('click', () => {
    const boardColor = document.getElementById('color').value;
    const textColor = document.getElementById('text-color').value;
    document.querySelector('.board').style.backgroundColor = boardColor;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.style.color = textColor;
    });
    document.getElementById('settings-modal').style.display = 'none';
});

init();
