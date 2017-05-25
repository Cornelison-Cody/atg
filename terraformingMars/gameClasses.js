
function game(){
    ///////////////////////////////////////
    //Public Properties
    this.socketList = [];
    this.playerList = [];
    this.deck = require('deck.json');
    this.draftDecks = [];
    this.corporations = require('corporations.json');
    ///////////////////////////////////////
    //Public Methods
    this.addPlayer = function (playerName) {
        this.playerList.push(new player(playerName));
    };
    this.startRound = function(){
        for (var players in playerList) {
            // Remove all used generational markers
            players.resetGenerationals();
            // Collect income
            players.getProduction();
            // Deal cards
            this.dealCards();
        }
    };

    this.buildDraftDecks = function () {
        for (var j = 0; j < 4; ++j) {
            for (var i = 0; i < this.playerList.length; ++i) {
                var cardIndex = Math.floor(Math.random() * this.deck.length);
                this.draftDecks[i].push(this.deck.splice(cardIndex, 1)[0]);
            }
        }
    };

    this.dealDraftDecks = function () {
        var index = 0;
        for (var p in this.playerList) {
            p.draftIndex = index++;
            p.cardsDelt = this.draftDecks[p.draftIndex];
        }
    };

    this.passDraftDeck = function () {
        for (var p in this.playerList) {
            p.draftIndex++;
            p.draftIndex %= 4;
            p.cardsDelt = this.draftDecks[p.draftIndex];
        }
    };
    /////////////////////////////////////////
    //Helper functions. 
        //Not able to be used outside of class
    this.buildInPlay = function(deck, cards = 4) {
        for (var i=0;i < cards;i++){
            var cardIndex = Math.floor(Math.random() * this.deck[deck].length);
            this.inPlay.push(this.deck[deck].splice(cardIndex,1)[0]);
        }
    };
}

function player(name){
    //Public Properties
    this.name = name;
    this.points = 0;
    this.isActivePlayer = true;
    this.actionsUsed = 0;
    this.resources = {
        "money":[],         //money[0] = quantity money[1] = production
        "steel":[],
        "titanium":[],
        "plants":[],
        "energy":[],
        "heat":[]
    };
    this.draftIndex = 0;
    this.cardsPlayed = [];
    this.cardsHand = [];
    this.cardsDelt = [];
    this.cardsDeltKeepIndex = 0;
    
    //Public functions

    this.resetGenerationals = function () {
        for (var c in this.cardsPlayed) {
            if (c.usedGenerational == true) {
                c.usedGenerational = false;
            }
        }
    };

    this.getProduction = function() {
        for (var r in this.resources) {
            this.resources.r[0] += this.resources.r[1];
        }
    };

    this.addCardToHand = function (cardIndex) {
        this.cardsDeltKeepIndex = cardIndex;
        this.resources.money[0] -= 3;       //pay 3 money to keep card
        this.cardsHand.push(this.cardsDelt.splice(cardIndex,1)[0]);
    };

    this.payCardFromHand = function(card) {
        this.resources.money[0] -= card.cost;
    };

    this.moveCardFromHandToPlay = function (cardIndex) {
        this.cardsPlayed.push(this.cardsHand.splice(cardIndex,1)[0]);
    };

    this.findCardsHandIndex = function (card) {
        var index = 0;
        for (var c in this.cardsHand) {
            if (card.id == c.id) {
                return index;
            }
            else {
                index ++;
            }
            return -1;
        }
    };
}







//Exports
var exports = module.exports = {};
exports.game = game;
exports.player = player;