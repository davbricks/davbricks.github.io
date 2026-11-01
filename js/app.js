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

startButton.disabled = true;

let questions = [];
let quizQuestions = [];
let quizResults = [];

let selectedSubject = "";

let currentQuestionIndex = 0;
let score = 0;

let timer;
let timeLeft;

const subjectFiles = {
    "Ground Engineering":
        "questions/ground-engineering.json",

    "Analysis of Structures":
        "questions/structures-analysis.json",

    "Structural Design & Detailing":
        "questions/structural-design.json"
};

subjectButtons.forEach(button => {

    button.addEventListener("click", () => {

        subjectButtons.forEach(btn => btn.classList.remove("selected"));

        button.classList.add("selected");

        selectedSubject = button.dataset.subject;

        startButton.disabled = false;
    });
});