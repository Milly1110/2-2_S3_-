const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished"
}

const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]

const view = {
  getCardElement(index) {
    return `
      <div class="card back" data-index="${index}">
      </div>
    `
  },
  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]
    return `
      <p>${number}</p>
      <img src="${symbol}" alt="">
      <p>${number}</p>
    `
  },
  transformNumber(number) {
    switch (number) {
      case 1: return 'A'
      case 11: return 'J'
      case 12: return 'Q'
      case 13: return 'K'
      default: return number
    }
  },
  displayCards(indexes) {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join("")
  },  //用map迭代Array.from陣列，依序將數字丟進this.getCardElement()產生52張卡片；再用join("")把陣列合併成一個字串，才能使用innerHTML放進#caards中
  flipCards(...cards) {
    // console.log(card)
    //如果點選的卡片是背面，則清空classList裡的back，並用innerHTML搭配getCardContent傳入卡片內容
    cards.map(card => {
      if (card.classList.contains('back')) {
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(card.dataset.index)
        return
      }
      //如果點選的卡片是正片，則將卡片加上back的標籤到class，並將內容清空(null)
      card.classList.add('back')
      card.innerHTML = null
    })
  },
  pairCards(...cards) {
    cards.map(card => {
      card.classList.add("paired")
    })
  },
  renderScore(score) {
    document.querySelector(".score").innerHTML = `Score: ${score}`
  },
  renderTriedTimes(times) {
    document.querySelector(".tried").innerHTML = `You've tried: ${times} times`
  }
}

const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1));
      [number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
}

const model = {
  revealedCards: [],

  isRevealedCardMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },

  score: 0,

  triedTimes: 0,
}

const controller = {
  currentState: GAME_STATE.FirstCardAwaits,
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },
  dispatchCardAction(card) {
    if (!card.classList.contains('back')) {
      return
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break
      case GAME_STATE.SecondCardAwaits:
        view.renderTriedTimes(++model.triedTimes)
        view.flipCards(card)
        model.revealedCards.push(card)
        if (model.isRevealedCardMatched()) {
          view.renderScore(model.score += 10)
          this.currentState = GAME_STATE.CardsMatched
          view.pairCards(...model.revealedCards)
          model.revealedCards = []
          this.currentState = GAME_STATE.FirstCardAwaits
        }
        else {
          this.currentState = GAME_STATE.CardsMatchedFailed
          setTimeout(this.resetCards, 1000)
        }
        break
    }
    console.log('this.currentState :', this.currentState)
    console.log('revealedCards :', model.revealedCards.map(card => card.dataset.index))
  },
  resetCards() {
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    controller.currentState = GAME_STATE.FirstCardAwaits
  }
}

controller.generateCards()

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    console.log(card)
    controller.dispatchCardAction(card)
  })
})