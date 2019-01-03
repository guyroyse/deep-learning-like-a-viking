class Button {
  constructor(id) {
    this.button = document.getElementById(id)
  }

  onClick(handler) {
    this.button.addEventListener('click', handler)
  }
}
