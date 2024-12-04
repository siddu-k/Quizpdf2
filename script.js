let timeLeft = 60; // Timer for the quiz
let timerId;
let score = 0;
let pin = "";
let currentQuestionIndex = 0;

// Array of quiz questions
const questions = [
    {
        question: "Which component is considered the brain of a computer?",
        options: ["Hard Disk", "CPU", "RAM", "Power Supply"],
        correctIndex: 1
    },
    {
        question: "What does HTTP stand for?",
        options: [
            "HyperText Transfer Protocol",
            "HyperText Transmission Protocol",
            "HyperText Transfer Process",
            "High Transmission Text Protocol"
        ],
        correctIndex: 0
    },
    {
        question: "Which programming language is primarily used for web development?",
        options: ["Python", "C", "JavaScript", "Java"],
        correctIndex: 2
    },
    {
        question: "Which device is used to connect multiple computers in a network?",
        options: ["Router", "Monitor", "CPU", "Keyboard"],
        correctIndex: 0
    },
    {
        question: "Which of these is an example of system software?",
        options: ["MS Word", "Windows OS", "Chrome Browser", "Photoshop"],
        correctIndex: 1
    }
];

// Display the next question
function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById("question").textContent = currentQuestion.question;

    const optionButtons = document.querySelectorAll(".options button");
    optionButtons.forEach((button, index) => {
        button.textContent = currentQuestion.options[index];
        button.dataset.correct = index === currentQuestion.correctIndex ? "true" : "false";
    });
}

// Show quiz page after entering PIN
function startQuiz() {
    const pinInput = document.getElementById("pin-input").value;
    if (pinInput.trim() === "") {
        alert("Please enter a valid PIN.");
        return;
    }
    pin = pinInput;
    document.getElementById("pin-page").classList.add("hidden");
    document.getElementById("quiz-page").classList.remove("hidden");
    startTimer();
    loadQuestion();
}

// Start countdown timer
function startTimer() {
    timerId = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerId);
            endQuiz();
        } else {
            document.getElementById("time").textContent = --timeLeft;
        }
    }, 1000);
}

// Check answer and move to the next question
function checkAnswer(button) {
    if (button.dataset.correct === "true") {
        score++;
    }
    currentQuestionIndex++;
    loadQuestion();
}

// Show results page and display details
function endQuiz() {
    clearInterval(timerId);
    document.getElementById("quiz-page").classList.add("hidden");
    document.getElementById("result-page").classList.remove("hidden");
    document.getElementById("result-pin").textContent = pin;
    document.getElementById("result-score").textContent = `${score} / ${questions.length}`;
}

// Download results as a PDF
async function downloadResults() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add content to the PDF
    doc.setFontSize(16);
    doc.text("Quiz Results", 20, 20);
    doc.setFontSize(12);
    doc.text(`PIN: ${pin}`, 20, 40);
    doc.text(`Score: ${score} / ${questions.length}`, 20, 60);

    // Add a detailed breakdown of each question
    let yOffset = 80;
    questions.forEach((q, index) => {
        doc.text(`${index + 1}. ${q.question}`, 20, yOffset);
        yOffset += 10;
        doc.text(`Correct Answer: ${q.options[q.correctIndex]}`, 20, yOffset);
        yOffset += 20;

        // Add a new page if content exceeds page height
        if (yOffset > 270) {
            doc.addPage();
            yOffset = 20;
        }
    });

    // Save the PDF
    doc.save(`quiz_results_${pin}.pdf`);
}