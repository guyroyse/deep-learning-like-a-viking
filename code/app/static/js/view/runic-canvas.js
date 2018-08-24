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
