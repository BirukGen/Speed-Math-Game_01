/* =========================
   SCREEN ELEMENTS
========================= */
const splash = document.getElementById("splash");
const menu = document.getElementById("menu");
const gameUI = document.getElementById("gameUI");
const gameOverScreen = document.getElementById("gameOver");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");

/* =========================
   SPLASH → MENU
========================= */
setTimeout(() => {
    splash.classList.add("hidden");
    menu.classList.remove("hidden");
}, 2800);

/* =========================
   BUTTON EVENTS
========================= */
startBtn.onclick = startGame;
restartBtn.onclick = startGame;

menuBtn.onclick = () => {
    gameOverScreen.classList.add("hidden");
    menu.classList.remove("hidden");
};

/* =========================
   START GAME
========================= */
function startGame() {
    menu.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    gameUI.classList.remove("hidden");

    createGame();
}

/* =========================
   GAME ENGINE
========================= */
function createGame() {

    const questionEl = document.getElementById("question");
    const inputDisplay = document.getElementById("inputDisplay");
    const scoreEl = document.getElementById("score");
    const timerEl = document.getElementById("timer");
    const timerChip = document.getElementById("timerChip");

    let currentAnswer = 0;
    let input = "";
    let score = 0;
    let time = 6;
    let interval;

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /* =========================
       NEW QUESTION + STAGE
    ========================= */
    function newQuestion() {

        let a, b, op;
        let stage = 1;

        if (score < 5) {
            stage = 1;
            a = rand(1, 9);
            b = rand(1, 9);
            op = "+";
            currentAnswer = a + b;

        } else if (score < 10) {
            stage = 2;
            a = rand(1, 9);
            b = rand(1, 9);
            op = Math.random() < 0.7 ? "+" : "-";

            if (op === "-") {
                if (a < b) [a, b] = [b, a];
                currentAnswer = a - b;
            } else currentAnswer = a + b;

        } else if (score < 15) {
            stage = 3;
            a = rand(10, 50);
            b = rand(1, 9);
            op = Math.random() < 0.6 ? "+" : "-";

            if (op === "-") {
                if (a < b) [a, b] = [b, a];
                currentAnswer = a - b;
            } else currentAnswer = a + b;

        } else if (score < 20) {
            stage = 4;
            a = rand(10, 99);
            b = rand(10, 99);
            op = Math.random() < 0.5 ? "+" : "-";

            if (op === "-") {
                if (a < b) [a, b] = [b, a];
                currentAnswer = a - b;
            } else currentAnswer = a + b;

        } else if (score < 25) {
            stage = 5;
            a = rand(2, 9);
            b = rand(2, 9);
            op = "×";
            currentAnswer = a * b;

        } else if (score < 30) {
            stage = 6;
            if (Math.random() < 0.5) {
                a = rand(10, 99);
                b = rand(1, 9);
                op = "×";
                currentAnswer = a * b;
            } else {
                a = rand(10, 99);
                b = rand(10, 99);
                op = "+";
                currentAnswer = a + b;
            }

        } else {
            stage = 7;
            a = rand(10, 99);
            b = rand(10, 99);
            op = "×";
            currentAnswer = a * b;
        }

        questionEl.innerText = `${a} ${op} ${b}`;

        input = "";
        inputDisplay.innerText = "0";

        /* =========================
           SMART TIMER (KEY FIX)
        ========================= */
        switch (stage) {
            case 1: time = 6; break;
            case 2: time = 6; break;
            case 3: time = 5.5; break;
            case 4: time = 5; break;
            case 5: time = 5.5; break; // 👈 more time for multiplication
            case 6: time = 5; break;
            case 7: time = 4; break;
        }

        timerEl.innerText = Math.ceil(time);
        updateTimerStyle();
    }

    function updateTimerStyle() {
        if (time <= 2) {
            timerChip.classList.add("danger");
        } else {
            timerChip.classList.remove("danger");
        }
    }

    /* =========================
       TIMER
    ========================= */
    function updateTimer() {
        clearInterval(interval);

        interval = setInterval(() => {
            time -= 1;
            timerEl.innerText = Math.ceil(time);
            updateTimerStyle();

            if (time <= 0) {
                endGame();
            }
        }, 1000);
    }

    /* =========================
       CHECK ANSWER
    ========================= */
    function checkAnswer() {
        if (input === "") return;
        
        const answerStr = currentAnswer.toString();
        
        if (parseInt(input) === currentAnswer) {
            score++;
            scoreEl.innerText = score;

            clearInterval(interval);

            setTimeout(() => {
                newQuestion();
                updateTimer();
            }, 180);
        } else if (input.length === answerStr.length) {
            inputDisplay.classList.remove("error-flash");
            void inputDisplay.offsetWidth; // trigger reflow
            inputDisplay.classList.add("error-flash");
            input = "";
        }
    }

    /* =========================
       END GAME
    ========================= */
    function endGame() {
        clearInterval(interval);

        gameUI.classList.add("hidden");
        gameOverScreen.classList.remove("hidden");

        document.getElementById("finalScore").innerText =
            "You scored " + score + " points";
    }

    /* =========================
       INPUT
    ========================= */
    document.querySelectorAll("#keypad button").forEach(btn => {
        btn.onclick = () => {
            const val = btn.innerText;

            if (val === "C") {
                input = "";
            } else {
                if (input.length < 5) {
                    input += val;
                }
            }

            inputDisplay.innerText = input || "0";
            inputDisplay.classList.remove("error-flash");

            checkAnswer();
        };
    });

    newQuestion();
    updateTimer();

    return {};
}