//app.js

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const startButton = document.getElementById("start-btn");
const quizScreen = document.querySelector(".quiz");
const subjectButtons = document.querySelectorAll(".subject-btn");
const questionCounter = document.getElementById("question-counter");
const progressBar = document.getElementById("progress-bar");
const fillContainer = document.getElementById("fill-blank-container");
const fillAnswer = document.getElementById("fill-answer");
const submitFill = document.getElementById("submit-fill");
const fillFeedback = document.getElementById("fill-feedback");
const timerElement = document.getElementById("timer");
const homeButton = document.getElementById("home-btn");
const multiContainer = document.getElementById("multiselect-container");
const submitMulti = document.getElementById("submit-multi");
const backButton = document.getElementById("back-btn");
const questionCount = document.getElementById("question-count");

let questions = [];
let quizQuestions = [];
let quizResults = [];

let selectedSubject = "";
let selectedTopics = [];
let selectedQuestionCount = "20";

let currentQuestionIndex = 0;
let score = 0;

let timer;
let timeLeft;
let selectedTimerMode = "revision";
let totalQuizTime = 0;

const subjectFiles = {
    "Ground Engineering":
        "questions/ground-engineering.json",

    "Analysis of Structures":
        "questions/structures-analysis.json",

    "Structural Design & Detailing":
        "questions/structural-design.json"
};

subjectButtons.forEach(button => {
    button.addEventListener("click", async () => {
        selectedSubject = button.dataset.subject;

        await loadSubjectQuestions();

        showTopicScreen();
    });
});

backButton.addEventListener("click", () => {
    document.getElementById("setup-screen").style.display = "none";
    document.getElementById("home-screen").style.display = "block";
});

function showTopicScreen() {
    document.getElementById("home-screen").style.display = "none";
    document.getElementById("setup-screen").style.display = "block";
    document.getElementById("selected-subject").textContent = selectedSubject;
    document.getElementById("available-count").textContent = `Questions Available: ${questions.length}`;

    const topics = [... new Set(questions.map(q => q.topic))];
    const topicList = document.getElementById("topic-list");

    topics.forEach(topic => {topicList.innerHTML += `<label><input type="checkbox" class="topic-checkbox" value="${topic}" checked> ${topic}</label><br>`;});

    document.querySelectorAll(".topic-checkbox").forEach(checkbox => {checkbox.addEventListener("change", updateAvailableCount);});

    updateAvailableCount();
}

function updateAvailableCount() {
    const selectedTopics = Array.from(document.querySelectorAll(".topic-checkbox:checked")).map(checkbox => checkbox.value);
    const availableQuestions = questions.filter(q => selectedTopics.includes(q.topic));

    document.getElementById("available-count").textContent = `Questions Available: ${availableQuestions.length}`;
}