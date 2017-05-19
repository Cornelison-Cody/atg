
function game(){
    ///////////////////////////////////////
    //Public Properties
    this.socketList = [];
    this.playerList = [];
    this.deck = [];
    this.deck[1] = require('./client/deck1.json');
    this.deck[2] = require('./client/deck2.json');
    this.deck[3] = require('./client/deck3.json');
    this.inPlay = [];
    this.token = [7,7,7,7,7];
    ///////////////////////////////////////
    //Public Methods
    this.addPlayer = function (playerName, socketId) {
        this.playerList.push(new player(playerName, socketId));
    };
    this.buyCard = function(player, cardID){
        var tempCard;
            //Pulls out card from inPlay
        for (var card in this.inPlay){
            if (this.inPlay[card].id == cardID){
                tempCard = this.inPlay.splice(card,1)[0];
                break;
            }
        }
        //Checks pulled card against player
        //Returns it if player can't have it
        if(player.addCard(tempCard, this)){
            this.buildInPlay(tempCard.deck,1);
            return true;
        } else {
            this.inPlay.push(tempCard);
            return false
        }
    };
        //  // I don't really want to look at these algorithms RN
        //These will probably change {
    this.removeTokens = function (color, quantity) {
        this.token[color] -= quantity;
    };
    this.tokensTwoSame = function (color, player) {
        if (this.token[color] >= 4) {
            this.removeTokens(color, 2);
            this.player[player].addTokens(color, 2);
            return true;
        }
        else {
            return false;
        }
    };
    this.tokensThreeDiff = function (c1, c2, c3, player) {
        var good = true;
        var colors = [c1, c2, c3];
        for (var i = 0; i < colors.length; ++i) {
            if(this.token[i] > 0) {}
            else {
                good = false;
            }
        }
        if (good) {
            for (var i = 0; i < colors.length; ++i) {
                this.removeTokens(i, 1);
                this.player[player].addTokens(i, 1);
            }
        }
        return good;
    };
    this.takeTokens = function (player, option, arg1, arg2, arg3) {
        /*if (option == 1) {
         return(this.tokensWild(player));
         }*/
        if (option == 2) {
            // either need some way to prompt for color or pass it into main function
            return(this.tokensTwoSame(arg1, player));
        }
        if (option == 3) {
            // either need some way to prompt for color or pass it into main function
            return(this.tokensThreeDiff(arg1, arg2, arg3, player));
        }
    };
    this.maxTokens = function (player) {
        while (this.playerList[player].tokenCount() > 10) {
            // PROMPT FOR WHICH COLOR TO REMOVE
            //                    this.player[player].addTokens(color, -1); ** client will call this function
        }
    };
        //}
    
    /////////////////////////////////////////
    //Helper functions. 
        //Not able to be used outside of class
    this.addTokens = function(colorID, quantity){
        this.token[colorID] += quantity;
    };
    this.cardsInDeck = function(deckNum){
        
        return this.deck[deckNum].length;
    };
    this.buildInPlay = function(deck, cards = 4) {
        for (var i=0;i < cards;i++){
            var cardIndex = Math.floor(Math.random() * this.deck[deck].length);
            this.inPlay.push(this.deck[deck].splice(cardIndex,1)[0]);
        }
    };
    
    /////////////////////////////////////////
    //Initial run commands, run at class init.
    this.buildInPlay(1);
    this.buildInPlay(2);
    this.buildInPlay(3)
}

function player(name){
    //Public Properties
    this.name = name;
    this.points = 0;
    this.isActivePlayer = true;
    this.gems = [ [0, 0], [0, 0], [0, 0], [0, 0],[0, 0] ];  // [gems][cards]  gems.[color][gem/card]
    this.card = [];
    
    //Public functions
    this.addTokens = function (color, quantity) {
        this.gems[color][0] += quantity;
    };
    this.addCard = function(newCard,game){
        // if (canAfford(newCard)){
            this.payCard(newCard, game);
            this.giveCard(newCard);
            return true;
        // } else{
        //     return false;
        // }
    };
    
    //Helper Functions
    this.giveCard = function (newCard) {
        this.card.push(newCard);
        this.points += newCard.points;      // *** SHOULD REMOVE THIS AND HAVE IT DYNAMICALLY CALC AT TIME ***
        this.gems[newCard.gemColor][1] += 1; // *** MAYBE REMOVE THIS AND HAVE IT DYNAMICALLY CALC AT TIME ***
    };
    this.payCard = function (newCard, game) {
        for (var i = 0; i < 5; i++) {
            if (this.gems[i][1] < newCard.cost[i]) {   // checks to see if you even have to pay for it.
                this.gems[i][0] -= (newCard.cost[i] - this.gems[i][1]);
                game.addTokens(i, (newCard.cost[i] - this.gems[i][1]));
                // player tokens     // cost of card    // cards of that color
                // gets the card cost and subtracts the amount of cards of each color
                // that the player has and takes the remainder from the player's tokens
            }
        }
    };
    this.canAfford = function (newCard) {
        var canAfford = true;
        for (var i = 0; i < 5; i++) {
            if (newCard.cost[i] > this.gems[i][0] + this.gems[i][1]) {
                // cost of card     // player tokens    // player cards
                // if cost is greater that player tokens plus player cards then we
                // can't afford it
                canAfford = false;
            }
        }
        return canAfford;
    };
    var tokenCount = function () {
        var count = 0;
        for (var i = 0; i < this.gems.length; ++i) {
            count += this.gems[i][0];
        }
        return count;
    }
}







//Exports
var exports = module.exports = {};
exports.game = game;
exports.player = player;