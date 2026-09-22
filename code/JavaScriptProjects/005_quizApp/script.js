document.addEventListener("DOMContentLoaded", ()=>{
    const startBtn = document.getElementById("start-btn");
    const nextBtn = document.getElementById("next-btn");
    const restartBtn = document.getElementById("restart-btn");
    const questionContainer = document.getElementById("question-container");
    const questionText = document.getElementById("question-text");
    const choicesList = document.getElementById("choices-list");
    const resultContainer = document.getElementById("result-container");
    const scoreDisplay = document.getElementById("score");

    const questions = [
      {
        question: "What is the capital of France?",
        choices: ["Paris", "London", "Berlin", "Madrid"],
        answer: "Paris",
      },

      {
        question: "Which planet is known as the Red Planet?",
        choices: ["Mars", "Venus", "Jupiter", "Saturn"],
        answer: "Mars",
      },

      {
        question: "Who wrote 'Hamlet'?",
        choices: [
          "Charles Dickens",
          "Jane Austen",
          "William Shakespeare",
          "Mark Twain",
        ],
        answer: "William Shakespeare",
      },

      {
        question: "Which is the largest ocean on Earth?",
        choices: [
          "Atlantic Ocean",
          "Indian Ocean",
          "Pacific Ocean",
          "Arctic Ocean",
        ],
        answer: "Pacific Ocean",
      },

      {
        question: "Which country is known as the Land of the Rising Sun?",
        choices: ["China", "Japan", "South Korea", "Thailand"],
        answer: "Japan",
      },

      {
        question: "What is the largest mammal in the world?",
        choices: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        answer: "Blue Whale",
      },

      {
        question: "Who was the first person to walk on the Moon?",
        choices: [
          "Buzz Aldrin",
          "Neil Armstrong",
          "Yuri Gagarin",
          "Michael Collins",
        ],
        answer: "Neil Armstrong",
      },

      {
        question:
          "Which is the longest river in the world traditionally listed in many general-knowledge references?",
        choices: [
          "Amazon River",
          "Nile River",
          "Yangtze River",
          "Mississippi River",
        ],
        answer: "Nile River",
      },

      {
        question: "How many continents are there on Earth?",
        choices: ["5", "6", "7", "8"],
        answer: "7",
      },

      {
        question:
          "Which gas do plants primarily absorb from the atmosphere for photosynthesis?",
        choices: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        answer: "Carbon Dioxide",
      },
    ];


    let currentQuestionIndex=0;
    let score=0;
    let questionAnswered=false;

    startBtn.addEventListener('click',startQuiz);

    

    nextBtn.addEventListener('click',()=>{
        currentQuestionIndex++;
        if(currentQuestionIndex < questions.length){
            showQuestion();
        }
        else{
            showResult();
        }
    });

    restartBtn.addEventListener('click', ()=>{
        currentQuestionIndex=0;
        score=0;
        resultContainer.classList.add('hidden');
        startQuiz();
    });

    function startQuiz(){
        startBtn.classList.add('hidden');
        resultContainer.classList.add('hidden');
        questionContainer.classList.remove('hidden');
        showQuestion();
    }

    function showQuestion(){
        nextBtn.classList.add('hidden');
        questionAnswered=false;
        questionText.textContent= questions[currentQuestionIndex].question;
        choicesList.innerHTML=""; //clear previous choices
        const choices = [...questions[currentQuestionIndex].choices];
        choices.sort(() => Math.random() - 0.5);
        choices.forEach((choice) => {
            const li = document.createElement("li");
            li.textContent = choice;
            li.addEventListener("click", () => selectAnswer(choice, li));
            choicesList.appendChild(li);
        });
    }

    function selectAnswer(choice, selectedLi){
        if(questionAnswered){
            return;
        }
        questionAnswered=true;
        const correctAnswer=questions[currentQuestionIndex].answer;

        if(choice===correctAnswer){
            score++;
            selectedLi.classList.add("correct");
        }
        else{
            selectedLi.classList.add("wrong");
        }
        nextBtn.classList.remove('hidden');
        nextBtn.focus();
        
    }

    function showResult() {
      questionContainer.classList.add("hidden");
      resultContainer.classList.remove("hidden");

      scoreDisplay.textContent = `${score} out of ${questions.length}`;
    }




});