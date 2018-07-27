class App {
  constructor() {
    document.addEventListener('DOMContentLoaded', _ => this.onDocumentLoaded())
  }

  onDocumentLoaded() {
    this.bindElements()
    this.bindEvents()
  }

  bindElements() {
    this.drawingCanvas = document.getElementById('canvas')
    this.scalingCanvas = document.getElementById('otherCanvas')
    this.saveButton = document.getElementById('save')
    this.clearButton = document.getElementById('clear')
    this.runicCanvas = new RunicCanvas(this.drawingCanvas, this.scalingCanvas)
  }

  bindEvents() {
    this.saveButton.addEventListener('click', _ => this.onSaveClicked())
    this.clearButton.addEventListener('click', _ => this.onClearClicked())
  }

  onSaveClicked() {
    this.runicCanvas.fetchResults()
      .then(alphaMatrix => console.log(alphaMatrix))
  }

  onClearClicked() {
    this.runicCanvas.clear()
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
