let selectedSubject = "";

const subjectButtons = document.querySelectorAll(".subject-btn");

subjectButtons.forEach(button => {
    button.addEventListener("click", () => {
        subjectButtons.forEach(btn => btn.classList.remove("selected"));

        button.classList.add("selected");

        selectedSubject = button.dataset.subject
        
        console.log(selectedSubject);

        startButton.disabled = false;
    })
})

const startButton = document.getElementById("start-btn");
const quizScreen = document.querySelector(".quiz");

startButton.addEventListener("click", startSelectedQuiz);

let questions = [];
let quizQuestions = [];

const questionCounter = document.getElementById("question-counter");
const progressBar = document.getElementById("progress-bar");

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

const fillContainer = document.getElementById("fill-blank-container");
const fillAnswer = document.getElementById("fill-answer");
const submitFill = document.getElementById("submit-fill");

const fillFeedback = document.getElementById("fill-feedback");

submitFill.addEventListener("click",checkFillAnswer);

fillAnswer.addEventListener("keypress",function(e){
    if(e.key === "Enter"){
        checkFillAnswer();
    }
});

const timerElement = document.getElementById("timer");

let timer;
let timeLeft;

const QUESTION_TIME = 3;

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

async function loadSubjectQuestions(){
    console.log("Selected:", selectedSubject);

    console.log("Path: ", subjectFiles[selectedSubject]);
    
    const response = await fetch (subjectFiles[selectedSubject]);

    console.log("Response: ", response.status);

    questions = await response.json();

    console.log("Loaded", questions);
}

function showQuestion(){
    resetState();

    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;

    let currentQuestion = quizQuestions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    if (!currentQuestion){
        console.error("No equstion found", currentQuestionIndex, quizQuestions);
    }

    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

    progressBar.style.width=`${progress}%`;

    if(currentQuestion.type === "fillblank"){
        answerButtons.style.display = "none";

        fillContainer.style.display = "block";

        fillAnswer.value = "";
    }else{
        fillContainer.style.display = "none";

        answerButtons.style.display = "flex";

        currentQuestion.answers.sort(() => Math.random() - 0.5);

        currentQuestion.answers.forEach(answer => {
            const button = document.createElement("button");

            button.innerHTML = answer.text;

            button.classList.add("btn");

            if(answer.correct){
                button.dataset.correct = answer.correct;
            }

            button.addEventListener("click",selectAnswer);

            answerButtons.appendChild(button);
        });
    }

    startTimer();
}

function resetState(){
    nextButton.style.display = "none";

    fillAnswer.disabled = false;
    submitFill.disabled = false;

    fillAnswer.value = "";
    fillAnswer.style.border = "";

    fillFeedback.textContent = "";
    fillFeedback.style.display = "none";

    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }

    fillFeedback.textContent = "";
    fillFeedback.style.display = "none";
    fillAnswer.classList = "";
}

function selectAnswer(e){

    clearInterval(timer);

    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    }else{
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    })
    nextButton.style.display = "block";
}

function showScore(){
    
    clearInterval(timer);

    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${quizQuestions.length}!`;
    nextButton.innerHTML = "Play again";
    nextButton.style.display = "block";
}

function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < quizQuestions.length){
        showQuestion();
    }else{
        showScore();
    }
}

nextButton.addEventListener("click", ()=>{
    if(currentQuestionIndex < quizQuestions.length){
        handleNextButton();
    }else{
        startQuiz();
    }
})

function startTimer(){
    clearInterval(timer);

    timeLeft = QUESTION_TIME;
    timerElement.textContent = `Time Left: ${timeLeft}s`;

    timerElement.classList.remove("warning");

    timer = setInterval (() => {
        timeLeft--;

        timerElement.textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 5){
            timerElement.classList.add("warning");
        }

        if (timeLeft <= 0){
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

function timeUp(){
    const currentQuestion = quizQuestions[currentQuestionIndex];

    if(currentQuestion.type === "fillblank"){
        fillAnswer.disabled = true;
        submitFill.disabled = true;

        fillFeedback.innerHTML = `Time's up <br>Correct answer: <strong>${currentQuestion.answer}</strong>`
        fillFeedback.className = "incorrect";
        fillFeedback.style.display = "block";
    } else{
        Array.from(answerButtons.children).forEach(button => {
            if(button.dataset.correct === "true"){
                button.classList.add("correct");
            }

            timerElement.innerHTML = `<strong>TIME'S UP!</strong>`
            timerElement.style.color = "red";
            button.disabled = true;
        })

        nextButton.style.display = "block";
    }

    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true"){
            button.classList.add("correct");
        }

        button.disabled = true;
    });

    nextButton.style.display = "block";
}

function shuffleArray(array){
    for (let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createQuiz(){
    
    console.log("Selected subject:", selectedSubject);
    console.log("Questions loaded: ", questions);
    
    const filteredQuestions = questions.filter(q => q.subject === selectedSubject);

    console.log("Filtered Questions: ", filteredQuestions);

    shuffleArray(filteredQuestions);

    quizQuestions = filteredQuestions.slice(0, Math.min(20, filteredQuestions.length));

    console.log("Quiz questions:", quizQuestions);
}

async function startSelectedQuiz(){
    console.log("Starting quiz for:", selectedSubject);
    
    if (!selectedSubject){
        alert("Please select a module.");

        return;
    }

    await loadSubjectQuestions();

    createQuiz();

    document.querySelector(".subject-buttons").style.display = "none";

    startButton.style.display = "none";
    quizScreen.style.display = "block";

    startQuiz();
}

function checkFillAnswer(){
    if (fillAnswer.disabled){
        return;
    } 

    const currentQuestion =
        quizQuestions[currentQuestionIndex];

    const userAnswer =
        fillAnswer.value.trim().toLowerCase();

    const correctAnswer =
        currentQuestion.answer.trim().toLowerCase();

    if (userAnswer === correctAnswer) {

        score++;

        fillAnswer.style.border = "2px solid green";
        fillFeedback.textContent = "Correct!";
        fillFeedback.className = "correct";
        fillFeedback.style.display = "block";

    } else {

        fillAnswer.style.border = "2px solid red";
        fillFeedback.innerHTML = `The correct answer was:<br> <strong>${currentQuestion.answer}</strong>`;
        fillFeedback.className = "incorrect";
        fillFeedback.style.display = "block";
    }

    fillAnswer.disabled = true;
    nextButton.style.display = "block";
}