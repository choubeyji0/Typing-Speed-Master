const textSamples = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing speed tests help improve your keyboard skills.",
    "JavaScript can make websites interactive and fun.",
    "Consistent practice is key to mastering typing speed.",
    "GitHub Pages allows free hosting of static websites.",
    "Focus on accuracy before speed, speed will follow naturally.",
    "Professional typists practice for hours every day."
];

let timer;
let timeLeft = 60;
let wpm = 0;

const textElement = document.getElementById('text-to-type');
const inputBox = document.getElementById('input-box');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const timeElement = document.getElementById('time');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');

let currentText = '';
let totalTyped = 0;
let correctChars = 0;

function startGame() {
    // Reset variables
    clearInterval(timer);
    timeLeft = 60;
    totalTyped = 0;
    correctChars = 0;
    inputBox.value = '';
    inputBox.disabled = false;
    inputBox.focus();
    timeElement.textContent = timeLeft;
    wpmElement.textContent = 0;
    accuracyElement.textContent = 0;

    // Select random text
    currentText = textSamples[Math.floor(Math.random() * textSamples.length)];
    renderText();

    // Start timer
    timer = setInterval(() => {
        timeLeft--;
        timeElement.textContent = timeLeft;
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function renderText() {
    textElement.innerHTML = '';
    currentText.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        textElement.appendChild(span);
    });
}

inputBox.addEventListener('input', () => {
    const typed = inputBox.value.split('');
    const spans = textElement.querySelectorAll('span');

    correctChars = 0;

    spans.forEach((span, idx) => {
        const char = typed[idx];
        if (char == null) {
            span.classList.remove('correct', 'incorrect');
        } else if (char === span.textContent) {
            span.classList.add('correct');
            span.classList.remove('incorrect');
            correctChars++;
        } else {
            span.classList.add('incorrect');
            span.classList.remove('correct');
        }
    });

    totalTyped = typed.length;
    const accuracy = totalTyped === 0 ? 0 : Math.round((correctChars / totalTyped) * 100);
    accuracyElement.textContent = accuracy;

    wpm = Math.round((correctChars / 5) / ((60 - timeLeft) / 60) || 0);
    wpmElement.textContent = wpm;
});

function endGame() {
    clearInterval(timer);
    inputBox.disabled = true;
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    timeLeft = 60;
    inputBox.value = '';
    inputBox.disabled = true;
    timeElement.textContent = timeLeft;
    wpmElement.textContent = 0;
    accuracyElement.textContent = 0;
    textElement.textContent = "Click 'Start' to begin the typing test!";
});
