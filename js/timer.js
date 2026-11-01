const QUESTION_TIME = 10;

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

        fillFeedback.innerHTML = `Time's up <br>Correct answer: <strong>${currentQuestion.answer}</strong>`;
        fillFeedback.className = "incorrect";
        fillFeedback.style.display = "block";
    }
    else if (currentQuestion.type === "multiselect"){
        submitMulti.disabled = true;
        
        document.querySelectorAll(".multi-answer").forEach(box => {box.disabled = true;})

        const correctAnswers = currentQuestion.answers.filter(a => a.correct).map(a => a.text);
        
        fillFeedback.innerHTML = `Time's up!<br>Correct answers:<strong>${correctAnswers.join(", ")}`;
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