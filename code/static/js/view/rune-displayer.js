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
