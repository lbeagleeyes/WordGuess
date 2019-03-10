var randomWord;
var wordHash;
var opportunities;
var lettersGuessed;

function getRandomWord() {
    var wordRepository = [
        "turtle", "tortoise", "chameleon", "iguana", "boa", "anaconda", "mamba", "python", "viper", "rattlesnake", "crocodile", "alligator", "gecko"];

    var randomIndex = Math.floor((Math.random() * wordRepository.length - 1));
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
    lettersGuessed = 0;
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
        letterSpace.textContent = "_ ";
        wordHtml.appendChild(letterSpace);
    }
}

function displayImage(type) {

    if(type == "word")
    {
         document.body.style.backgroundImage = "url('assets/images/" + randomWord + ".jpg')";
    }

    if(type == "hangman")
    {
        document.getElementById("hangmanImg").src="assets/images/hangman" + opportunities + ".png";
    }

    if(type == "winner")
    {
        document.getElementById("hangmanImg").src="assets/images/winner.jpg";
    }
}

function checkForWinner()
{
    // if (opportunities == 0) {
    //     alert("Loooser!");
    // }

    if (lettersGuessed == randomWord.length) {
        displayImage("winner");
    }
}

function updateOpportunities(){
    var opportunitiesHtml = document.getElementById('opportunitiesLeft');
    opportunitiesHtml.textContent = opportunities;
}

function startGame() {

    cleanGame();
    updateOpportunities();

    //Generate random word
    randomWord = getRandomWord();
    wordHash = parseWord(randomWord);
    displayImage("word");

    displaySpacesForWord();

}



document.onkeyup = function (event) {

    var userGuess = event.key.toLowerCase();
    //look for word in hash table to retrieve positions
    var positionList = wordHash[userGuess];

    if (positionList) {
        for (var i = 0; i < positionList.length; i++) {
            var space = document.getElementById('letter' + positionList[i]);
            space.textContent = userGuess + " ";
            lettersGuessed++;
        }
        wordHash[userGuess] = [];
    } else {
        opportunities--;
        displayLetterNotInWord(userGuess);
        displayImage("hangman");
    }

    updateOpportunities();
    checkForWinner();

}
