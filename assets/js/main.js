// main.js

import { initializePopup } from './popup.js';
// Call the imported function to initialize the popup functionality
document.addEventListener("DOMContentLoaded", initializePopup);

/**
 * ############################## SCOREBOARD SECTION #####################################
 */

// Retrieve names from Local Storage or initialize an empty array
const usernameArray = JSON.parse(localStorage.getItem("names")) || [];
// Variable declarations
const usernameForm = document.getElementById("nameForm");
const usernameInput = document.getElementById("nameInput");
const usernameList = document.getElementById("nameList");
const addUsername = document.getElementById("add-username");

usernameForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = usernameInput.value;
  const userScore = score; // Get the score from the quiz game
  const userObject = { name, score: userScore }; // Create an object with username and score
  usernameArray.push(userObject);
  usernameInput.value = "";
  addUsername.innerHTML = "Your username and score has been added!";
  updateNameList();
  saveNamesToLocalStorage(); // Save names to Local Storage
});

function updateNameList() {
  usernameList.innerHTML = ""; // Clear the existing content of the usernameList element
  for (const user of usernameArray) {
    const listItem = document.createElement("li"); // Create a new list item element
    listItem.textContent = `${user.name} - Score: ${user.score}`; // Set the text content of the list item to display the user's name and score
    usernameList.appendChild(listItem); // Append the list item to the usernameList element
  }
}

function resetScoreboard() {
  localStorage.clear(); // Clear the local savings on the localStorage
  usernameArray.length = 0; // Clear the array as well
  updateNameList();
}

function saveNamesToLocalStorage() {
  localStorage.setItem("names", JSON.stringify(usernameArray));
}

updateNameList();

// Code copied from flexiple *More detialed in my readme
function currentTime() { // Resets scoreboard/dashboard everyday at 6 PM.
  let date = new Date();
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  let session = "AM";

  if (hh >= 12) {
    session = "PM";
  }

  if (hh === 18 && mm === 0 && ss === 0) {
    resetScoreboard();
  }

  hh = hh > 12 ? hh - 12 : hh;
  hh = hh === 0 ? 12 : hh;
  hh = hh < 10 ? "0" + hh : hh;
  mm = mm < 10 ? "0" + mm : mm;
  ss = ss < 10 ? "0" + ss : ss;

  setTimeout(currentTime, 1000);
}
// Start the currentTime() function
currentTime();

/**
 * ############################## QUIZ GAME SECTION #####################################
 */

// Using destructuring assignment to assign selected elements from the DOM to variables
const [
  mainWrapper,           // Represents the main wrapper element
  quizWrapper,           // Represents the quiz wrapper element
  scoreboardWrapper,     // Represents the scoreboard wrapper element
  questionImage,         // Represents the quiz image element
  questionElement,       // Represents the question element
  questionCounter,       // Represents the question counter element
  questionTimer,         // Represents the question timer element
  answerButtons,         // Represents the answer buttons element
  nextButton,            // Represents the next button element
  backButton,            // Represents the back button element
  highscoreButton,       // Represents the highscore button element
  quizButton,             // Represents the quiz button element
  nameForm
] = [
  ".main-wrapper",       
  "#quiz-wrapper",       
  "#scoreboard-wrapper",
  "#quiz-image",         
  "#question",           
  "#question-counter",   
  ".timer .timer-sec",   
  "#answer-buttons",     
  "#next-btn",           
  "#back-btn",        
  "#show-highscore",     
  "#show-quiz",
  "#nameForm"          
].map(selector => document.querySelector(selector)); // Mapping the selectors to corresponding DOM elements

// Variable declarations for quiz tracking
let currentQuestionIndex = 0; // Keeps track of the current question index
let score = 0; // Stores the score accumulated by the user
let counter;
let timeValue = 30;

function toggleSections(elementToShow, ...elementsToHide) {
  elementToShow.classList.remove("hidden"); // Show the specified element

  for (const element of elementsToHide) {
    element.classList.add("hidden"); // Hide all other specified elements
  }
}

quizButton.addEventListener("click", () => toggleSections(quizWrapper, mainWrapper, scoreboardWrapper));
highscoreButton.addEventListener("click", () => toggleSections(scoreboardWrapper, mainWrapper, quizWrapper));

/**
 * Represents an array of quiz questions, their associated images, and answer options.
 * Each question object contains the question text, image, and an array of answer options.
 * The correct answer option for each question is marked with the property `correct: true`.
 */
const questions = [
  {
    image: "<img src='' alt=''>",
    question: "1. What is the x- intercept of y= 17x + 51?", // Question 1
    answers: [
      { text: "a. 5", correct: false},
      { text: "b. 3", correct: false},
      { text: "c. 14", correct: false},
      { text: "d. -3", correct: true}, // Correct Answer
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "2. What is the area of a triangle with a base of 5 and height of 6?", // Question 2
    answers: [
      { text: "a. 4", correct: false},
      { text: "b. 30", correct: false},
      { text: "c. 60", correct: false},
      { text: "d. 15", correct: true}, // Correct Answer
    ]
  },
  {
    image: "<img src='assets/images/quiz/q3-©©©©©.png' alt='©©©©©'>",
    question: "3. If every © represents 500,000 casualties, how many casualties are represented by this set of symbols?", // Question 3
    answers: [
      { text: "a. 250,000", correct: false},
      { text: "b. 2,500,000", correct: true}, // Correct Answer
      { text: "c. 3,125,000", correct: false},
      { text: "d. 1,000,000", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "4. What is the mode of the following set of numbers? (1,1,2,2,4,5,5,5,7)", // Question 4
    answers: [
      { text: "a. 5", correct: true}, // Correct Answer
      { text: "b. 7", correct: false},
      { text: "c. 4", correct: false},
      { text: "d. 1", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "5. What is the standard deviation of the set of values (2,4,4,4,5,7,9)?", // Question 5
    answers: [
      { text: "a. 2", correct: true}, // Correct Answer
      { text: "b. 7", correct: false},
      { text: "c. 4", correct: false},
      { text: "d. 9", correct: false},
    ]
  },
  {
    image: "<img src='' alt''>",
    question: "6. Given the x³ x = y³, what is y³ equal to if x=4?", // Question 6
    answers: [
      { text: "a. 64", correct: true}, // Correct Answer
      { text: "b. 24", correct: false},
      { text: "c. 16", correct: false},
      { text: "d. 42", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "1. Alexei had ______ over the vast Siberian expanse more than once", // Question 7
    answers: [
      { text: "a. drove", correct: false},
      { text: "b. drived", correct: false},
      { text: "c. driven", correct: true}, // Correct Answer
      { text: "b. been driving", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "2. Johnny ______ ate the cookies by the time we got home.", // Question 8
    answers: [
      { text: "a. all ready", correct: false},
      { text: "b. al ready", correct: false},
      { text: "c. already", correct: true}, // Correct Answer
      { text: "d. readily", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "3. My dad gave Erik and _______ some UAAP season tickets.", // Question 9
    answers: [
      { text: "a. me", correct: true}, // Correct Answer
      { text: "b. I", correct: false},
      { text: "c. them", correct: false},
      { text: "d. us", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "4. Fabio never liked the ancient NECROPOLIS at the outskirts of town", // Question 10
    answers: [
      { text: "a. A large and old cemetery", correct: true}, // Correct Answer
      { text: "b. A city on a hill", correct: false},
      { text: "c. An elevated villa", correct: false},
      { text: "d. A dark city", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "5. The nomadic Mongols lived in YURTS since the days of Genghis khan.", // Question 11
    answers: [
      { text: "a. Tents", correct: true}, // Correct Answer
      { text: "b. Houses", correct: false},
      { text: "c. Caravants", correct: false},
      { text: "d. Wagons", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "6. The Pope appointed a new apostolic NUNCIO to France.", // Question 12
    answers: [
      { text: "a. Bishop", correct: false},
      { text: "b. Cardinal", correct: false},
      { text: "c. Envoy", correct: true}, // Correct Answer
      { text: "d. Prelate", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "1. Life: Death; Coagulate: ______", // Question 13
    answers: [
      { text: "a. Celebrate", correct: false},
      { text: "b. Dissolve", correct: true}, // Correct Answer
      { text: "c. Destroy", correct: false},
      { text: "d. Oppose", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "2. Music: Emotions; Pictures: ______", // Question 14
    answers: [
      { text: "a. Sadness", correct: false},
      { text: "b. Mysteries", correct: false},
      { text: "c. Memories", correct: true}, // Correct Answer
      { text: "d. Creativity", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "3. Fire: Water; Wood: ______", // Question 15
    answers: [
      { text: "a. Tree", correct: false},
      { text: "b. Axe", correct: true}, // Correct Answer
      { text: "c. Fire", correct: false},
      { text: "d. Water", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "4. Journalism: News; ______ : ______", // Question 16
    answers: [
      { text: "a. Engineering : Structures", correct: true}, // Correct Answer
      { text: "b. Mathematics : Equations", correct: false},
      { text: "c. Pencils : Books", correct: false},
      { text: "d. Poets : Laureates", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "5. Policeman: Crime ; ______ : ______", // Question 17
    answers: [
      { text: "a. Broom : Dust", correct: false},
      { text: "b. Fireman : Rescue", correct: true}, // Correct Answer
      { text: "c. Soap : Skin", correct: false},
      { text: "d. Write", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "6. Madrid: Spain; ______ : ______", // Question 18
    answers: [
      { text: "a. New York : U.SA", correct: false},
      { text: "b. Phnom penh : Cambodia", correct: true}, // Correct Answer
      { text: "c. Almaty : Kazakhstan", correct: false},
      { text: "d. Sydney : Australia", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "1. In a solution the substance that does the dissolving is called ________?", // Question 19
    answers: [
      { text: "a. Solubility", correct: false},
      { text: "b. Solute", correct: false},
      { text: "c. Solvent", correct: true}, // Correct Answer
      { text: "d. Ion", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "2. A hydrocarbon that contains one or more double bonds is classified as an ______?", // Question 20
    answers: [
      { text: "a. Alkynes", correct: false},
      { text: "b. Alkenes", correct: true}, // Correct Answer
      { text: "c. Aromatic", correct: false},
      { text: "d. Alkanes", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "3. In a plant, what part stores sugars as starch?", // Question 21
    answers: [
      { text: "a. Leaves", correct: false},
      { text: "b. Roots", correct: false},
      { text: "c. Seeds", correct: false},
      { text: "d. Stem", correct: true}, // Correct Answer
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "4. Protoplasts are cells without ______?", // Question 22
    answers: [
      { text: "a. Nucleus", correct: false},
      { text: "b. Cell membrane", correct: false},
      { text: "c. Cell wall", correct: true}, // Correct Answer
      { text: "d. Cytoplasm", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "5. Which type of plate tectonic boundaries creates rift valley?", // Question 23
    answers: [
      { text: "a. Divergent", correct: true}, // Correct Answer
      { text: "b. Convergent", correct: false},
      { text: "c. Transform", correct: false},
      { text: "d. None of the above", correct: false},
    ]
  },
  {
    image: "<img src='' alt=''>",
    question: "6. Which of the following is the reason why tire explode during summer season.", // Question 24
    answers: [
      { text: "a. The pressure increase and the volume decrease", correct: false},
      { text: "b. the temperature increase and the volume also increase", correct: true}, // Correct Answer
      { text: "c. the volume increase and the pressure also decreased", correct: false},
      { text: "d. the volume decrease and the temperature increase", correct: false},
    ]
  },
  {
    image: "<img src='assets/images/quiz/q1-abstract.png' alt=''>",
    question: "1. Choose the letter that best completes the series.", // Question 25
    answers: [
      { text: "a.", correct: false},
      { text: "b.", correct: false},
      { text: "c.", correct: false},
      { text: "d.", correct: false},
      { text: "e.", correct: true}, // Correct Answer
    ]
  },
  {
    image: "<img src='assets/images/quiz/q2-abstract.png' alt=''>",
    question: "2. Choose the letter that best completes the series.", // Question 26
    answers: [
      { text: "a.", correct: false},
      { text: "b.", correct: false},
      { text: "c.", correct: true}, // Correct Answer
      { text: "d.", correct: false},
      { text: "e.", correct: false},
    ]
  },
  {
    image: "<img src='assets/images/quiz/q3-abstract.png' alt=''>",
    question: "3. Choose the letter that best completes the series.", // Question 27
    answers: [
      { text: "a.", correct: false},
      { text: "b.", correct: false},
      { text: "c.", correct: true}, // Correct Answer
      { text: "d.", correct: false},
      { text: "e.", correct: false},
    ]
  },
  {
    image: "<img src='assets/images/quiz/q4-abstract.png' alt=''>",
    question: "4. Choose the letter that best completes the series.", // Question 28
    answers: [
      { text: "a.", correct: false},
      { text: "b.", correct: true}, // Correct Answer
      { text: "c.", correct: false},
      { text: "d.", correct: false},
      { text: "e.", correct: false},
    ]
  },
  {
    image: "<img src='assets/images/quiz/q5-abstract.png' alt=''>",
    question: "5. Choose the letter that best completes the series.", // Question 29
    answers: [
      { text: "a.", correct: false},
      { text: "b.", correct: false},
      { text: "c.", correct: true}, // Correct Answer
      { text: "d.", correct: false},
      { text: "e.", correct: false},
    ]
  },
  {
    image: "<img src='assets/images/quiz/q6-abstract.png' alt=''>",
    question: "6. Choose the letter that best completes the series.", // Question 30
    answers: [
      { text: "a.", correct: true}, // Correct Answer
      { text: "b.", correct: false},
      { text: "c.", correct: false},
      { text: "d.", correct: false},
      { text: "e.", correct: false},
    ]
  }
];

function startQuiz() {
  currentQuestionIndex = 0; // Reset the current question index to the beginning
  score = 0; // Reset the score to 0
  startTimer(30);
  nextButton.innerHTML = "Next"; // Set the innerHTML of the Next button to "Next"
  backButton.innerHTML = "Back"; // Set the innerHTML of the Back button to "Back"
  answerButtons.innerHTML = ""; // Clear the answer buttons
  showQuestion(); // Display the first question
}

function showQuestion(){ 
  resetState();
  // Retrieves the current question and its corresponding question number, then updates the HTML elements to display them
  let currentQuestion = questions[currentQuestionIndex];
  let questionNumber = currentQuestionIndex + 1;
  questionElement.innerHTML = currentQuestion.question;
  questionCounter.innerHTML = `${questionNumber} of 30 Questions`;
  
  // Set the image source
  questionImage.innerHTML = currentQuestion.image;
  questionImage.classList.add("quiz-image");

    // Populate answer buttons with answer text from the array
    currentQuestion.answers.forEach(answer => {
      const button = document.createElement("button");
      button.innerHTML = answer.text;
      button.classList.add("quiz-btn");
      answerButtons.appendChild(button);
      if(answer.correct){ // .Correct from the array 
        button.dataset.correct = answer.correct;
      }
      button.addEventListener("click", selectAnswer);
    });
}

startQuiz(); // Initializes the quiz by resetting the question index and score

function selectAnswer(event){ // Handles the selection of an answer
  const selectedBtn = event.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  clearInterval(counter);

  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++; // Increment the score by 1 if the answer is correct
  } else {
    selectedBtn.classList.add("incorrect");
  }
  
  // Marks correct answers and disables all buttons
  Array.from(answerButtons.children).forEach(button => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true; // Disable all buttons to prevent further selection
  });

  nextButton.style.display = "block"; // Display the Next button for moving to the next question
}

function showScore(){
  resetState(); 
   // The character "`" (backtick) is used in this code snippet to define a template literal or a template string in JavaScript.  Becomes more readable and easier to work with. 
    if (score === 30){
      questionElement.innerHTML = `You scored ${score} out of ${questions.length}! <br> You are a  true PRO!`;
    }else if (score <=20){
      questionElement.innerHTML = `You scored ${score} out of ${questions.length} <br> Excellent`;
    }else{
      questionElement.innerHTML = `You scored ${score} out of ${questions.length} <br> Better luck next time!`;
    }
    
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
  backButton.style.display = "block";
  questionImage.style.display = "none";
  nameForm.style.display = "block";
  backButton.addEventListener("click", () => toggleSections(mainWrapper, quizWrapper, scoreboardWrapper));
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton(); // Move to the next question if there are more questions
  } else {
    startQuiz(); // Start the quiz again if all questions have been answered
  }
});

function handleNextButton(){ // Handles the click on the Next Button
  currentQuestionIndex++; // Increase the index to move to the next question in the array
  if (currentQuestionIndex < questions.length) { 
    showQuestion(); // Display the next question if there are more questions in the array
    clearInterval(counter);
    startTimer(timeValue);
  } else {
    showScore(); // Display the final score if there are no more questions in the array
  }
}

function startTimer(time){
  counter = setInterval(timer, 1000); 
  function timer(){
    questionTimer.textContent = time; // Updates the content of the 'questionTimer' element with the current 'time' value
    time--; // Decreases the 'time' value by 1 for the next iteration
    if (time <= 5 && time >= 3){
      questionTimer.style.color = "yellow"; // Color Yellow
    }else if (time < 4 && time >= 0){
      questionTimer.style.color = "red"; // Color Red
    }else if (time < 0){
      clearInterval(counter); // Stops the recurring timer
      questionTimer.textContent = "0"; // Updates the content of 'questionTimer' to "0" when 'time' reaches negative values
      handleNextButton(); // Calls the 'handleNextButton' function to automatically move to the next question
    }else{
      questionTimer.style.color = "green"; // Color Green
    }
  }
}


// Reset function
function resetState(){
  nextButton.style.display = "none";
  backButton.style.display = "none";
  nameForm.style.display = "none";
  questionImage.style.display = "block";
  while(answerButtons.firstChild){
    answerButtons.removeChild(answerButtons.firstChild);
  }
  questionCounter.innerHTML = '';
}
