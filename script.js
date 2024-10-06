let board;
let currentPlayer;
let rankedMode;
let rank;
let rankPoints;
const botDelay = 1000; // Delay for bot move

// Ranks setup
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
    rank = savedRank ? savedRank : ranks.Bronze[0]; // Default to Bronze I
}

// Save rank to local storage
function saveRank() {
    localStorage.setItem('rank', rank);
}

// Initialize the game
function init() {
    loadRank();
    board = Array(9).fill(null);
    currentPlayer = 'X';
    rankedMode = false;
    rankPoints = 0;
    updateBoard();
    document.getElementById('rank').innerText = `Rank: ${rank}`;
}

// Update board display
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

// Handle cell click
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

// Animate move with drawing effect
function animateMove(index, player) {
    const cell = document.querySelector(`.cell:nth-child(${index + 1})`);
    cell.innerText = player;
    cell.classList.add('animate');
    setTimeout(() => {
        cell.classList.remove('animate');
    }, 300);
}

// Bot plays against the player
function botPlay() {
    const availableSpots = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    const botMove = availableSpots[Math.floor(Math.random() * availableSpots.length)];
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

// Check if there's a winner
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

// Update rank after a game
function updateRank(winner) {
    if (winner === 'X') {
        rankPoints++;
        if (rankPoints >= 3) {
            promoteRank();
        }
    } else {
        rankPoints = Math.max(0, rankPoints - 1);
    }
    saveRank();
    document.getElementById('rank').innerText = `Rank: ${rank}`;
}

// Promote the player's rank
function promoteRank() {
    // Logic to promote rank
    const currentRank = rank.split(" ")[0]; // Get the rank name
    const currentLevel = ranks[currentRank];
    const currentIndex = currentLevel.indexOf(rank);
    
    if (currentIndex < currentLevel.length - 1) {
        rank = currentLevel[currentIndex + 1];
    } else {
        // If at the last level, increase rank name
        const nextRank = Object.keys(ranks).find((r) => r === currentRank);
        if (nextRank) {
            rank = ranks[nextRank][0]; // Move to the next rank
        }
    }
    rankPoints = 0; // Reset points after rank promotion
}

// Show alert message
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
    const boardStyle = document.getElementById('board-style').value;
    const boardColor = document.getElementById('color').value;
    const textColor = document.getElementById('text-color').value;
    const playerPic = document.getElementById('profile-pic').value;

    const boardElement = document.getElementById('board');
    boardElement.style.backgroundColor = boardColor;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.style.color = textColor;
    });

    // Apply board style
    if (boardStyle === "curved") {
        boardElement.classList.add('curved');
        boardElement.classList.remove('sharp');
    } else {
        boardElement.classList.add('sharp');
        boardElement.classList.remove('curved');
    }

    // Set player O emoji
    document.querySelector('.cell.o').innerText = playerPic;

    document.getElementById('settings-modal').style.display = 'none';
};

// Play Again button functionality
document.getElementById('play-again').onclick = () => {
    init();
    document.getElementById('play-again').style.display = 'none';
};

// Initialize the game
init();

