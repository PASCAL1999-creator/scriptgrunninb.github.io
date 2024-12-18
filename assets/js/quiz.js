const quizCategories = {
    cultuur: [
        {
            question: "Wat is de bijnaam van FC Groningen?",
            options: ["De Trots van het Noorden", "De Groene Draak", "De Noorderlingen", "De Stadjes"],
            correct: 0
        },
        {
            question: "Welk bekend muziekpodium bevindt zich aan de Oosterstraat?",
            options: ["Vera", "Simplon", "De Oosterpoort", "Het Grand Theatre"],
            correct: 0
        },
        {
            question: "Welk jaarlijks evenement vindt plaats in augustus op de Grote Markt?",
            options: ["Noorderzon", "KEI-week", "Groninger Studenten Cabaret Festival", "Winterwelvaart"],
            correct: 0
        },
        {
            question: "Welke bekende Nederlandse band komt uit Groningen?",
            options: ["De Dijk", "Golden Earring", "Herman Brood & His Wild Romance", "Normaal"],
            correct: 2
        }
    ],
    geschiedenis: [
        {
            question: "Wanneer werd de Martinitoren voltooid?",
            options: ["1482", "1548", "1627", "1692"],
            correct: 1
        },
        {
            question: "Wat was de belangrijkste reden voor de bouw van het Academiegebouw?",
            options: ["300-jarig bestaan RUG", "Afbrandend vorig gebouw", "Groeiend studentenaantal", "Koninklijk bezoek"],
            correct: 1
        },
        {
            question: "Welke belangrijke slag vond plaats in 1594?",
            options: ["Slag bij Heiligerlee", "Reductie van Groningen", "Beleg van Groningen", "Val van Delfzijl"],
            correct: 1
        },
        {
            question: "Wanneer werd de Rijksuniversiteit Groningen opgericht?",
            options: ["1614", "1636", "1575", "1648"],
            correct: 0
        }
    ],
    dialect: [
        {
            question: "Wat betekent 'moi'?",
            options: ["Hallo/Dag", "Mooi", "Kom hier", "Tot ziens"],
            correct: 0
        },
        {
            question: "Wat is een 'wichter'?",
            options: ["Meisje", "Jongen", "Kind", "Baby"],
            correct: 0
        },
        {
            question: "Wat betekent 'Ain moal is gain moal'?",
            options: ["Één keer is geen keer", "Eens maar nooit weer", "Eerste keer is gratis", "Alleen is maar alleen"],
            correct: 0
        },
        {
            question: "Wat betekent 'kloukerd'?",
            options: ["Slim persoon", "Klungel", "Koppig iemand", "Grappig persoon"],
            correct: 0
        }
    ],
    eten: [
        {
            question: "Wat is een 'Groninger koek'?",
            options: ["Kruidkoek", "Ontbijtkoek", "Peperkoek", "Suikerkoek"],
            correct: 0
        },
        {
            question: "Welk traditioneel Gronings gerecht wordt gemaakt van karnemelk?",
            options: ["Kruudmoes", "Spekdikken", "Poffert", "Kniepertjes"],
            correct: 0
        },
        {
            question: "Wat is het hoofdingrediënt van 'Groninger Mollebonen'?",
            options: ["Tuinbonen", "Bruine bonen", "Kapucijners", "Witte bonen"],
            correct: 0
        },
        {
            question: "Welk typisch Gronings drankje wordt gemaakt van brandewijn en rozijnen?",
            options: ["Fladderak", "Boerenjongens", "Advocaat", "Elixir"],
            correct: 1
        }
    ]
};

let currentCategory = 'cultuur';
let currentQuestion = 0;
let score = 0;
let selectedOption = null;

// Event listeners voor categorie knoppen
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Update actieve categorie
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Start nieuwe quiz
        currentCategory = button.dataset.category;
        startNewQuiz();
    });
});

function startNewQuiz() {
    currentQuestion = 0;
    score = 0;
    loadQuestion();
}

function loadQuestion() {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const currentQuiz = quizCategories[currentCategory][currentQuestion];

    questionElement.textContent = currentQuiz.question;
    optionsElement.innerHTML = '';

    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement('div');
        button.className = 'quiz-option';
        button.textContent = option;
        button.onclick = () => selectOption(index);
        optionsElement.appendChild(button);
    });

    document.getElementById('result').textContent = '';
    document.getElementById('submit-btn').disabled = false;
}

function selectOption(index) {
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    selectedOption = index;
}

function checkAnswer() {
    if (selectedOption === null) return;

    const options = document.querySelectorAll('.quiz-option');
    const correct = quizCategories[currentCategory][currentQuestion].correct;

    if (selectedOption === correct) {
        score++;
        document.getElementById('result').textContent = 'Correct!';
        options[selectedOption].classList.add('correct');
    } else {
        document.getElementById('result').textContent = 'Helaas, dat is niet juist.';
        options[selectedOption].classList.add('wrong');
        options[correct].classList.add('correct');
    }

    document.getElementById('submit-btn').disabled = true;
    setTimeout(nextQuestion, 2000);
}

function nextQuestion() {
    selectedOption = null;
    currentQuestion++;

    if (currentQuestion < quizCategories[currentCategory].length) {
        loadQuestion();
    } else {
        showFinalScore();
    }
}

function showFinalScore() {
    const quizElement = document.getElementById('quiz');
    quizElement.innerHTML = `
        <h3>Quiz Afgelopen!</h3>
        <p id="score">Je score: ${score} van de ${quizCategories[currentCategory].length}</p>
        <button onclick="restartQuiz()" id="submit-btn">Opnieuw Proberen</button>
    `;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedOption = null;
    loadQuestion();
}

// Start de quiz wanneer de pagina is geladen
document.addEventListener('DOMContentLoaded', loadQuestion);
document.getElementById('submit-btn').addEventListener('click', checkAnswer); 

// Functie om een array willekeurig door elkaar te husselen
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Pas de showQuestion functie aan om antwoorden te husselen
function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    
    // Maak een array met alle antwoorden
    let answers = [
        currentQuestion.correct,
        ...currentQuestion.incorrect
    ];
    
    // Hussel de antwoorden
    answers = shuffleArray(answers);
    
    // Maak de opties leeg en voeg gehusselde antwoorden toe
    optionsElement.innerHTML = '';
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.classList.add('quiz-option');
        button.addEventListener('click', selectOption);
        optionsElement.appendChild(button);
    });
    
    // Reset states
    submitButton.style.display = 'none';
    resultElement.textContent = '';
    selectedOption = null;
}

// Rest van de bestaande quiz code... 