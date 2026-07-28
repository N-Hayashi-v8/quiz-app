const questions = [
  {
    question: "1年間で最も昼が短い日を何と呼ぶ？",
    choices: ["夏至", "冬至", "春分", "秋分"],
    answerIndex: 1,
  },
  {
    question: "日本の47都道府県のうち、最も面積が広いのはどこ？",
    choices: ["岩手県", "福島県", "北海道", "長野県"],
    answerIndex: 2,
  },
  {
    question: "郵便物の重さなどを量る器具を何という？",
    choices: ["巻尺", "秤", "水準器", "三角定規"],
    answerIndex: 1,
  },
  {
    question: "「五十歩百歩」の意味として最も近いものは？",
    choices: [
      "大きな差がある",
      "ほとんど差がない",
      "距離を正確に測る",
      "急いで行動する",
    ],
    answerIndex: 1,
  },
  {
    question: "1万円札の肖像に描かれている人物は誰？",
    choices: ["夏目漱石", "野口英世", "福沢諭吉", "樋口一葉"],
    answerIndex: 2,
  },
];

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const progressEl = document.getElementById("progress");
const nextBtn = document.getElementById("next-btn");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const scoreTextEl = document.getElementById("score-text");
const retryBtn = document.getElementById("retry-btn");
const chartCanvas = document.getElementById("score-chart");

let currentIndex = 0;
let score = 0;
let answered = false;
let scoreChart = null;

function startQuiz() {
  currentIndex = 0;
  score = 0;
  answered = false;
  quizScreen.hidden = false;
  resultScreen.hidden = true;
  showQuestion();
}

function showQuestion() {
  answered = false;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  nextBtn.hidden = true;

  const current = questions[currentIndex];
  progressEl.textContent = `第${currentIndex + 1}問 / 全${questions.length}問`;
  questionEl.textContent = current.question;

  choicesEl.innerHTML = "";
  current.choices.forEach((choiceText, index) => {
    const button = document.createElement("button");
    button.textContent = choiceText;
    button.className = "choice-btn";
    button.addEventListener("click", () => selectAnswer(index));
    choicesEl.appendChild(button);
  });
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;

  const current = questions[currentIndex];
  const buttons = choicesEl.querySelectorAll(".choice-btn");

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === current.answerIndex) {
      button.classList.add("correct");
    } else if (index === selectedIndex) {
      button.classList.add("incorrect");
    }
  });

  if (selectedIndex === current.answerIndex) {
    score++;
    feedbackEl.textContent = "正解です！";
    feedbackEl.classList.add("correct");
  } else {
    feedbackEl.textContent = "不正解です…";
    feedbackEl.classList.add("incorrect");
  }

  nextBtn.hidden = false;
  nextBtn.textContent =
    currentIndex === questions.length - 1 ? "結果を見る" : "次の問題へ";
}

function goToNext() {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  quizScreen.hidden = true;
  resultScreen.hidden = false;
  scoreTextEl.textContent = `${questions.length}問中 ${score}問正解でした！`;
  renderScoreChart();
}

function renderScoreChart() {
  const incorrect = questions.length - score;

  if (scoreChart) {
    scoreChart.destroy();
  }

  scoreChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: ["正解", "不正解"],
      datasets: [
        {
          label: "問題数",
          data: [score, incorrect],
          backgroundColor: ["#34ff6e", "#ff4d4d"],
          borderColor: ["#00d100", "#d10000"],
          borderWidth: 3,
          borderRadius: 12,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "スコア結果",
          font: { size: 18, weight: "bold" },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: questions.length,
          ticks: { stepSize: 1 },
        },
      },
    },
  });
}

nextBtn.addEventListener("click", goToNext);
retryBtn.addEventListener("click", startQuiz);

startQuiz();
