class App {
  constructor() {
    document.addEventListener('DOMContentLoaded', _ => this.onDocumentLoaded())
  }

  onDocumentLoaded() {
    this.bindElements()
    this.bindEvents()
  }

  bindElements() {
    this.runicElement = document.getElementById('runeToDraw')
    this.drawingCanvas = document.getElementById('canvas')
    this.scalingCanvas = document.getElementById('otherCanvas')
    this.clearButton = document.getElementById('clear')
    this.saveButton = document.getElementById('save')
    this.detectButton = document.getElementById('detect')
    this.runicCanvas = new RunicCanvas(this.drawingCanvas, this.scalingCanvas)
    this.randomRune = new RandomRune(this.runicElement)
  }

  bindEvents() {
    this.clearButton.addEventListener('click', _ => this.onClearClicked())
    this.saveButton.addEventListener('click', _ => this.onSaveClicked())
    this.detectButton.addEventListener('click', _ => this.onDetectClicked())
  }

  onClearClicked() {
    this.runicCanvas.clear()
  }

  onSaveClicked() {
    this.runicCanvas.fetchResults()
      .then(alphaMatrix => {
        return fetch('/rune/save', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
            rune: this.randomRune.runeName,
            data: alphaMatrix
          })
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.runicCanvas.clear()
        this.randomRune.randomize()
      })
  }

  onDetectClicked() {
    this.runicCanvas.fetchResults()
      .then(alphaMatrix => {
        return fetch('/rune/detect', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
            data: alphaMatrix
          })
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.randomRune.runeName = data.rune
      })
  }
}

class RandomRune {
  constructor(runicElement) {
    this.runicElement = runicElement
    this.runes = [
      { rune: "ᚠ", name: "fe" },
      { rune: "ᚢ", name: "ur" },
      { rune: "ᚦ", name: "thurs" },
      { rune: "ᚬ", name: "as" },
      { rune: "ᚱ", name: "reith" },
      { rune: "ᚴ", name: "kaun" },
      { rune: "ᚼ", name: "hagall" },
      { rune: "ᚾ", name: "nauthr" },
      { rune: "ᛁ", name: "isa" },
      { rune: "ᛅ", name: "ar" },
      { rune: "ᛋ", name: "sol" },
      { rune: "ᛏ", name: "tyr" },
      { rune: "ᛒ", name: "bjork" },
      { rune: "ᛘ", name: "mathr" },
      { rune: "ᛚ", name: "logr" },
      { rune: "ᛦ", name: "yr" }
    ]

    this.randomize()
  }

  get rune() {
    return this.runes[this.currentRune].rune
  }

  set rune(rune) {
    this.currentRune = this.runes.findIndex(entry => entry.rune === rune)
    this.runicElement.innerHTML = this.rune
  }

  get runeName() {
    return this.runes[this.currentRune].name
  }

  set runeName(runeName) {
    this.currentRune = this.runes.findIndex(entry => entry.name === runeName)
    this.runicElement.innerHTML = this.rune
  }

  randomize() {
    this.currentRune = this.getRandomInt(16)
    this.runicElement.innerHTML = this.rune
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))
  }

}

class RunicCanvas {
  constructor(drawingCanvas, scalingCanvas) {
    this.drawingCanvas = drawingCanvas
    this.drawingContext = drawingCanvas.getContext('2d')
    this.drawingContext.lineWidth = 20
    this.drawingContext.lineCap = 'round'

    this.scalingContext = scalingCanvas.getContext('2d')
    this.scalingContext.scale(0.1, 0.1);

    this.prevX = null;
    this.prevY = null;
    this.drawing = false;

    this.bindEvents()
  }

  bindEvents() {
    this.drawingCanvas.addEventListener('mousedown',
      event => this.onMouseEvent(event, 'onMouseDown'))

    this.drawingCanvas.addEventListener('mousemove',
      event => this.onMouseEvent(event, 'onMouseMove'))

    this.drawingCanvas.addEventListener('mouseup',
      event => this.onMouseEvent(event, 'onMouseUp'))
  }

  onMouseEvent(event, handlerName) {
    let x = event.clientX - this.drawingCanvas.offsetLeft - 1
    let y = event.clientY - this.drawingCanvas.offsetTop - 1
    this[handlerName](x, y)
  }

  onMouseDown(x, y) {
    this.drawing = true
    this.drawingContext.beginPath()
    this.drawingContext.moveTo(x, y)
    this.prevX = x, this.prevY = y
  }

  onMouseMove(x, y) {
    if (this.drawing) {
      this.drawingContext.lineTo(x, y)
      this.drawingContext.stroke()
      this.prevX = x, this.prevY = y
    }
  }

  onMouseUp(x, y) {
    this.drawingContext.lineTo(x, y)
    this.drawingContext.stroke()
    this.prevX = x, this.prevY = y
    this.drawing = false
  }

  clear() {
    this.drawingContext.clearRect(0, 0, 240, 240)
    this.scalingContext.clearRect(0, 0, 240, 240)
  }

  fetchResults() {
    return this.fetchScaledImageData()
      .then(scaledImageData => {
        let rawData = [...scaledImageData.data]
        console.log("Raw data", rawData)

        let alphaData = rawData.filter((_, index) => (index + 1) % 4 === 0)
        console.log("Alpha data", alphaData)

        let alphaMatrix = this.convertToMatrix(alphaData)
        console.log("Alpha matrix", alphaMatrix)

        return alphaMatrix
      })
  }

  fetchScaledImageData() {
    let imageData = this.drawingContext.getImageData(0, 0, 240, 240)
    console.log("Image data", imageData)

    return createImageBitmap(imageData)
      .then(imageBitmap => {
        this.scalingContext.drawImage(imageBitmap, 0, 0)
        let scaledImageData = this.scalingContext.getImageData(0, 0, 24, 24)
        console.log("Scaled image data", scaledImageData)
        return scaledImageData
      })
  }

  convertToMatrix(data) {
    return new Array(24)
      .fill()
      .map((_, index) => {
        let start = index * 24
        let end = (index + 1) * 24
        return data.slice(start, end)
      })
  }
}
