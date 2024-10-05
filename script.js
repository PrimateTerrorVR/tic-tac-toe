let board;
let currentPlayer;
let rankedMode;
let rank;
let rankPoints;
const botLevelIncrease = 2; // Points required to make the bot harder
const botDelay = 1000; // Delay for bot move

const ranks = {
    Bronze: ['Bronze I', 'Bronze II', 'Bronze III'],
    Silver: ['Silver I', 'Silver II', 'Silver III'],
    Gold: ['Gold I', 'Gold II', 'Gold III'],
    Platinum: ['Platinum I', 'Platinum II', 'Platinum III'],
    Diamond: ['Diamond I', 'Diamond II', 'Diamond III'],
    Elite: ['Elite'],
    Champion: ['Champion'],
    Unreal: ['Unreal']
};

// Load saved rank from local storage
function loadRank() {
    const savedRank = localStorage.getItem('rank');
    if (savedRank) {
        rank = savedRank;
    } else {
        rank = ranks.Bronze[0]; // Start at Bronze I if no saved rank
    }
}

// Save rank to local storage
function saveRank() {
    localStorage.setItem('rank', rank);
}

function init() {
    loadRank();
    board = Array(9).fill(null);
    currentPlayer = 'X';
    rankedMode = false;
    rankPoints = 0;
    updateBoard();
    document.getElementById('rank').innerText = `Rank: ${rank}`;
}

function updateBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.className = `cell ${cell ? cell.toLowerCase() : ''}`;
        cellElement.onclick = () => handleClick(index);
        boardElement.appendChild(cellElement);
    });
    document.getElementById('status').innerText = `Current Player: ${currentPlayer}`;
}

function handleClick(index) {
    if (board[index] || checkWinner()) return;
    board[index] = currentPlayer;
    animateMove(index, currentPlayer);
    if (checkWinner()) {
        showAlert(`Player ${currentPlayer} wins!`);
        updateRank(currentPlayer);
    } else if (board.every(cell => cell)) {
        showAlert('It\'s a draw!');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (currentPlayer === 'O' && rankedMode) {
            setTimeout(botPlay, botDelay); // Delay bot move
        }
    }
    updateBoard();
}

function animateMove(index, player) {
    const cell = document.querySelector(`.cell:nth-child(${index + 1})`);
    cell.classList.add('animate');
    cell.innerText = player;

    // Drawing effect
    setTimeout(() => {
        cell.classList.remove('animate');
    }, 300);
}

function botPlay() {
    let availableSpots = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    let botMove = availableSpots[Math.floor(Math.random() * availableSpots.length)];
    board[botMove] = currentPlayer;
    animateMove(botMove, currentPlayer);
    if (checkWinner()) {
        showAlert(`Player ${currentPlayer} wins!`);
        updateRank(currentPlayer);
    } else if (board.every(cell => cell)) {
        showAlert('It\'s a draw!');
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
            // Logic to increase rank
            const currentRankIndex = ranks.Bronze.indexOf(rank);
            if (currentRankIndex < ranks.Bronze.length - 1) {
                rank = ranks.Bronze[currentRankIndex + 1];
            } else {
                // Check other ranks as needed
            }
            saveRank();
            document.getElementById('rank').innerText = `Rank: ${rank}`;
        }
    }
}

function showAlert(message) {
    const alert = document.createElement('div');
    alert.className = 'alert';
    alert.innerText = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

// Settings Modal Logic
document.getElementById('settings-button').onclick = () => {
    document.getElementById('settings-modal').style.display = 'block';
};

document.querySelector('.close').onclick = () => {
    document.getElementById('settings-modal').style.display = 'none';
};

document.getElementById('save-settings').onclick = () => {
    const boardColor = document.getElementById('color').value;
    const textColor = document.getElementById('text-color').value;
    const playerPic = document.getElementById('profile-pic').value;

    document.body.style.backgroundColor = boardColor;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.style.backgroundColor = boardColor;
        cell.style.color = textColor;
    });

    // Set player O emoji
    document.querySelector('.cell.o').innerText = playerPic;

    document.getElementById('settings-modal').style.display = 'none';
};

// Initialize the game
init();


