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