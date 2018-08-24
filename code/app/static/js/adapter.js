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
