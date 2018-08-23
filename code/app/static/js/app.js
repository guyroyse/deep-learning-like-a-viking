class App {
  constructor() {
    document.addEventListener('DOMContentLoaded', _ => this.onDocumentLoaded())
  }

  onDocumentLoaded() {
    this.viewController = new RunicViewController()
  }
}

class RunicViewController {
  constructor() {
    this.adapter = new RunicAdapter()

    this.saveButton = document.getElementById('save')
    this.clearButton = document.getElementById('clear')
    this.detectButton = document.getElementById('detect')

    this.saveButton.addEventListener('click', _ => this.onSaveClicked())
    this.clearButton.addEventListener('click', _ => this.onClearClicked())
    this.detectButton.addEventListener('click', _ => this.onDetectClicked())

    let drawingCanvas = document.getElementById('canvas')
    let scalingCanvas = document.getElementById('otherCanvas')
    let runeToDrawElement = document.getElementById('runeToDraw')
    let detectedRuneElement = document.getElementById('detectedRune')

    this.runicCanvas = new RunicCanvas(drawingCanvas, scalingCanvas)
    this.runeToDraw = new RunicDisplay(runeToDrawElement)
    this.detectedRune = new RunicDisplay(detectedRuneElement)

    this.runeToDraw.randomRune()
  }

  onSaveClicked() {
    let runeName = this.runeToDraw.runeName
    this.runicCanvas.fetchResults()
      .then(imageData => this.adapter.saveRune(runeName, imageData))
      .then(data => {
        console.log(data)
        this.runicCanvas.clear()
        this.runeToDraw.randomize()
      })
  }

  onClearClicked() {
    this.runicCanvas.clear()
  }

  onDetectClicked() {
    this.runicCanvas.fetchResults()
      .then(imageData => this.adapter.detectRune(imageData))
      .then(data => {
        console.log(data)
        this.detectedRune.runeName = data.rune
      })
  }
}

class RunicAdapter {
  saveRune(rune, data) {
    return fetch('/rune/save', {
      method: 'POST',
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ rune, data })
    }).then(response => response.json())
  }

  detectRune(data) {
    return fetch('/rune/detect', {
      method: 'POST',
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ data })
    }).then(response => response.json())
  }
}

class RunicDisplay {
  constructor(runicElement) {
    this.runicElement = runicElement
  }

  get rune() {
    return this.runicElement.innerHTML
  }

  set rune(rune) {
    this.runicElement.innerHTML = rune
  }

  get runeName() {
    return runes.nameForRune(this.rune)
  }

  set runeName(runeName) {
    this.rune = runes.runeForName(runeName)
  }

  randomRune() {
    this.rune = runes.randomRune()
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

let runes = (function() {

  let runesAndNames = [
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

  function runeForName(name) {
    return runesAndNames.find(entry => entry.name === name).rune
  }

  function nameForRune(rune) {
    return runesAndNames.find(entry => entry.rune === rune).name
  }

  function randomRune() {
    let index = getRandomInt(runesAndNames.length)
    return runesAndNames[index].rune
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(16))
  }

  return { runeForName, nameForRune, randomRune }

})()
