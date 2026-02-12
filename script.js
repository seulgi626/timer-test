const inputHrs = document.getElementById('input-hrs');
const inputMin = document.getElementById('input-min');
const inputSec = document.getElementById('input-sec');
const btnStart = document.getElementById('btn-start');
const btnReset = document.getElementById('btn-reset');
const btnStartIcon = btnStart.querySelector('.btn-icon');
const btnStartLabel = btnStart.querySelector('.btn-label');
const btnResetIcon = btnReset.querySelector('.btn-icon');

let timerInterval = null;
let remainingSeconds = 0;
let isRunning = false;

const ICONS = {
    startEnabled: 'images/icon-start.png',
    startDisabled: 'images/icon-start-disabled.png',
    stop: 'images/icon-stop.png',
    resetEnabled: 'images/icon-reset.png',
    resetDisabled: 'images/icon-reset-disabled.png',
};

function setupInput(el, max) {
    el.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 2);
        updateButtons();
    });
    el.addEventListener('focus', function () { if (!isRunning) this.select(); });
    el.addEventListener('blur', function () {
        let v = parseInt(this.value, 10) || 0;
        this.value = String(Math.min(v, max)).padStart(2, '0');
        updateButtons();
    });
}

setupInput(inputHrs, 99);
setupInput(inputMin, 59);
setupInput(inputSec, 59);

function getSeconds() {
    return (parseInt(inputHrs.value, 10) || 0) * 3600
         + (parseInt(inputMin.value, 10) || 0) * 60
         + (parseInt(inputSec.value, 10) || 0);
}

function updateButtons() {
    if (isRunning) {
        btnStart.disabled = false;
        btnStart.className = 'running';
        btnStartIcon.src = ICONS.stop;
        btnStartLabel.textContent = 'PAUSE';
        btnReset.disabled = false;
        btnReset.className = 'active';
        btnResetIcon.src = ICONS.resetEnabled;
    } else {
        btnStartLabel.textContent = 'START';
        if (getSeconds() > 0) {
            btnStart.disabled = false;
            btnStart.className = 'active';
            btnStartIcon.src = ICONS.startEnabled;
            btnReset.disabled = false;
            btnReset.className = 'active';
            btnResetIcon.src = ICONS.resetEnabled;
        } else {
            btnStart.disabled = true;
            btnStart.className = '';
            btnStartIcon.src = ICONS.startDisabled;
            btnReset.disabled = true;
            btnReset.className = '';
            btnResetIcon.src = ICONS.resetDisabled;
        }
    }
}

function updateDisplay() {
    const h = Math.floor(remainingSeconds / 3600);
    const m = Math.floor((remainingSeconds % 3600) / 60);
    const s = remainingSeconds % 60;
    inputHrs.value = String(h).padStart(2, '0');
    inputMin.value = String(m).padStart(2, '0');
    inputSec.value = String(s).padStart(2, '0');
}

function tick() {
    if (--remainingSeconds <= 0) {
        remainingSeconds = 0;
        updateDisplay();
        stopTimer();
        alert('Finish');
        return;
    }
    updateDisplay();
}

function startTimer() {
    remainingSeconds = getSeconds();
    if (remainingSeconds <= 0) return;
    isRunning = true;
    [inputHrs, inputMin, inputSec].forEach(el => el.readOnly = true);
    updateButtons();
    timerInterval = setInterval(tick, 1000);
}

function stopTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    [inputHrs, inputMin, inputSec].forEach(el => el.readOnly = false);
    updateButtons();
}

function resetTimer() {
    stopTimer();
    remainingSeconds = 0;
    inputHrs.value = inputMin.value = inputSec.value = '00';
    updateButtons();
}

btnStart.addEventListener('click', () => isRunning ? stopTimer() : startTimer());
btnReset.addEventListener('click', resetTimer);

[inputHrs, inputMin, inputSec].forEach(el => {
    el.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        this.blur();
        isRunning ? stopTimer() : getSeconds() > 0 && startTimer();
    });
});

updateButtons();
