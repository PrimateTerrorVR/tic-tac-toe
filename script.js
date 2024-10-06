let board;
let currentPlayer;
let rankedMode;
let rank;
let rankPoints;
const botDelay = 1000; // Delay for bot move
let toggleAnimations = true; // Animation toggle

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
    document.getElementById('play-again').style.display = 'none'; // Hide play again button
    document.getElementById('settings-modal').style.display = 'none'; // Hide settings
    resetBlur();
}

// Update board display
function updateBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.className = `cell ${cell ? cell.toLowerCase() : ''}`;
        cellElement.onclick = () => handleClick(index, cellElement);
        boardElement.appendChild(cellElement);
    });
    document.getElementById('status').innerText = `Current Player: ${currentPlayer}`;
}

// Handle cell click
function handleClick(index, cellElement) {
    if (board[index] || checkWinner()) return;

    board[index] = currentPlayer;
    cellElement.classList.add('clicked'); // Add clicked class for border

    // Draw X or O based on the current player
    drawMove(index, currentPlayer);

    if (checkWinner()) {
        showAlert(`Player ${currentPlayer} wins!`);
        updateRank(currentPlayer);
        document.getElementById('play-again').style.display = 'block'; // Show play again button
    } else if (board.every(cell => cell)) {
        showAlert('It\'s a draw!');
        document.getElementById('play-again').style.display = 'block'; // Show play again button
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (currentPlayer === 'O' && rankedMode) {
            setTimeout(botPlay, botDelay); // Delay bot move
        }
    }
    updateBoard();
}

// Draw X or O without animations
function drawMove(index, player) {
    const cell = document.querySelector(`.cell:nth-child(${index + 1})`);
    if (player === 'X') {
        if (toggleAnimations) {
            // Draw first diagonal line
            setTimeout(() => {
                cell.innerHTML = '<div class="x-part"></div>';
            }, 0);
            // Draw second diagonal line after delay
            setTimeout(() => {
                cell.innerHTML += '<div class="x-part"></div>'; // Add second diagonal
            }, 400);
        } else {
            cell.innerHTML = '<div class="x-part"></div>'; // Draw X immediately
        }
    } else if (player === 'O') {
        cell.innerHTML = '<div class="o"></div>'; // Draw O
    }
}

// Bot plays a move
function botPlay() {
    const emptyCells = board.map((cell, index) => (cell === null ? index : null)).filter(val => val !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    handleClick(randomIndex, document.querySelector(`.cell:nth-child(${randomIndex + 1})`));
}

// Check for winner
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

// Show alert message
function showAlert(message) {
    alert(message);
}

// Update rank based on player wins
function updateRank(winner) {
    if (winner === 'X') {
        rankPoints++;
        if (rankPoints >= 3) {
            const nextRank = getNextRank();
            if (nextRank) {
                rank = nextRank;
                rankPoints = 0; // Reset points after ranking up
                saveRank();
                document.getElementById('rank').innerText = `Rank: ${rank}`;
            }
        }
    }
}

// Get next rank
function getNextRank() {
    for (const [key, value] of Object.entries(ranks)) {
        const currentIndex = value.indexOf(rank);
        if (currentIndex !== -1 && currentIndex < value.length - 1) {
            return value[currentIndex + 1];
        }
    }
    return null;
}

// Reset background blur
function resetBlur() {
    const body = document.body;
    body.classList.remove('blurred');
}

// Event listeners for play again and settings
document.getElementById('play-again').onclick = () => {
    init();
};

document.getElementById('settings-button').onclick = () => {
    document.getElementById('settings-modal').style.display = 'block';
    const body = document.body;
    body.classList.add('blurred'); // Apply blur effect
};

document.getElementById('save-settings').onclick = () => {
    const emoji = document.getElementById('profile-pic').value;
    const gameMode = document.getElementById('game-mode').value;
    toggleAnimations = document.getElementById('toggle-animations').checked;
    rankedMode = gameMode === 'ai-ranked';

    if (emoji) {
        alert(`Profile picture changed to: ${emoji}`);
    }
    
    // Reset blur when settings are saved
    resetBlur();
    document.getElementById('settings-modal').style.display = 'none';
};

// Close modal
document.querySelector('.close').onclick = () => {
    document.getElementById('settings-modal').style.display = 'none';
    resetBlur(); // Reset blur when modal is closed
};

// Close modal when clicking outside of it
window.onclick = (event) => {
    if (event.target === document.getElementById('settings-modal')) {
        document.getElementById('settings-modal').style.display = 'none';
        resetBlur(); // Reset blur when modal is closed
    }
};

// Initialize the game on page load
init();
