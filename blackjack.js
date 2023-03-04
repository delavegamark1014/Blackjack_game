const chips=[10,25,50,100,500]
let dealerSum=0
let yourSum=0

let dealerAceCount=0
let yourAceCount=0

let yourBank=5000
let yourBet=0

let hidden = ""
let deck

let canHit = true

window.onload = function() {
    buildDeck()
    shuffleDeck()
}

function buildDeck() {
    let values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]
    let types = ["C", "D","H","S"]
    deck = []

    for(let i=0;i<types.length;i++) {
        for(let j=0;j<values.length;j++) {
            deck.push(values[j]+ "-" + types[i]) //creates the card ex: 2-D
        }
    }
    console.log(deck)
}

function shuffleDeck() {
    for(let i=0;i<deck.length;i++) {
        let j = Math.floor(Math.random() * deck.length) //(0-51)
        let temp = deck[i]
        deck[i]=deck[j]
        deck[j]=temp
    }
    console.log(deck)
}


function bet10(){
document.getElementById("bet-amount").innerHTML= yourBet+10
yourBet+=10
yourBank-=10
}
function bet25(){
    document.getElementById("bet-amount").innerHTML= yourBet+25
    yourBet+=25
    yourBank-=25
}
function bet50(){
    document.getElementById("bet-amount").innerHTML= yourBet+50
    yourBet+=50
    yourBank-=50
}
function bet100(){
    document.getElementById("bet-amount").innerHTML= yourBet+100
    yourBet+=100
    yourBank-=100
}
function bet500(){
    document.getElementById("bet-amount").innerHTML= yourBet+500
    yourBet+=500
    yourBank-=500
}
function hideChips() {
    document.querySelector('.chips').style.visibility="hidden"
}
function showChips() {
    document.querySelector('.chips').style.visibility="visible"
}

function startGame() {
    hideChips()
    document.getElementById("place-bet").style.visibility="hidden"
    document.getElementById("hit").style.visibility="visible"
    document.getElementById("stay").style.visibility="visible"
    document.getElementById("reset").style.visibility="visible"

    hidden = deck.pop()
    dealerSum += getValue(hidden)
    dealerAceCount += checkAce(hidden)
    console.log(`dealer hidden card is a ${hidden}`)
    console.log(`hidden card value is ${dealerSum}`)

        let cardImg = document.createElement("img") //creating card/img elements
        let card = deck.pop()
        cardImg.src = "./cards/" + card + ".png"
        dealerSum += getValue(card)
        dealerAceCount += checkAce(card)
        document.getElementById("dealer-cards").append(cardImg)

    console.log(`dealer's hand is ${dealerSum}`)

    for (i=0; i<2; i++) {
        let cardImg = document.createElement("img") //creating card/img elements
        let card = deck.pop()
        cardImg.src = "./cards/" + card + ".png"
        yourSum += getValue(card)
        yourAceCount += checkAce(card)
        document.getElementById("your-cards").append(cardImg)
    }
    document.getElementById("your-sum").innerText = yourSum
    console.log(`Your hand is ${yourSum}`)
    document.getElementById("hit").addEventListener("click",hit)
    document.getElementById("stay").addEventListener("click",stay)

    if (reduceAce(yourSum, yourAceCount) >= 21) {
        canHit = false;
        stay()
    }

    function hit() {
        if(!canHit) {
            return
        }
        canHit = false; // disable hit button until card is displayed

        let cardImg = document.createElement("img"); // creating card/img elements
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png"; // creating src of image from card ex:2-D
        console.log(`You drew a ${card}`);
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);


        document.getElementById("your-sum").innerText = yourSum
        if(document.getElementById("your-sum").innerText > 21) { //stops from showing >21 when holding an ace
            document.getElementById("your-sum").innerText = yourSum-10
        }
    
        if (reduceAce(yourSum, yourAceCount) >= 21) {
            canHit = false;
            stay()
        }

        console.log(`Your hand is ${yourSum}`);
    
        setTimeout(() => { canHit = true; }, 400); 
    }
    
}

function stay() {
    dealerSum = reduceAce(dealerSum,dealerAceCount) //accounts for aces
    yourSum = reduceAce(yourSum, yourAceCount)

    canHit=false
    document.getElementById("hidden").src = "./cards/" + hidden + ".png"

    while(dealerSum<17) {
    let cardImg = document.createElement("img") //creating card/img elements
    let card = deck.pop()
    cardImg.src = "./cards/" + card + ".png"
    console.log(`Dealer drew a ${card}`)
    dealerSum += getValue(card)
    dealerAceCount += checkAce(card)
    document.getElementById("dealer-cards").append(cardImg)
    }
console.log(`Dealer's hand is ${dealerSum}`)

    let message = ""
    if (yourSum==dealerSum) {
        yourBank+=yourBet
        message = "Push!"
    }
    else if(yourSum==21) {
        yourBank+=yourBet*2.5
        message="BlackJack!"
    }

    else if(yourSum>21) {
        message="Bust!"
    }
    else if (dealerSum >21) {
        yourBank+=yourBet*2
        message = "Dealer Busted!"
    }

    else if (yourSum>dealerSum) {
        yourBank+=yourBet*2
        message = "You win!"
    }
    else if (yourSum < dealerSum) {
        message= "You Lose"
    }
    document.getElementById("bank").innerHTML= "$"+yourBank
    document.getElementById("dealer-sum").innerText = dealerSum
    document.getElementById("your-sum").innerText = yourSum
    document.getElementById("results").innerText = message

    document.getElementById("hit").style.visibility=""
    document.getElementById("stay").style.visibility=""
    document.getElementById("results").style.visibility="visible"

}

function getValue(card) {
    let data = card.split("-")
    let value = data[0]

    if (isNaN(value)) { //A J Q K
        if(value == "A") {
            return 11
        }
        return 10
    }
    return parseInt(value)
}

function checkAce(card) {
    if(card[0] == "A") {
        return 1
    }
    return 0
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum >21 && playerAceCount >0) {
        playerSum -=10
        playerAceCount -=1
    } 
    return playerSum
}

const restartButton = document.getElementById("reset").addEventListener("click", restartGame)
function restartGame() {
    // reset variables to their initial values
    
    dealerSum = 0
    yourSum = 0
    dealerAceCount = 0
    yourAceCount = 0
    yourBet=0
    hidden=""
    deck=[]
    canHit = true
    

    // remove all cards from the dealer's and your hands
    document.getElementById("dealer-cards").innerHTML = ""
    document.getElementById("your-cards").innerHTML = ""

    document.getElementById("results").innerText = ""
    
    // reset the sum displays
    document.getElementById("dealer-sum").innerText = ""
    document.getElementById("your-sum").innerText = yourSum
    document.getElementById("bet-amount").innerHTML = ""



    // shuffle the deck and start a new game
    buildDeck()
    shuffleDeck()


    let hiddenImg = document.createElement("img")
    hiddenImg.id = "hidden"
    hiddenImg.src = "./cards/BACK.png"
    document.getElementById("dealer-cards").append(hiddenImg)

    document.getElementById("hit").style.visibility=""
    document.getElementById("stay").style.visibility=""
    document.getElementById("reset").style.visibility=""
    document.getElementById("results").style.visibility=""
    document.getElementById("place-bet").style.visibility="visible"
    showChips() 
}

