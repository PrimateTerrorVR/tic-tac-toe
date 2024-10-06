const board = document.getElementById("board");
const playAgainButton = document.getElementById("play-again");
const settingsButton = document.getElementById("settings-button");
const settingsModal = document.getElementById("settings-modal");
const closeButton = document.getElementById("close-settings");
const saveSettingsButton = document.getElementById("save-settings");
const cells = Array.from(Array(9).keys());
let currentPlayer = 'X';
let gameActive = true;
let boardState = ["", "", "", "", "", "", "", "", ""];
let gameMode = "ai-normal";
let profilePic = "😀"; // Default profile picture
let animationStyle = "none"; // Default animation style
let colorX = "#3f51b5"; // Default color for X
let colorO = "#3f51b5"; // Default color for O
let borderColor = "#3f51b5"; // Default border color
let backgroundColor = "#f0f0f0"; // Default background color

// Create the board
cells.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.dataset.index = index;
    cellElement.addEventListener("click", handleCellClick);
    board.appendChild(cellElement);
});

// Handle cell click
function handleCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;

    if (boardState[index] !== "" || !gameActive) return;

    boardState[index] = currentPlayer;

    // Update the cell content based on the current player
    if (currentPlayer === 'X') {
        cell.innerHTML = `<div class="x-part"></div>`;
        cell.querySelector(".x-part").style.borderColor = colorX; // Use the selected color
    } else {
        cell.innerHTML = `<div class="o"></div>`;
        cell.querySelector(".o").style.borderColor = colorO; // Use the selected color
    }

    cell.classList.add("clicked");

    checkWinner();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Check for a winner
function checkWinner() {
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            gameActive = false;
            alert(`${boardState[a]} Wins!`);
            return;
        }
    }
    if (!boardState.includes("")) {
        gameActive = false;
        alert("It's a Draw!");
    }
}

// Reset the game
function resetGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = 'X';
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove("clicked");
    });
}

// Play Again button event listener
playAgainButton.addEventListener("click", resetGame);

// Settings button event listener
settingsButton.addEventListener("click", () => {
    settingsModal.style.display = "block";
});

// Close settings modal
closeButton.addEventListener("click", () => {
    settingsModal.style.display = "none";
});

// Save settings
saveSettingsButton.addEventListener("click", () => {
    profilePic = document.getElementById("profile-pic").value;
    gameMode = document.getElementById("game-mode").value;
    colorX = document.getElementById("color-x").value;
    colorO = document.getElementById("color-o").value;
    borderColor = document.getElementById("border-color").value;
    backgroundColor = document.getElementById("background-color").value;

    // Update styles
    document.documentElement.style.setProperty('--color-x', colorX);
    document.documentElement.style.setProperty('--color-o', colorO);
    document.documentElement.style.setProperty('--border-color', borderColor);
    document.body.style.backgroundColor = backgroundColor;

    settingsModal.style.display = "none";
});

// Close modal if clicked outside
window.addEventListener("click", (event) => {
    if (event.target === settingsModal) {
        settingsModal.style.display = "none";
    }
});

// Load previous settings from localStorage
window.onload = function() {
    const savedProfilePic = localStorage.getItem("profilePic");
    const savedGameMode = localStorage.getItem("gameMode");
    const savedColorX = localStorage.getItem("colorX");
    const savedColorO = localStorage.getItem("colorO");
    const savedBorderColor = localStorage.getItem("borderColor");
    const savedBackgroundColor = localStorage.getItem("backgroundColor");

    if (savedProfilePic) profilePic = savedProfilePic;
    if (savedGameMode) gameMode = savedGameMode;
    if (savedColorX) colorX = savedColorX;
    if (savedColorO) colorO = savedColorO;
    if (savedBorderColor) borderColor = savedBorderColor;
    if (savedBackgroundColor) backgroundColor = savedBackgroundColor;

    document.getElementById("profile-pic").value = profilePic;
    document.getElementById("game-mode").value = gameMode;
    document.getElementById("color-x").value = colorX;
    document.getElementById("color-o").value = colorO;
    document.getElementById("border-color").value = borderColor;
    document.getElementById("background-color").value = backgroundColor;
    
    // Apply loaded styles
    document.documentElement.style.setProperty('--color-x', colorX);
    document.documentElement.style.setProperty('--color-o', colorO);
    document.documentElement.style.setProperty('--border-color', borderColor);
    document.body.style.backgroundColor = backgroundColor;
};

// Save settings to localStorage
window.addEventListener("beforeunload", () => {
    localStorage.setItem("profilePic", profilePic);
    localStorage.setItem("gameMode", gameMode);
    localStorage.setItem("colorX", colorX);
    localStorage.setItem("colorO", colorO);
    localStorage.setItem("borderColor", borderColor);
    localStorage.setItem("backgroundColor", backgroundColor);
});
