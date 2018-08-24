class Button {
  constructor(id) {
    this.button = document.getElementById(id)
  }

  onClick(handler) {
    this.button.addEventListener('click', handler)
  }
}

class RuneDisplayer {
  constructor(id) {
    this.element = document.getElementById(id)
  }

  get rune() {
    return this._rune
  }

  set rune(rune) {
    this._rune = rune
    this.element.innerHTML = rune.glyph
  }
}

class RunicCanvas {
  constructor(drawingCanvasId, scalingCanvasId) {
    this.drawingCanvas = new DrawingCanvas(drawingCanvasId)
    this.scaledCanvas = new ScaledCanvas(scalingCanvasId)
  }

  clear() {
    this.drawingCanvas.clear()
    this.scaledCanvas.clear()
  }

  fetchImageData() {
    return this._scaleImage().then(() => {
      let imageData = this._extractScaledImageData()
      imageData = this._convertToStandardArray(imageData)
      imageData = this._extractAlphaChannel(imageData)
      imageData = this._convertToMatrix(imageData)
      return imageData
    })
  }

  _scaleImage() {
    return this.scaledCanvas.scaleImage(this.drawingCanvas.imageData)
  }

  _extractScaledImageData() {
    return this.scaledCanvas.imageData.data
  }

  _convertToStandardArray(data) {
    return [...data]
  }

  _extractAlphaChannel(data) {
    return data.filter((_, index) => (index + 1) % 4 === 0)
  }

  _convertToMatrix(data) {
    return new Array(24).fill()
      .map((_, index) => {
        let start = index * 24
        let end = (index + 1) * 24
        return data.slice(start, end)
      })
  }
}

class DrawingCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.context = this.canvas.getContext('2d')
    this.context.lineWidth = 20
    this.context.lineCap = 'round'

    this.prevX = null;
    this.prevY = null;
    this.drawing = false;

    this.canvas.addEventListener('mousedown', event => this.onMouseEvent(event, 'onMouseDown'))
    this.canvas.addEventListener('mousemove', event => this.onMouseEvent(event, 'onMouseMove'))
    this.canvas.addEventListener('mouseup', event => this.onMouseEvent(event, 'onMouseUp'))
  }

  onMouseEvent(event, handlerName) {
    let x = event.clientX - this.canvas.offsetLeft - 1
    let y = event.clientY - this.canvas.offsetTop - 1
    this[handlerName](x, y)
  }

  onMouseDown(x, y) {
    this.drawing = true
    this.context.beginPath()
    this.context.moveTo(x, y)
    this.prevX = x, this.prevY = y
  }

  onMouseMove(x, y) {
    if (this.drawing) {
      this.context.lineTo(x, y)
      this.context.stroke()
      this.prevX = x, this.prevY = y
    }
  }

  onMouseUp(x, y) {
    this.context.lineTo(x, y)
    this.context.stroke()
    this.prevX = x, this.prevY = y
    this.drawing = false
  }

  clear() {
    this.context.clearRect(0, 0, 240, 240)
  }

  get imageData() {
    return this.context.getImageData(0, 0, 240, 240)
  }
}

class ScaledCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.context = this.canvas.getContext('2d')
    this.context.scale(0.1, 0.1)
  }

  scaleImage(imageData) {
    return createImageBitmap(imageData)
      .then(imageBitmap => this.context.drawImage(imageBitmap, 0, 0))
  }

  clear() {
    this.context.clearRect(0, 0, 240, 240)
  }

  get imageData() {
    return this.context.getImageData(0, 0, 24, 24)
  }
}