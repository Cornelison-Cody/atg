var socket = io();
var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementsByName('username');
var signDivSignIn = document.getElementsByTagName('input');
var startGameDiv = document.getElementById('startGameButton');

signDivSignIn[1].onclick = function () {
    event.preventDefault();
    socket.emit('signIn', signDivUsername[0].value);
    // createPlayer(signDivUsername[0].value, 0);
};

socket.on('signInResponse', function () {
    signDiv.style.display = 'none';
    startGameDiv.style.display = 'inline'
});

socket.on('gameData', function (game) {
    // ******************** REMOVE LOBBY *************************
    var lobbyDivDiv = document.getElementsByTagName("lobbyDiv")[0];
    lobbyDivDiv.parentElement.removeChild(lobbyDivDiv);
    // ************************ TOKENS ***************************
    createTokens();
    // ******************** CARDS IN PLAY ************************
    for (var i in game.inPlay) {
        createCard(game.inPlay[i], document.querySelector("playArea").children[game.inPlay[i].deck - 1].children[i % 4]);
    }
    // ******************PLAYER NAMES ****************************
    createPlayers(game);
    // ******************** TOKENS IN PILE ************************
    for (var tokenPile in game.token) {
        tokenCount[tokenPile].innerHTML = game.token[tokenPile];
    }
});

socket.on('cLog' , function (myString) {
    console.log(myString);
});

socket.on('removeCard', function (cardID, pName, pCards, cColor) {
    var oldCard = document.getElementById(cardID + "CardID");
    oldCard.parentNode.removeChild(oldCard);
    updateCards (pName, pCards, cColor);        // ********** SHOULD ALL ALL CARD UPDATE FUNCTIONS IN HERE **********
});

socket.on('createCard', function (card) {
    var index = getEmptyCardSlot(document.querySelector("playArea").children[card.deck - 1]);
    createCard(card, document.querySelector("playArea").children[card.deck - 1].children[index]);
});

socket.on('startGameReceived', function () {
    startGameDiv.style.display = 'none';
});

socket.on('updateToken', function (color, count, pName, pGems) {
    // tokenCount[color].innerHTML = count;
    updateTokens(color, count, pName, pGems);
});

socket.on('lobbyUpdate', function (playersArray){
    updateLobby(playersArray);
});