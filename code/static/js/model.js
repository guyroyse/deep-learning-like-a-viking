class RunicModel {
  constructor() {
    this.adapter = new RunicAdapter()
    this.runes = new Runes()
  }

  save(rune, imageData) {
    return this.adapter.saveRune(rune.name, imageData)
  }

  detect(imageData) {
    return this.adapter.detectRune(imageData)
      .then(response => this.runes.runeForName(response.rune))
  }

  randomRune() {
    return this.runes.randomRune()
  }
}

class Runes {
  constructor() {
    this._runes = [
      { glyph: "ᚠ", name: "fe" },
      { glyph: "ᚢ", name: "ur" },
      { glyph: "ᚦ", name: "thurs" },
      { glyph: "ᚬ", name: "as" },
      { glyph: "ᚱ", name: "reith" },
      { glyph: "ᚴ", name: "kaun" },
      { glyph: "ᚼ", name: "hagall" },
      { glyph: "ᚾ", name: "nauthr" },
      { glyph: "ᛁ", name: "isa" },
      { glyph: "ᛅ", name: "ar" },
      { glyph: "ᛋ", name: "sol" },
      { glyph: "ᛏ", name: "tyr" },
      { glyph: "ᛒ", name: "bjork" },
      { glyph: "ᛘ", name: "mathr" },
      { glyph: "ᛚ", name: "logr" },
      { glyph: "ᛦ", name: "yr" }
    ]
  }

  runeForName(name) {
    return this._runes.find(rune => rune.name === name)
  }

  runeForGlyph(glyph) {
    return this._runes.find(rune => rune.glyph === glyph)
  }

  randomRune() {
    let index = this._getRandomInt(this._runes.length)
    return this._runes[index]
  }

  _getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))
  }
}
