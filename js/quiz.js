//quiz.js

function startQuiz(){
    hideHomeButton();
    
    quizResults = [];

    submitMulti.disabled = false;

    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";

    if (selectedTimerMode === "mock") {
        totalQuizTime = quizQuestions.length * 30;

        startQuizTimer();
    }

    showQuestion();
}

function showQuestion(){
    resetState();

    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;

    let currentQuestion = quizQuestions[currentQuestionIndex];

    if (!currentQuestion){
        console.error("No question found", currentQuestionIndex, quizQuestions);
        return;
    }

    if (currentQuestion.answers){
        currentQuestion.answers.sort(() => Math.random() - 0.5);
    }

    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

    progressBar.style.width=`${progress}%`;

    if(currentQuestion.type === "fillblank"){
        answerButtons.style.display = "none";

        fillContainer.style.display = "block";

        fillAnswer.value = "";
    }
    else if (currentQuestion.type === "multiselect"){
        answerButtons.style.display = "none";
        fillContainer.style.display = "none";

        multiContainer.style.display = "block";
        submitMulti.style.display = "block";

        currentQuestion.answers.forEach(answer => {
            const label = document.createElement ("label");

            label.innerHTML = `<input type="checkbox" class="multi-answer" value="${answer.text}" data-correct="${answer.correct}"> <span>${answer.text}</span>`;

            multiContainer.appendChild(label);
            multiContainer.appendChild(document.createElement("br"));
        })
    }
    else{
        fillContainer.style.display = "none";

        answerButtons.style.display = "flex";

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

    if (selectedTimerMode === "revision") {
        startQuestionTimer();
    }
}

function resetState(){
    nextButton.style.display = "none";

    fillAnswer.disabled = false;
    submitFill.disabled = false;

    submitMulti.disabled = false;

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

    multiContainer.innerHTML = "";
    submitFill.style.display = "none";

    document.querySelectorAll(".multi-answer").forEach(box => {box.disabled = false;});
    submitMulti.style.display = "none";
    multiContainer.style.display = "none";
}

function selectAnswer(e){
    if (selectedTimerMode === "revision") {
        clearInterval(timer);
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answers.find(a => a.correct).text;

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

    quizResults.push({
        question: currentQuestion.question,
        userAnswer: selectedBtn.innerText,
        correctAnswer: correctAnswer,
        correct: isCorrect
    });
}

function checkFillAnswer(){
    if (fillAnswer.disabled){
        return;
    } 

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const userAnswer = fillAnswer.value.trim().toLowerCase();
    const correctAnswer = currentQuestion.answer.trim().toLowerCase();

    quizResults.push({
        question: currentQuestion.question,
        userAnswer: fillAnswer.value,
        correctAnswer: currentQuestion.answer,
        correct: userAnswer === correctAnswer
    });

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

    if (selectedTimerMode === "revision") {
        clearInterval(timer);
    }
}

function showScore(){
    clearInterval(timer);
    resetState();
    
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const incorrectQuestions = quizResults.filter(result => !result.correct);

    questionElement.innerHTML = `<h1><strong>Quiz Complete</strong></h1>
    <p>Score: ${score}/${quizQuestions.length}</p>
    <p>Percentage: ${percentage}%</p>
    <p>Correct: ${score}</p>
    <p>Incorrect: ${quizQuestions.length - score}</p>
    <h3 class="review-heading">Questions to Review</strong></h3>`;

    if (incorrectQuestions.length === 0){
        questionElement.innerHTML += `<div class="perfect-score"><p>🎉 Perfect score! No questions require review.</p></div>`
    }
    else {
        incorrectQuestions.forEach(result => {
            questionElement.innerHTML += `<div class="review-item">
                <p>
                    ${result.question}
                </p>

                <p>
                    <span class="incorrect-answer">
                        Your answer:
                    </span>
                    ${result.userAnswer}
                </p>

                <p>
                    <span class="correct-answer">
                        Correct answer:
                    </span>
                    ${result.correctAnswer}
                </p>
            </div>`;
                });
    }

    nextButton.innerHTML = "Play again";
    nextButton.style.display = "block";
    homeButton.style.display = "block";
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

async function startSelectedQuiz(){
    selectedTimerMode = document.querySelector(`input[name="timer-mode"]:checked`).value;
    console.log("Starting quiz for:", selectedSubject);

    if (!selectedSubject){
        alert("Please select a module.");

        return;
    }

    await loadSubjectQuestions();

    selectedTopics = Array.from(document.querySelectorAll(".topic-checkbox:checked")).map(checkbox => checkbox.value);
    selectedQuestionCount = questionCount.value;

    if (selectedTopics.length === 0) {
        alert("Please select at least one topic.");

        return;
    }

    createQuiz();

    document.getElementById("setup-screen").style.display = "none";
    quizScreen.style.display = "block";

    startQuiz();
}

function returnHome() {
    quizScreen.style.display = "none";
    document.getElementById("setup-screen").style.display = "none";
    document.getElementById("home-screen").style.display = "block";
    homeButton.style.display = "none";
    nextButton.style.display = "none";
    questionElement.innerHTML = "";

    selectedSubject = "";
    selectedTopics = [];

    subjectButtons.forEach(button => button.classList.remove("selected"));

    questionCounter.textContent = "";
    progressBar.style.width = "0%";
    timerElement.textContent = "";

    document.getElementById("topic-list").innerHTML = "";
}

function hideHomeButton(){
    homeButton.style.display = "none";
}

    homeButton.addEventListener("click", returnHome);

    startButton.addEventListener("click", startSelectedQuiz);

    submitFill.addEventListener("click", checkFillAnswer);

    fillAnswer.addEventListener("keypress", function(e){
        if(e.key === "Enter"){
            checkFillAnswer();
        }

    }
);

function checkMultiAnswer(){
    console.log("Muiltiselect submitted");

    if (selectedTimerMode === "revision") {
        clearInterval(timer);
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const selectedAnswers = Array.from(document.querySelectorAll(".multi-answer:checked")).map(box => box.value);
    const correctAnswers = currentQuestion.answers.filter(a => a.correct).map(a => a.text);
    const isCorrect = selectedAnswers.length === correctAnswers.length && selectedAnswers.every(answer => correctAnswers.includes(answer));

    if (selectedAnswers.length === 0){
        fillFeedback.textContent = "Please select at least one answer.";

        fillFeedback.className = "incorrect";
        fillFeedback.style.display = "block";

        return;
    }

    quizResults.push({
        question: currentQuestion.question,
        userAnswer: selectedAnswers.length ? selectedAnswers.join(", "): "No answer selected",
        correctAnswer: correctAnswers.join(", "),
        correct: isCorrect
    });

    if(isCorrect){
        score++

        fillFeedback.textContent = "Correct!";
        fillFeedback.className = "correct";
    }
    else{
        fillFeedback.innerHTML = `Incorrect<br>Correct answers: <strong>${correctAnswers.join(", ")}</strong>`;
        fillFeedback.className = "incorrect";
    }

    fillFeedback.style.display = "block";
    submitMulti.disabled = true;
    nextButton.style.display = "block";
}

submitMulti.addEventListener("click", checkMultiAnswer);