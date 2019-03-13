

class Sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function () {
            this.sound.play();
        };
        this.stop = function () {
            this.sound.pause();
        };
    }
}

var game;

function setupGame() {
    game = {
        randomWord: "reptile",
        wordHash: parseWord("reptile"),
        opportunities: 7,
        lettersGuessedRight: [],
        lettersGuessedWrong: [],
        isActive: false,
        wins: 0,
        loses: 0,
        winningSound: new Sound("assets/sounds/Winning-sound-effect.mp3"),
        lostSound: new Sound("assets/sounds/sadtrombone.swf.mp3")
      //  lostSound: new Sound("assets/sounds/You-lose-sound-effect.mp3")
    };

}

function generateRandomWord() {
    var wordRepository = [
        "turtle", "tortoise", "chameleon", "iguana", "boa", "anaconda", "mamba", "python", "viper", "rattlesnake", "crocodile", "alligator", "gecko"];

    var randomIndex = Math.floor((Math.random() * 100));
    randomIndex = randomIndex % wordRepository.length;
    game.randomWord = wordRepository[randomIndex];

    game.wordHash = parseWord();

    return;
}

function parseWord(word = game.randomWord) {
    var wordArray = {};
    for (var i = 0; i < word.length; i++) {
        var letter = word.charAt(i);
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
    game.opportunities = 7;
    game.lettersGuessedRight = 0;
    game.lettersGuessedWrong = [];

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
    for (var i = 0; i < game.randomWord.length; i++) {
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
        document.body.style.backgroundImage = "url('assets/images/" + game.randomWord + ".jpg')";
    }

    if (type == "hangman") {
        document.getElementById("hangmanImg").src = "assets/images/hangman" + game.opportunities + ".png";
    }

    if (type == "winner") {
        document.getElementById("hangmanImg").src = "assets/images/winner.jpg";
    }
}


function updateScore() {
    var opportunitiesHtml = document.getElementById('opportunitiesLeft');
    var winsHtml = document.getElementById('wins');
    var losesHtml = document.getElementById('loses');

    if (game.opportunities > 0) {
        opportunitiesHtml.textContent = game.opportunities;
    } else {
        game.lostSound.play();
        opportunitiesHtml.textContent = "You lost!"
        game.isActive = false;
        game.loses++;
    }

    //Winner
    if (game.lettersGuessedRight == game.randomWord.length) {
        game.winningSound.play();
        displayImage("winner");
        // window.speechSynthesis.speak(new SpeechSynthesisUtterance(game.randomWord)); 
        game.isActive = false;
        game.wins++;
        opportunitiesHtml.textContent = "You won!"
    }

    winsHtml.textContent = game.wins;
    losesHtml.textContent = game.loses;
}

function startGame() {

    cleanGame();
    game.isActive = true;

    generateRandomWord();

    displayImage("word");

    updateScore();

    displaySpacesForWord();

}


document.onkeypress = function (event) {

    var userGuess = event.key.toLowerCase();
    // window.speechSynthesis.speak(new SpeechSynthesisUtterance(userGuess));

    if (!game.isActive || !(/^[a-z]$/.test(userGuess)))
        return;

    //look for word in hash table to retrieve positions
    var positionList = game.wordHash[userGuess];

    if (positionList) {
        for (var i = 0; i < positionList.length; i++) {
            var space = document.getElementById('letter' + positionList[i]);
            space.textContent = userGuess;
            game.lettersGuessedRight++;
        }
        game.wordHash[userGuess] = [];
    } else if (!(game.lettersGuessedWrong.includes(userGuess))) {

        game.opportunities--;
        game.lettersGuessedWrong.push(userGuess);
        displayLetterNotInWord(userGuess);
        displayImage("hangman");
    }

    updateScore();

}
