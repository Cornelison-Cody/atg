// **************** SPLENDOR CODE ************************

// ----------------- gem colors --------------------------

/*
 Gem Colors
 [0] = Red
 [1] = Blue
 [2] = Brown
 [3] = Green
 [4] = White
 [5] = Yellow
 */
var colorName = ["Red","Blue","Brown","Green","White","Yellow"]
// --------------- PLAYER CLASS ------------------------------
var player = function (name) {
    this.name = name;
    this.points = 0;
    this.isActivePlayer = false;
    this.gems = [  // 2d array here to hold the gem color from cards (permanant
        [0, 0],     // tokens) and the traditional tokens as well
        [0, 0],     // for example [1, 2] would mean this player has 1 token and
        [0, 0],     // two cards of that same color. NO WILDS YET
        [0, 0],
        [0, 0]
    ];

    this.card = [];

    //ADD CARD FUNCTION
    this.addCard = function (newCard) {
        this.card.push(newCard);
        this.points += newCard.points;      // *** SHOULD REMOVE THIS AND HAVE IT DYNAMICALLY CALC AT TIME ***
                                            // *** Is it worth having the server perform a lookup/calculation 
                                            // ***** when it could just statically get this information.
        this.gems[newCard.gemColor][1] += 1; // *** MAYBE REMOVE THIS AND HAVE IT DYNAMICALLY CALC AT TIME ***
    };

    // PAY FOR CARD FUNCTION
    this.payCard = function (newCard) {
        for (var i = 0; i < 5; i++) {
            if (this.gems[i][1] < newCard.cost[i]) {   // checks to see if you even have to pay for it.
                this.gems[i][0] -= (newCard.cost[i] - this.gems[i][1]);
                // player tokens     // cost of card    // cards of that color
                // gets the card cost and subtracts the amount of cards of each color
                // that the player has and takes the remainder from the player's tokens
            }
        }
    };

    //CAN AFFORD FUNCTION
    this.canAfford = function (newCard) {
        var canAfford = true;
        for (var i = 0; i < 5; i++) {
            if (newCard.cost[i] > this.gems[i][0] + this.gem[i][1]) {
                // cost of card     // player tokens    // player cards
                // if cost is greater that player tokens plus player cards then we
                // can't afford it
                canAfford = false;
            }
        }
        return canAfford;
    };

    //ADD TOKENS FUNCTION
    this.addTokens = function (color, quantity) {
        this.gems[color][0] += quantity;
    };

    //COUNT TOTAL TOKENS
    this.tokenCount = function () {
        var count = 0;
        for (var i = 0; i < this.gems.length; ++i) {
            count += this.gems[i][0];
        }
        return count;
    }
};

// ----------------- CARD CLASS ----------------------------------
// ------- This has no function anymore. -------------------------
// ------- Cards are created from JSON File ----------------------
var card = function (gemColor, points, cRed, cBlue, cBrown, cGreen, cWhite) {
    this.cost = [cRed, cBlue, cBrown, cGreen, cWhite];
    this.points = points;
    this.gemColor = gemColor
};

// ----------------- NOBLE CLASS ------------------------------
/*var noble = function (cRed, cBlue, cBrown, cGreen, cWhite) {
 this.cost = [cRed, cBlue, cBrown, cGreen, cWhite ]
 this.points = 3
 };*/

// ------------------ GAME CLASS ---------------------------------
var game = function () {
    this.activePlayer = 0;
    this.playerList = {};
    this.deck = [
        [],  // 0 - nobel deck
        [],  // 1 - deck 1
        [],  // 2 - deck 2
        [],  // 3 - deck 3
        [],  // 4 - inplay nobel
        [],  // 5 - inplay 1
        [],  // 6 - inplay 2
        []   // 7 - inplay 3
    ];

    this.token = [      // these numbers change based on the number of players
        7,              // 2:4, 3:5, 4:7
        7,              // 2:4, 3:5, 4:7
        7,              // 2:4, 3:5, 4:7
        7,              // 2:4, 3:5, 4:7
        7               // 2:4, 3:5, 4:7
        //                yellow: 5       // 2:5, 3:5, 4:5
    ];

    // SETUP DECKS
    buildD1(this.deck[1]);
    buildD2(this.deck[2]);
    buildD3(this.deck[3]);
    //            buildDN(this.deck[0]);

    // SETUP IN PLAY SUB DECKS
    for (var i = 1; i < 4; i++) {
        buildInPlay(this.deck[i], this.deck[i+4], 4);
    }
    //            buildInPlay(this.deck[0], this.deck[4], 5); // this will change based on
    //                                      num of players. it's equal to # of players + 1

    // ADD PLAYERS HAND JAM
    this.addPlayer = function (playerName, socketId) {
        this.playerList.push(new player(playerName, socketId));
    };

    // REMOVE TOKENS
    this.removeTokens = function (color, quantity) {
        this.token[color] -= quantity;
    };

    // TAKE ONE WILD TOKEN
    /*this.tokensWild = function (player) {
     if (this.token[5] > 0 ) {
     this.removeTokens(5, 1);
     this.player[player].addTokens(5, 1);
     return true;
     }
     else {
     return false;
     }*/

    // TAKE TWO TOKENS THE SAME COLOR
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

    // TAKE THREE TOKENS DIFFERENT COLOR
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

    // OPTION TO TAKE TOKENS
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

    // CHECK IF PLAYER HAS MORE THAN 10 TOKENS HAVE TO DISCARD
    this.maxTokens = function (player) {
        while (this.player[player].tokenCount() > 10) {
            // PROMPT FOR WHICH COLOR TO REMOVE
            //                    this.player[player].addTokens(color, -1); ** client will call this function
        }
    };

    // REMOVES CARD AFTER IT'S BEEN BOUGHT
    this.buyCards = function (player, deckNum, card) { // deckNum 4-7
        this.player[player].payCard(card);
        this.player[player].addCard(this.deck[deckNum].splice(card, 1)[0]);
    };
};

// -------------- DECK 1 HAND JAM -------------------------------
var buildD1 = function (deck) {
    deck.push(new card(0, 1, 0, 0, 0, 0, 4));
    deck.push(new card(0, 0, 0, 0, 0, 0, 3));
    deck.push(new card(0, 0, 0, 0, 2, 1, 2));
    deck.push(new card(0, 0, 0, 1, 1, 1, 2));
    deck.push(new card(0, 0, 2, 0, 0, 0, 2));
    deck.push(new card(0, 0, 0, 1, 1, 1, 1));
    deck.push(new card(0, 0, 1, 0, 3, 0, 1));
    deck.push(new card(0, 0, 0, 2, 0, 1, 0));
    deck.push(new card(1, 1, 4, 0, 0, 0, 0));
    deck.push(new card(1, 0, 2, 0, 0, 2, 1));
    deck.push(new card(1, 0, 2, 0, 1, 1, 1));
    deck.push(new card(1, 0, 1, 0, 1, 1, 1));
    deck.push(new card(1, 0, 0, 0, 2, 0, 1));
    deck.push(new card(1, 0, 1, 1, 0, 3, 0));
    deck.push(new card(1, 0, 0, 0, 2, 2, 0));
    deck.push(new card(1, 0, 0, 0, 3, 0, 0));
    deck.push(new card(2, 1, 0, 4, 0, 0, 0));
    deck.push(new card(2, 0, 0, 0, 0, 2, 2));
    deck.push(new card(2, 0, 1, 2, 0, 0, 2));
    deck.push(new card(2, 0, 1, 2, 0, 1, 1));
    deck.push(new card(2, 0, 1, 1, 0, 1, 1));
    deck.push(new card(2, 0, 0, 0, 0, 3, 0));
    deck.push(new card(2, 0, 1, 0, 0, 2, 0));
    deck.push(new card(2, 0, 3, 0, 1, 1, 0));
    deck.push(new card(3, 1, 0, 0, 4, 0, 0));
    deck.push(new card(3, 0, 0, 1, 0, 0, 2));
    deck.push(new card(3, 0, 0, 3, 0, 1, 1));
    deck.push(new card(3, 0, 1, 1, 2, 0, 1));
    deck.push(new card(3, 0, 1, 1, 1, 0, 1));
    deck.push(new card(3, 0, 2, 1, 2, 0, 0));
    deck.push(new card(3, 0, 2, 2, 0, 0, 0));
    deck.push(new card(3, 0, 3, 0, 0, 0, 0));
    deck.push(new card(4, 1, 0, 0, 0, 4, 0));
    deck.push(new card(4, 0, 0, 1, 1, 0, 3));
    deck.push(new card(4, 0, 0, 2, 1, 2, 0));
    deck.push(new card(4, 0, 1, 1, 1, 2, 0));
    deck.push(new card(4, 0, 1, 1, 1, 1, 0));
    deck.push(new card(4, 0, 0, 2, 2, 0, 0));
    deck.push(new card(4, 0, 2, 0, 1, 0, 0));
    deck.push(new card(4, 0, 0, 3, 0, 0, 0));
};

// --------------- DECK 2 HAND JAM ------------------------------
var buildD2 = function (deck) {
    deck.push(new card(0, 3, 6, 0, 0, 0, 0));
    deck.push(new card(0, 2, 0, 0, 5, 0, 3));
    deck.push(new card(0, 2, 0, 4, 0, 2, 1));
    deck.push(new card(0, 2, 0, 0, 5, 0, 0));
    deck.push(new card(0, 1, 2, 0, 3, 0, 2));
    deck.push(new card(0, 1, 2, 3, 3, 0, 0));
    deck.push(new card(1, 3, 0, 6, 0, 0, 0));
    deck.push(new card(1, 2, 0, 3, 0, 0, 5));
    deck.push(new card(1, 2, 1, 0, 4, 0, 2));
    deck.push(new card(1, 2, 0, 5, 0, 0, 0));
    deck.push(new card(1, 1, 0, 2, 3, 3, 0));
    deck.push(new card(1, 1, 3, 2, 0, 2, 0));
    deck.push(new card(2, 3, 0, 0, 6, 0, 0));
    deck.push(new card(2, 2, 0, 0, 0, 0, 5));
    deck.push(new card(2, 2, 3, 0, 0, 5, 0));
    deck.push(new card(2, 2, 2, 1, 0, 4, 0));
    deck.push(new card(2, 1, 0, 0, 2, 3, 3));
    deck.push(new card(2, 1, 0, 2, 0, 2, 3));
    deck.push(new card(3, 3, 0, 0, 0, 6, 0));
    deck.push(new card(3, 2, 0, 2, 1, 0, 4));
    deck.push(new card(3, 2, 0, 0, 0, 5, 0));
    deck.push(new card(3, 2, 0, 5, 0, 3, 0));
    deck.push(new card(3, 1, 3, 0, 0, 2, 3));
    deck.push(new card(3, 1, 0, 3, 2, 0, 2));
    deck.push(new card(4, 3, 0, 0, 0, 0, 6));
    deck.push(new card(4, 2, 4, 0, 2, 1, 0));
    deck.push(new card(4, 2, 5, 0, 3, 0, 0));
    deck.push(new card(4, 2, 5, 0, 0, 0, 0));
    deck.push(new card(4, 1, 3, 3, 0, 0, 2));
    deck.push(new card(4, 1, 2, 0, 2, 3, 0));
};

// ---------------- DECK 3 HAND JAM -----------------------------
var buildD3 = function (deck) {
    deck.push(new card(0, 5, 3, 0, 0, 7, 0));
    deck.push(new card(0, 4, 0, 0, 0, 7, 0));
    deck.push(new card(0, 4, 3, 3, 0, 6, 0));
    deck.push(new card(0, 3, 0, 5, 3, 3, 3));
    deck.push(new card(1, 5, 0, 3, 0, 0, 7));
    deck.push(new card(1, 4, 0, 0, 0, 0, 7));
    deck.push(new card(1, 4, 0, 3, 3, 0, 6));
    deck.push(new card(1, 3, 3, 0, 5, 3, 3));
    deck.push(new card(2, 5, 7, 0, 3, 0, 0));
    deck.push(new card(2, 4, 7, 0, 0, 0, 0));
    deck.push(new card(2, 4, 6, 0, 3, 3, 0));
    deck.push(new card(2, 3, 3, 3, 0, 5, 3));
    deck.push(new card(3, 5, 0, 7, 0, 3, 0));
    deck.push(new card(3, 4, 0, 7, 0, 0, 0));
    deck.push(new card(3, 4, 0, 6, 0, 3, 3));
    deck.push(new card(3, 3, 3, 3, 3, 0, 5));
    deck.push(new card(4, 5, 0, 0, 7, 0, 3));
    deck.push(new card(4, 4, 0, 0, 7, 0, 0));
    deck.push(new card(4, 4, 3, 0, 6, 0, 3));
    deck.push(new card(4, 3, 5, 3, 3, 3, 0));
};

// --------------- NOBLES HAND JAM ------------------------------
/*var buildDN = function (deck) {
 deck.push(new noble(4,0,0,4,0));
 deck.push(new noble(4,0,4,0,0));
 deck.push(new noble(3,3,0,3,0));
 deck.push(new noble(3,0,3,0,3));
 deck.push(new noble(3,0,3,3,0));
 deck.push(new noble(0,4,0,0,4));
 deck.push(new noble(0,3,0,3,3));
 deck.push(new noble(0,4,0,4,0));
 deck.push(new noble(0,0,4,0,4));
 deck.push(new noble(0,3,3,0,3));
 };*/

// ------------- BUILD IN PLAY FUNCTION -------------------------
var buildInPlay = function (srcDeck, destDeck, count) {
    if (srcDeck.length >= count) {
        for (var i = 0; i < count; ++i) {
            destDeck.push(srcDeck.splice(Math.floor(Math.random() * srcDeck.length), 1)[0]);
        }
    }
    else {
        // not sure if we need to console.log an error or anything here
    }
};


// ------------ Player Interaction function ---------------------
/*    var playerInteraction = function (data) {
 switch (data.action) {
 case 'buyCard':
 if(game.player[data.player].canAfford(data.card)) {
 game.buyCards(data.player, data.deck, data.card);
 moveCard(data.card);
 }
 else {
 cantAffordCard();
 }
 break;
 case 'takeTokens':
 if(takeTokens(data.player, data.option, data.c1, data.c2, data.c3)) {
 getTokens();
 }
 else {
 invalidTokens();
 }
 break;
 case 'reserveCard':
 }
 };*/
