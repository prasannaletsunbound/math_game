var questionNumber = 1;
var score = 0;
var currentQuestion;

function generateQuestion() {
  var operand1 = Math.floor(Math.random() * 100) + 1;
  var operand2 = Math.floor(Math.random() * 100) + 1;
  var operator = getRandomOperator();
  var answer = evaluateExpression(operand1, operator, operand2);

  var options = generateOptions(answer);

  return {
    question:
      questionNumber +
      ") " +
      operand1 +
      " " +
      operator +
      " " +
      operand2 +
      " = ?",
    answer: answer,
    options: options
  };
}

// Generate the options array
function generateOptions(answer) {
  var options = [];
  options.push(answer);

  while (options.length < 4) {
    var option = generateRandomOption(answer);
    if (!options.includes(option)) {
      options.push(option);
    }
  }

  shuffleArray(options);
  return options;
}

// Generate a random option near the answer
function generateRandomOption(answer) {
  var min = answer - 20;
  var max = answer + 20;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shuffle the elements of an array
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

// Get a random operator (+, -, *, /)
function getRandomOperator() {
  var operators = ["+", "-", "*", "/"];
  var randomIndex = Math.floor(Math.random() * operators.length);
  return operators[randomIndex];
}

// Evaluate the expression based on the operator
function evaluateExpression(operand1, operator, operand2) {
  switch (operator) {
    case "+":
      return operand1 + operand2;
    case "-":
      return operand1 - operand2;
    case "*":
      return operand1 * operand2;
    case "/":
      return operand1 / operand2;
    default:
      return NaN;
  }
}

// Display the question and options on the page
function displayQuestion() {
  var questionContainer = document.getElementById("question-container");
  currentQuestion = generateQuestion();
  var questionText = currentQuestion.question;
  var options = currentQuestion.options;

  var html = '<div class="question">' + questionText + "</div>";
  html += '<div class="options">';
  for (var i = 0; i < options.length; i++) {
    html +=
      '<div class="option" onclick="selectOption(this)"><input type="radio" name="option" value="' +
      options[i] +
      '">' +
      options[i] +
      "</div>";
  }
  html += "</div>";

  questionContainer.innerHTML = html;
}

// Select the chosen option
function selectOption(option) {
  var selectedOption = option.querySelector("input");
  selectedOption.checked = true;

  checkAnswer(selectedOption);
}

// Check the player's answer and update the score
function checkAnswer(selectedOption) {
  var answer = parseFloat(selectedOption.value);
  var correctAnswer = currentQuestion.answer;

  var optionElements = document.getElementsByClassName("option");
  for (var j = 0; j < optionElements.length; j++) {
    optionElements[j].classList.remove("correct", "incorrect");
    if (
      parseFloat(optionElements[j].querySelector("input").value) ===
      correctAnswer
    ) {
      optionElements[j].classList.add("correct");
      if (
        parseFloat(optionElements[j].querySelector("input").value) === answer
      ) {
        score++;
      }
    } else if (optionElements[j].querySelector("input").checked) {
      optionElements[j].classList.add("incorrect");
      optionElements[j].querySelector("input").checked = false; // Uncheck the incorrect option
    }
  }

  questionNumber++;
  document.getElementById("score").innerHTML = "Score: " + score;

  if (questionNumber <= 10) {
    setTimeout(displayQuestion, 1000);
  } else {
    document.getElementById("result").innerHTML = "Quiz completed!<br>";
    document.getElementById("result").innerHTML +=
      "Your Score: " + score + "<br>";

    if (score > 7) {
      document.getElementById("result").innerHTML +=
        "Congratulations! You win!";
      document.getElementById("award-img").src = "./images/img.gif"; // Replace with the URL of the award cup image
    } else {
      document.getElementById("result").innerHTML +=
        "You didn't score high enough to win.";
    }

    var answerKeyContainer = document.getElementById("answer-key");
    answerKeyContainer.innerHTML = "<h3>Answer Key:</h3>";

    for (var k = 1; k <= 10; k++) {
      var question = generateQuestion();
      answerKeyContainer.innerHTML +=
        "<p>" +
        k +
        ". " +
        question.question +
        "<br>" +
        " Answer: " +
        question.answer +
        "<br>" +
        "</p>";
    }

    document.getElementById("question-container").innerHTML = ""; // Remove the question container
  }
}

displayQuestion();
