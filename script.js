// Sample passages
const SAMPLES = [
  `Computer science is built on the foundation of problem-solving, logical thinking, and continuous learning. A CS student often works with programming languages, algorithms, and data structures to create efficient solutions. As technology evolves rapidly, students must adapt to new tools, frameworks, and industry practices. Whether debugging code, designing software, or exploring emerging fields like artificial intelligence, the journey of a CS student is filled with curiosity, creativity, and innovation.`
];

const passageEl = document.getElementById('passage');
const inputEl = document.getElementById('input');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const cpmEl = document.getElementById('cpm');
const elapsedEl = document.getElementById('elapsed');
const progressBar = document.getElementById('progress-bar');
const previewText = document.getElementById('preview-text');
const displayTimer = document.getElementById('display-timer');

let sampleText = SAMPLES[0];
let startTime = null;
let timerInterval = null;
let finished = false;

function setPassage(text){
  sampleText = text;
  passageEl.innerHTML = '';
  for(let ch of text){
    const span = document.createElement('span');
    span.textContent = ch;
    span.className = 'char';
    passageEl.appendChild(span);
  }
  resetTest(true);
}

function resetTest(keepInput=false){
  clearInterval(timerInterval);
  startTime = null;
  finished = false;
  if(!keepInput) inputEl.value = '';
  elapsedEl.textContent = '00:00';
  displayTimer.textContent = '00:00';
  wpmEl.textContent = '0';
  cpmEl.textContent = '0';
  accuracyEl.textContent = '100%';
  progressBar.style.width = '0%';
  previewText.textContent = '';
  passageEl.querySelectorAll('.char').forEach(s => s.classList.remove('correct','incorrect'));
}

function formatTime(seconds){
  const mm = String(Math.floor(seconds/60)).padStart(2,'0');
  const ss = String(Math.floor(seconds%60)).padStart(2,'0');
  return `${mm}:${ss}`;
}

function updateStats(){
  const typed = inputEl.value;
  const totalChars = sampleText.length;
  const correctChars = Array.from(typed).reduce((acc,ch,i)=> acc + (sampleText[i] === ch ? 1 : 0), 0);
  const accuracy = typed.length === 0 ? 100 : Math.max(0, Math.round((correctChars / typed.length) * 100));
  const elapsedSec = startTime ? (Date.now() - startTime) / 1000 : 0;
  const minutes = Math.max(1/60, elapsedSec / 60);
  const wordsTyped = typed.trim().length === 0 ? 0 : typed.trim().split(/\s+/).length;
  const wpm = Math.round(wordsTyped / minutes);
  const cpm = Math.round((typed.length / minutes));

  wpmEl.textContent = isFinite(wpm) ? wpm : 0;
  cpmEl.textContent = isFinite(cpm) ? cpm : 0;
  accuracyEl.textContent = `${accuracy}%`;
  elapsedEl.textContent = formatTime(elapsedSec);
  displayTimer.textContent = formatTime(elapsedSec);

  const progress = Math.min(100, Math.round((typed.length / totalChars) * 100));
  progressBar.style.width = progress + '%';

  previewText.textContent = typed.slice(-60);
  passageEl.querySelectorAll('.char').forEach((span, idx) =>{
    const ch = typed[idx];
    span.classList.remove('correct','incorrect');
    if(ch == null) return;
    if(ch === span.textContent) span.classList.add('correct');
    else span.classList.add('incorrect');
  });

  if(typed.length >= totalChars && !finished){
    finishTest();
  }
}

function startTimerIfNeeded(){
  if(startTime) return;
  startTime = Date.now();
  timerInterval = setInterval(() => updateStats(), 200);
  updateStats();
}

function finishTest(){
  finished = true;
  clearInterval(timerInterval);
  updateStats();
  passageEl.focus();
}

// Event bindings
inputEl.addEventListener('input', ()=>{
  startTimerIfNeeded();
  updateStats();
});

passageEl.addEventListener('click', ()=> inputEl.focus());

document.getElementById('restart').addEventListener('click', ()=> resetTest());
document.getElementById('finish').addEventListener('click', ()=> finishTest());

document.getElementById('change-sample').addEventListener('click', ()=>{
  const other = SAMPLES.filter(s=>s!==sampleText);
  if(other.length === 0) return;
  const pick = other[Math.floor(Math.random()*other.length)];
  setPassage(pick);
});

document.getElementById('paste-text').addEventListener('click', ()=>{
  const userText = prompt('Paste your test passage (replace current):');
  if(userText && userText.trim().length>0) setPassage(userText.trim());
});

document.addEventListener('keydown', (e)=>{
  if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='r'){
    e.preventDefault(); resetTest();
  }
});

passageEl.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' || e.key === ' ') inputEl.focus();
});

// initial setup
setPassage(sampleText);
