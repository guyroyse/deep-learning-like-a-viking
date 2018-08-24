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
