const textToType = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing speed tests are fun and challenging.",
    "Practice makes perfect, keep typing daily.",
    "JavaScript can make interactive websites.",
    "GitHub Pages can host your websites for free."
];

let timer;
let timeLeft = 60;
let totalWords = 0;

const textElement = document.getElementById('text-to-type');
const inputBox = document.getElementById('input-box');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const timeElement = document.getElementById('time');
const wordsElement = document.getElementById('words');
const accuracyElement = document.getElementById('accuracy');

function startGame() {
    // Reset
    clearInterval(timer);
    timeLeft = 60;
    totalWords = 0;
    inputBox.value = '';
    inputBox.disabled = false;
    inputBox.focus();
    timeElement.textContent = timeLeft;
    wordsElement.textContent = 0;
    accuracyElement.textContent = 0;
    
    // Show random text
    textElement.textContent = textToType[Math.floor(Math.random() * textToType.length)];

    // Start countdown
    timer = setInterval(() => {
        timeLeft--;
        timeElement.textContent = timeLeft;

        if (timeLeft === 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    inputBox.disabled = true;
    calculateResults();
}

function calculateResults() {
    const typedText = inputBox.value.trim();
    const originalText = textElement.textContent;
    
    // Words typed
    const typedWords = typedText.split(/\s+/).length;
    wordsElement.textContent = typedWords;

    // Accuracy
    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === originalText[i]) correctChars++;
    }
    const accuracy = Math.round((correctChars / originalText.length) * 100);
    accuracyElement.textContent = accuracy;
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    timeLeft = 60;
    inputBox.value = '';
    inputBox.disabled = true;
    timeElement.textContent = timeLeft;
    wordsElement.textContent = 0;
    accuracyElement.textContent = 0;
    textElement.textContent = "Click 'Start' to begin the typing test!";
});
