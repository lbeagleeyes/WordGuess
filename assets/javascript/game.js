

class Sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    play() {
        this.sound.play();
    }
    stop() {
        this.sound.pause();
    }
}

class Game {
    constructor() {
        this.randomWord = "";
        this.wordHash = {};
        this.opportunities = 7;
        this.lettersGuessedRight = [];
        this.lettersGuessedWrong = [];
        this.isActive = false;
        this.wins = 0;
        this.loses = 0;
        this.winningSound = new Sound("assets/sounds/Winning-sound-effect.mp3");
        this.lostSound = new Sound("assets/sounds/sadtrombone.swf.mp3");
    }

    reset() {
        this.opportunities = 7;
        this.lettersGuessedRight = 0;
        this.lettersGuessedWrong = [];
        this.generateRandomWord();
    }

    generateRandomWord() {
        var wordRepository = [
            "turtle", "tortoise", "chameleon", "iguana", "boa", "anaconda", "mamba", "python", "viper", "rattlesnake", "crocodile", "alligator", "gecko"];
    
        var randomIndex = Math.floor((Math.random() * 100));
        randomIndex = randomIndex % wordRepository.length;
        this.randomWord = wordRepository[randomIndex];
    
        this.wordHash = this.parseWord(this.randomWord);    
    }
    
    parseWord(word) {
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
}

function setupGame() {
    game = new Game();
}


function displayLetterNotInWord(letter) {
    var lettersGuessed = document.getElementById('lettersChosen');

    var letterGuessed = document.createElement('span');

    letterGuessed.textContent = letter + " ";
    lettersGuessed.appendChild(letterGuessed);
}


function resetView() {

    //clean all variable spaces
    var wordHtml = document.getElementById('wordToGuess');
    wordHtml.textContent = "";

    var lettersHtml = document.getElementById('lettersChosen');
    lettersHtml.textContent = "";

    displayImage("hangman");

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

    game.reset();
    game.isActive = true;

    resetView();

    displayImage("word");

    updateScore();
 
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
