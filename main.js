const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]
const view = {
  getCardElement(index) {
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]
    return `
      <div id="card">
        <p>${number}</p>
        <img src="${symbol}" alt="">
        <p>${number}</p>
      </div>
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
  displayCards() {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = Array.from(Array(52).keys()).map(index => this.getCardElement(index)).join("")
  },  //用map迭代Array.from陣列，依序將數字丟進this.getCardElement()產生52張卡片；再用join("")把陣列合併成一個字串，才能使用innerHTML放進#caards中
}
view.displayCards()