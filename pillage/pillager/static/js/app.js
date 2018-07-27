document.addEventListener('DOMContentLoaded', function () {

  let canvas = document.getElementById('canvas');
  let otherCanvas = document.getElementById('otherCanvas');

  let save = document.getElementById('save');

  let context = canvas.getContext('2d');

  let otherContext = otherCanvas.getContext('2d');
  otherContext.scale(1, 1);

  context.lineWidth = 20;
  context.lineCap = 'round';

  let prevX = null;
  let prevY = null;
  let drawing = false;

  canvas.addEventListener('mousedown', function(event) {
    drawing = true;
    let currentX = event.clientX - canvas.offsetLeft - 1;
    let currentY = event.clientY - canvas.offsetTop - 1;

    context.beginPath();
    context.moveTo(currentX, currentY);

    prevX = event.clientX - canvas.offsetLeft - 1;
    prevY = event.clientY - canvas.offsetTop - 1;
  });

  canvas.addEventListener('mousemove', function(event) {

    if (drawing) {
      let currentX = event.clientX - canvas.offsetLeft - 1;
      let currentY = event.clientY - canvas.offsetTop - 1;

      context.lineTo(currentX, currentY);
      context.stroke();

      prevX = currentX;
      prevY = currentY;
    }

  });

  canvas.addEventListener('mouseup', function(event) {
    let currentX = event.clientX - canvas.offsetLeft - 1;
    let currentY = event.clientY - canvas.offsetTop - 1;

    context.lineTo(currentX, currentY);
    context.stroke();

    drawing = false;
    prevX = null;
    prevY = null;
  });

  save.addEventListener('click', function() {
    let imageData = context.getImageData(0, 0, 240, 240);
    console.log(imageData);

    createImageBitmap(imageData).then(function(imageBitmap) {
      console.log("promise resolved");
      otherContext.scale(0.1, 0.1);
      otherContext.drawImage(imageBitmap, 0, 0);

      console.log("url", otherCanvas.toDataURL());
      let otherImageData = otherContext.getImageData(0, 0, 24, 24);
      console.log(otherImageData);

      let rawData = [...otherImageData.data];
      let theAlpha = rawData.filter((_, index) => (index + 1) % 4 === 0);
      console.log(theAlpha);

      let theMatrix = new Array(24)
        .fill() // make the empty array mappable
        .map((value, index) => {
          return theAlpha.slice(index * 24, (index + 1) * 24)
        });

      console.log(theMatrix);

    });

  });

});
