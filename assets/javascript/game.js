var randomWord;
var wordHash;
var opportunities;
var lettersGuessedRight;
var lettersGuessedWrong;
var gameActive;
var wins = 0;
var loses = 0;

function getRandomWord() {
    var wordRepository = [
        "turtle", "tortoise", "chameleon", "iguana", "boa", "anaconda", "mamba", "python", "viper", "rattlesnake", "crocodile", "alligator", "gecko"];

    var randomIndex = Math.floor((Math.random() * 100));
    randomIndex = randomIndex % wordRepository.length;
    var randomWord = wordRepository[randomIndex];

    return randomWord;
}

function parseWord(randomWord) {
    var wordArray = {};
    for (var i = 0; i < randomWord.length; i++) {
        var letter = randomWord.charAt(i);
        if (!wordArray[letter]) {
            var positionList = [];
            wordArray[letter] = positionList;
        }
        wordArray[letter].push(i);
    }
    return wordArray;
}

function displayLetterNotInWord(letter) {
    var lettersGuessed = document.getElementById('lettersChosen');

    var letterGuessed = document.createElement('span');

    letterGuessed.textContent = letter + " ";
    lettersGuessed.appendChild(letterGuessed);
}

function cleanGame() {
    opportunities = 7;
    lettersGuessedRight = 0;
    lettersGuessedWrong = [];

    //clean all variable spaces
    var wordHtml = document.getElementById('wordToGuess');
    wordHtml.textContent = "";

    var lettersHtml = document.getElementById('lettersChosen');
    lettersHtml.textContent = "";

    displayImage("hangman");
}

function displaySpacesForWord() {

    var wordHtml = document.getElementById('wordToGuess');

    //display spaces for word
    for (var i = 0; i < randomWord.length; i++) {
        var letterSpace = document.createElement('span');
        letterSpace.setAttribute("id", "letter" + i);
        letterSpace.style.fontSize = "200%"
        letterSpace.setAttribute("zIndex", "2");
        letterSpace.textContent = "_";
        wordHtml.appendChild(letterSpace);
    }
}

function displayImage(type) {

    if (type == "word") {
        document.body.style.backgroundImage = "url('assets/images/" + randomWord + ".jpg')";
    }

    if (type == "hangman") {
        document.getElementById("hangmanImg").src = "assets/images/hangman" + opportunities + ".png";
    }

    if (type == "winner") {
        document.getElementById("hangmanImg").src = "assets/images/winner.jpg";
    }
}


function updateScore() {
    var opportunitiesHtml = document.getElementById('opportunitiesLeft');
    var winsHtml = document.getElementById('wins');
    var losesHtml = document.getElementById('loses');

    if (opportunities > 0) {
        opportunitiesHtml.textContent = opportunities;
    } else {
        opportunitiesHtml.textContent = "You lost!"
        gameActive = false;
        loses++;
    }

    //Winner
    if (lettersGuessedRight == randomWord.length) {
        displayImage("winner");
        // window.speechSynthesis.speak(new SpeechSynthesisUtterance(randomWord)); 
        gameActive = false;
        wins++;  
        opportunitiesHtml.textContent = "You won!"
    }

    winsHtml.textContent = wins;
    losesHtml.textContent = loses;
}

function startGame() {

    cleanGame();
    gameActive = true;
  

    //Generate random word
    randomWord = getRandomWord();
    wordHash = parseWord(randomWord);
    displayImage("word");

    updateScore();

    displaySpacesForWord();

}



document.onkeypress = function (event) {

    var userGuess = event.key.toLowerCase();
    // window.speechSynthesis.speak(new SpeechSynthesisUtterance(userGuess));

    if (!gameActive || !(/^[a-z]$/.test(userGuess)))
        return;

    //look for word in hash table to retrieve positions
    var positionList = wordHash[userGuess];

    if (positionList) {
        for (var i = 0; i < positionList.length; i++) {
            var space = document.getElementById('letter' + positionList[i]);
            space.textContent = userGuess;
            lettersGuessedRight++;
        }
        wordHash[userGuess] = [];
    } else if (!(lettersGuessedWrong.includes(userGuess))) {

        opportunities--;
        lettersGuessedWrong.push(userGuess);
        displayLetterNotInWord(userGuess);
        displayImage("hangman");
    }

    updateScore();

}
