// Main Game Class

function game (settings) { // Settings.map and Settings.deck
    this.playerList = [];
    this.playerOrder = [];
    this.socketList = [];
    if (settings.deck === 0) { // settings.deck: 0 -> new, 1-> old
        this.powerPlantDeck = require('./powerPlantsNew.json');
    } else {
        this.powerPlantDeck = require('./powerPlantsOld.json');
    }
    this.currentMarket = [];
    this.futureMarket = [];
    this.stepThreeMarket = [];
    this.firstPowerPlant = [];
    this.resources = [0,0,0,0];
    this.mapNum = settings.map; // settings.map: 0-> Germany/USA, 1-> Benelux, 2-> Central Europe
    this.step = 0;
    this.playerOrder = [];
    this.mapResources = require('./mapResources.json');

    //starts game by building resources, market, and setting random player order
    this.initGame = function () {
        this.setStartingResources();
        this.prepareMarket();
        this.shufflePowerPlants();
        this.randomPlayerOrder();
    };

    this.addPlayer = function(playerName, socketID) {
        this.playerList.push(new player(playerName, socketID));
    };

    this.setStartingResources = function () {
        // loop through all the resources and set them to the starting values
        for (var r in mapResources[this.mapNum].startingResources) {
            this.resources[r] = mapResources[this.mapNum].startingResources;
        }
    };

    this.prepareMarket = function () {
        // put first 4 plants into current market
        this.currentMarket.push(this.powerPlantDeck.splice(0,4)[0]);
        // put second 4 plants into future market
        this.futureMarket.push(this.powerPlantDeck.splice(0,4)[0]);
        // put green plant on top of deck
        this.firstPowerPlant.push(this.powerPlantDeck.splice(3,1)[0]);
    };

    this.shufflePowerPlants = function () {
        var tempDeck = [];
        var randomPlant = 0;
        // shuffle all cards into temp deck
        while (this.powerPlantDeck.length > 0) {
            randomPlant = Math.floor(Math.random() * this.powerPlantDeck.length);
            tempDeck.push(this.powerPlantDeck.splice(randomPlant,1)[0]);
        }
        // shuffle all cards back into power plant deck
        while (tempDeck.length > 0) {
            randomPlant = Math.floor(Math.random() * tempDeck.length);
            this.powerPlantDeck.push(tempDeck.splice(randomPlant,1)[0]);
        }
        // put starting card on top
        this.powerPlantDeck.splice(0,0,this.firstPowerPlant[0]);
    };

    this.randomPlayerOrder = function () {
        var tempOrder = [];
        var randomPlayer = 0;
        // shuffle all players into temp order
        while (this.playerList > 0) {
            randomPlayer = Math.floor(Math.random() * this.playerList.length);
            tempOrder.push(this.playerList.splice(randomPlayer,1)[0]);
        }
        // shuffle all players back into player order
        while (tempOrder.length > 0) {
            randomPlayer = Math.floor(Math.random() * tempOrder.length);
            this.playerList.push(tempDeck.splice(randomPlayer,1)[0]);
        }
    };

    this.auctionPlantPhase = function (powerPlant) {

    };

    this.refillMarket = function () {
        this.currentMarket.push(this.futureMarket.splice(0,1)[0]);
        this.reorderMarket(this.currentMarket);
        this.futureMarket.push(this.powerPlantDeck.splice(0,1)[0]);
        this.reorderMarket(this.futureMarket);
    };

    this.reorderMarket = function (market) {
        for (var plant in market) {
            if (market[plant].number > market[(plant + 1) % 4].number ) {
                market.swap(plant, (plant + 1) % 4);
            }
        }
    };

    this.buyResourcesPhase = function () {

    };

    this.resourceCost = function (resourceType) {
        var rCost = 0;

        if (resourceType < 3) {
            rCost = 8 - Math.floor(this.resources[resourceType] / 3);
        } else {
            if (this.resources[resourceType] <= 4) {
                rCost = 18 - this.resources[resourceType] * 2;
            }
            else {
                rCost = 13 - this.resources[resourceType];
            }
        }

        return rCost;
    };

    this.payResource = function (player, resourceType, quantity) {
        while (quantity > 0) {
            if (this.playerList[player].money >= this.resourceCost(resourceType)) {
                this.playerList[player].money -= this.resourceCost(resourceType);
                quantity -= 1;
            }
            else {
                return false;
            }
        }
        return true;
    };

    this.addResource = function (player, resourceType, quantity) {
        if (this.resources[resourceType] >= quantity) {
            this.resources[resourceType] -= quantity;
            this.playerList[player].resources[resourceType] += quantity;
            return true;
        }
        else {
            return false;
        }
    };

    this.buyCitiesPhase = function () {

    };

    this.bureaucracyPhase = function () {

    };

    this.resetPlayerOrder = function () {
        for (var player in this.playerList) {
            this.playerOrder[player] = this.playerList[player];
        }
        for (var player = 0; player < this.playerOrder.length -1; ++player) {
            if (this.playerOrder[player].cities > this.playerOrder[player + 1].cities) {
                this.playerOrder.swap(player, (player + 1));
            } else if (this.playerOrder[player].cities == this.playerOrder[player + 1].cities) {
                if (this.playerOrder[player].largestPlant > this.playerOrder[player + 1].largestPlant) {
                    this.playerOrder.swap(player, (player + 1));
                }
            }
        }
    }
}

function player (name, socketID) {
    this.name = name;
    this.socketID = socketID;
    this.cities =0;
    this.powerPlants =[];
    this.largestPlant = 0;
    this.plantResources = [
        [] // Power plant 1
        ,[] // Power Plant 2
        ,[] // Power Plant 3
        ];
    this.money = 0;
    this.boughtPlant = false;
    this.passedBid = false;
    this.resources = [0,0,0,0];
}

Array.prototype.swap = function (x,y) {
    var b = this[x];
    this[x] = this[y];
    this[y] = b;
    return this;
};