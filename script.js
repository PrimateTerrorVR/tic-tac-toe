const cells = document.querySelectorAll('.cell');
const playAgainBtn = document.getElementById('playAgain');
const notifications = document.getElementById('notifications');
const aiModeSelect = document.getElementById('aiMode');
const boardStyleSelect = document.getElementById('boardStyle');
const backgroundColorInput = document.getElementById('backgroundColor');
const textColorInput = document.getElementById('textColor');
const saveSettingsBtn = document.getElementById('saveSettings');
const resetSettingsBtn = document.getElementById('resetSettings');

let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let aiMode = 'normal';

// Initialize default settings
const defaultSettings = {
    backgroundColor: '#e0e0e0',
    textColor: '#333333',
};

const initBoard = () => {
    boardState.fill('');
    gameActive = true;
    notifications.innerText = '';
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.pointerEvents = 'auto';
    });
    if (currentPlayer === 'O') {
        aiMove();
    }
};

const renderCell = (index) => {
    const cell = document.getElementById(index);
    cell.innerText = boardState[index];
    cell.style.pointerEvents = 'none'; // Disable clicking on filled cells
};

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.id;
        if (boardState[index] !== '' || !gameActive) return;
        boardState[index] = currentPlayer;
        renderCell(index);
        checkWinConditions();
        if (gameActive) {
            currentPlayer = 'O';
            if (aiMode === 'normal' || aiMode === 'hard') {
                setTimeout(aiMove, 1000); // Simulate AI thinking time
            }
        }
    });
});

const aiMove = () => {
    const availableCells = boardState.map((val, index) => (val === '') ? index : null).filter(val => val !== null);
    const moveIndex = aiMode === 'normal' ? availableCells[Math.floor(Math.random() * availableCells.length)] : getBestMove();
    boardState[moveIndex] = currentPlayer;
    renderCell(moveIndex);
    checkWinConditions();
    if (gameActive) {
        currentPlayer = 'X';
    }
};

const getBestMove = () => {
    const availableCells = boardState.map((val, index) => (val === '') ? index : null).filter(val => val !== null);
    return availableCells[Math.floor(Math.random() * availableCells.length)];
};

const checkWinConditions = () => {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
        [0, 4, 8], [2, 4, 6] // Diagonal
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            notifications.innerText = `${boardState[a]} wins!`;
            gameActive = false;
            return;
        }
    }

    if (!boardState.includes('')) {
        notifications.innerText = "It's a draw!";
        gameActive = false;
    }
};

playAgainBtn.addEventListener('click', initBoard);

const saveSettings = () => {
    aiMode = aiModeSelect.value;
    const boardStyle = boardStyleSelect.value;
    document.querySelector('.board').style.borderRadius = (boardStyle === 'curved') ? '10px' : '0';
    
    document.body.style.backgroundColor = backgroundColorInput.value;
    cells.forEach(cell => {
        cell.style.color = textColorInput.value;
    });
};

resetSettingsBtn.addEventListener('click', () => {
    backgroundColorInput.value = defaultSettings.backgroundColor;
    textColorInput.value = defaultSettings.textColor;
    aiModeSelect.value = 'normal';
    boardStyleSelect.value = 'curved';
    saveSettings();
});

saveSettingsBtn.addEventListener('click', saveSettings);

// Initialize the game
initBoard();

