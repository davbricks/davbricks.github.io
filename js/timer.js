const QUESTION_TIME = 10;

function startQuestionTimer(){
    clearInterval(timer);

    timerElement.style.color = "#001e4d";

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

        fillFeedback.innerHTML = `Time's up <br>Correct answer: <strong>${currentQuestion.answer}</strong>`;
        fillFeedback.className = "incorrect";
        fillFeedback.style.display = "block";
    }
    else if (currentQuestion.type === "multiselect"){
        submitMulti.disabled = true;
        
        document.querySelectorAll(".multi-answer").forEach(box => {box.disabled = true;})

        const correctAnswers = currentQuestion.answers.filter(a => a.correct).map(a => a.text);
        
        fillFeedback.innerHTML = `Time's up!<br>Correct answers:<strong>${correctAnswers.join(", ")}</strong>`;
        fillFeedback.className = "incorrect";
        fillFeedback.style.display = "block";
    }
    else{
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

function startQuizTimer() {

    clearInterval(timer);

    timerElement.style.color = "#001e4d";

    timerElement.style.color = "";

    // Display initial time immediately
    const initialMinutes = Math.floor(totalQuizTime / 60);

    const initialSeconds = totalQuizTime % 60;

    timerElement.textContent = `Exam Time: ${initialMinutes}:${initialSeconds.toString().padStart(2, "0")}`;

    timer = setInterval(() => {

        totalQuizTime--;

        const minutes =Math.floor(totalQuizTime / 60);
        const seconds = totalQuizTime % 60;

        timerElement.textContent = `Exam Time: ${minutes}:${seconds.toString().padStart(2, "0")}`;

        // Warning colour in final minute
        if (totalQuizTime <= 60) {
            timerElement.style.color = "red";
        }

        if (totalQuizTime <= 0) {

            clearInterval(timer);

            timerElement.innerHTML = "<strong>EXAM OVER</strong>";

            showScore();
        }

    }, 1000);
}