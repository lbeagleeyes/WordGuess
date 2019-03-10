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
    for(var i = 0; i < randomWord.length; i++)
    {
        var letter = randomWord.charAt(i);
        if(!wordArray[letter]){
            var positionList = [];
            wordArray[letter] = positionList;
        }
        wordArray[letter].push(i);
    }
    return wordArray;
}

function startGame() {
    randomWord = getRandomWord();
    wordHash = parseWord(randomWord);
    opportunities = 7;
    lettersGuessed = 0;

    console.log(randomWord);

    var wordHtml = document.getElementById('wordToGuess');
    wordHtml.textContent = "";

    for(var i = 0; i < randomWord.length; i++)
    {
      var letterSpace = document.createElement('span');
      letterSpace.setAttribute("id", "letter" + i);
      letterSpace.textContent = "_ ";
      wordHtml.appendChild(letterSpace);
    }
}

document.onkeyup = function (event) {

    var userGuess = event.key.toLowerCase();
    var positionList = wordHash[userGuess];


    console.log(userGuess);
    

    if(positionList) {
        for(var i=0; i<positionList.length; i++) {
            var space = document.getElementById('letter' + positionList[i]);
            space.textContent = userGuess + " ";
            lettersGuessed++;
        }
        wordHash[userGuess] = [];
    }else {
        opportunities--;
    }

    if(opportunities == 0) {
        alert("Loooser!");
    }

    if(lettersGuessed == randomWord.length) {
        alert("Winner!");
    }

}
