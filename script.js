let board;
let currentPlayer;
let rankedMode;
let rank;
let rankPoints;
const botLevelIncrease = 2; // Points required to make bot harder
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

function init() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    rankedMode = false;
    rank = ranks.Bronze[0]; // Start at Bronze I
    rankPoints = 0;
    updateBoard();
}

function updateBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.className = `cell ${cell ? cell.toLowerCase() : ''}`;
        cellElement.innerText = cell;
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
        if (currentPlayer === 'O') {
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
                // Check other ranks in order
                for (let key of Object.keys(ranks)) {
                    if (ranks[key].includes(rank)) {
                        const nextRankIndex = ranks[key].indexOf(rank) + 1;
                        if (nextRankIndex < ranks[key].length) {
                            rank = ranks[key][nextRankIndex];
                            break;
                        }
                    }
                }
            }
            alert('You ranked up!');
        }
        document.getElementById('rank').innerText = `Rank: ${rank}`;
    }
}

function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'alert';
    alertBox.innerText = message;
    document.body.appendChild(alertBox);
    setTimeout(() => {
        alertBox.remove();
    }, 3000);
}

function playAgain() {
    init();
    document.querySelectorAll('.alert').forEach(alert => alert.remove()); // Remove any existing alerts
}

// Settings and animation styles
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

// Create a play again button
const playAgainButton = document.createElement('button');
playAgainButton.innerText = 'Play Again';
playAgainButton.className = 'play-again-button';
playAgainButton.onclick = playAgain;
document.body.appendChild(playAgainButton);

init();

