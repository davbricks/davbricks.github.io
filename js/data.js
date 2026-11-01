//data.js

async function loadSubjectQuestions(){
    console.log("Selected:", selectedSubject);

    console.log("Path: ", subjectFiles[selectedSubject]);
    
    const response = await fetch (subjectFiles[selectedSubject]);

    console.log("Response: ", response.status);

    questions = await response.json();

    console.log("Loaded", questions);
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