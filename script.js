const board = document.getElementById('board');
const playAgainButton = document.getElementById('play-again');
const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');
const saveSettingsButton = document.getElementById('save-settings');
const gameModeSelect = document.getElementById('game-mode');
const profilePicInput = document.getElementById('profile-pic');
const colorXInput = document.getElementById('color-x');
const colorOInput = document.getElementById('color-o');
const borderColorInput = document.getElementById('border-color');
const backgroundColorInput = document.getElementById('background-color');

let currentPlayer = 'X';
let boardState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let aiMode = false;
let rankedMode = false;
let userRank = 'Bronze I'; // Default rank
let profilePic = '😀';
let settings = {
    colorX: '#ff0000',
    colorO: '#0000ff',
    borderColor: '#000000',
    backgroundColor: '#ffffff'
};

// Initialize board
const initBoard = () => {
    board.innerHTML = '';
    boardState.fill('');
    currentPlayer = 'X';
    gameActive = true;

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => handleCellClick(i));
        board.appendChild(cell);
    }

    applySettings();
};

// Handle cell clicks
const handleCellClick = (index) => {
    if (boardState[index] || !gameActive) return;
    boardState[index] = currentPlayer;
    renderCell(index);
    checkWinConditions();
    if (gameActive && aiMode && currentPlayer === 'X') {
        setTimeout(aiMove, 1000);
    }
};

// Render cell based on state
const renderCell = (index) => {
    const cell = board.children[index];
    if (currentPlayer === 'X') {
        cell.innerHTML = `<div class="x-part">X</div>`;
    } else {
        cell.innerHTML = `<div class="o"></div>`;
    }
    cell.classList.add('clicked');
};

// Check for win conditions
const checkWinConditions = () => {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            announceWinner(boardState[a]);
            return;
        }
    }

    if (!boardState.includes('')) {
        announceDraw();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
};

// Announce winner
const announceWinner = (winner) => {
    alert(`${winner} wins!`);
    gameActive = false;
};

// Announce draw
const announceDraw = () => {
    alert("It's a draw!");
    gameActive = false;
};

// AI Move
const aiMove = () => {
    let availableCells = boardState.map((cell, index) => (cell === '' ? index : null)).filter(cell => cell !== null);
    let randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    if (randomCell !== undefined) {
        handleCellClick(randomCell);
    }
};

// Apply settings from inputs
const applySettings = () => {
    document.documentElement.style.setProperty('--color-x', settings.colorX);
    document.documentElement.style.setProperty('--color-o', settings.colorO);
    document.documentElement.style.setProperty('--border-color', settings.borderColor);
    document.documentElement.style.setProperty('--background-color', settings.backgroundColor);
    document.body.style.backgroundColor = settings.backgroundColor;
};

// Event Listeners
playAgainButton.addEventListener('click', initBoard);
settingsButton.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
});
closeSettings.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});
saveSettingsButton.addEventListener('click', () => {
    settings.colorX = colorXInput.value;
    settings.colorO = colorOInput.value;
    settings.borderColor = borderColorInput.value;
    settings.backgroundColor = backgroundColorInput.value;
    profilePic = profilePicInput.value;
    applySettings();
    settingsModal.style.display = 'none';
});

// Initialize the board on page load
initBoard();
