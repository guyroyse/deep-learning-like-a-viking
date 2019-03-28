class RunicViewController {
  constructor() {
    this.model = new RunicModel()

    this.saveButton = new Button('save')
    this.clearButton = new Button('clear')
    this.detectButton = new Button('detect')

    this.runeToDraw = new RuneDisplayer('runeToDraw')
    this.detectedRune = new RuneDisplayer('detectedRune')

    this.runicCanvas = new RunicCanvas('drawingCanvas', 'scalingCanvas')

    this.saveButton.onClick(() => this.onSaveClicked())
    this.clearButton.onClick(() => this.onClearClicked())
    this.detectButton.onClick(() => this.onDetectClicked())

    this.runeToDraw.rune = this.model.randomRune()
  }

  onSaveClicked() {
    let rune = this.runeToDraw.rune
    this.runicCanvas.fetchImageData()
      .then(imageData => this.model.save(rune, imageData))
      .then(() => {
        this.runicCanvas.clear()
        this.runeToDraw.rune = this.model.randomRune()
      })
  }

  onClearClicked() {
    this.runicCanvas.clear()
    this.detectedRune.clear()
  }

  onDetectClicked() {
    this.runicCanvas.fetchImageData()
      .then(imageData => this.model.detect(imageData))
      .then(rune => this.detectedRune.rune = rune)
  }
}
