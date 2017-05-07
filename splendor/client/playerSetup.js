function createPlayers(data) {
        for (player in data.players) {
            GAME_DATA.players.push(new Player(data.players[player]));
        }
    }
    //Class
    function Player(playerObjFromServer) {
        this.name = playerObjFromServer.name
        this.points = playerObjFromServer.points | 0
        this.gems = playerObjFromServer.gems
        var PLAYERS = document.querySelector("players")
        this.div = document.createElement("player")
        PLAYERS.appendChild(this.div)
        var name = document.createElement("h2")
        name.innerHTML = this.name
        this.div.appendChild(name)
        var COLORS = ["red", "blue", "brown", "green", "purple"]
        for (color in COLORS) {
            var gem = document.createElement("div")
            gem.classList.add(COLORS[color])
            var cardsDiv = document.createElement("div")
            cardsDiv.classList.add("cards")
            cardsDiv.innerHTML = this.gems[color][0]
            var tokensDiv = document.createElement("div")
            tokensDiv.classList.add("tokens")
            tokensDiv.innerHTML = this.gems[color][1]
            gem.appendChild(cardsDiv)
            gem.appendChild(tokensDiv)
            this.div.appendChild(gem)
        }
        this.addGem = function (gemNumber, tokenCard, amountToAdd) {
            this.gems[gemNumber][tokenCard] += amountToAdd
            this.div.children[gemNumber].children[tokenCard].innerHTML = this.gems[gemNumber][tokenCard];
        }
    }