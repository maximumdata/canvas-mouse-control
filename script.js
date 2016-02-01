var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function writeMessage(canvas, message) {
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = '18pt Calibri';
  context.fillStyle = 'black';
  context.fillRect(topSection.left, topSection.top, topSection.right, topSection.bottom);
  context.fillStyle = 'red';
  context.fillText(message, 10, 25);
}

function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

canvas.addEventListener('mousemove', function(event) {
  var mousePos = getMousePos(canvas, event);
  var message = 'Mouse Position: ' + mousePos.x + ', ' + mousePos.y;
  writeMessage(canvas, message);
  drawPlayer(canvas, mousePos);
}, false);


// edits
var guy = new image('guy.png');

/*
  these objects contain coordinates for drawing sections of the canvas.
  left = starting X, top = starting Y, right = ending X, bottom = ending Y
*/

var bottomSection = {
  left: 0,
  top: canvas.height - 200,
  right: canvas.width,
  bottom: canvas.height
};

var topSection = {
  left: 0,
  top: 0,
  right: canvas.width,
  bottom: canvas.height - 200
};
/* end */

/* player boundaries */
var playerBounds = {
  left: (canvas.width * 0.1),//256,
  right: (canvas.width * 0.9) - 64,
  top: canvas.height - 200
};
/* end */

function drawPlayer(canvas, mousePos) {
  var context = canvas.getContext('2d');
  var edge = null;

  clearSection(context, bottomSection);

  if(mousePos.x >= playerBounds.right) { edge = 'right'; }
  if(mousePos.x <= playerBounds.left) { edge = 'left'; }

  switch(edge) {
    case 'left':
      context.drawImage(guy, playerBounds.left, playerBounds.top);
      break;
    case 'right':
      context.drawImage(guy, playerBounds.right, playerBounds.top);
      break;
    default:
      context.drawImage(guy, mousePos.x, playerBounds.top);
      break;
  }
}

// drops
var square = {
    'x': playerBounds.left * 1.35,
    'y': 50,
    'width': 20,
    'height': 75,
    'fill': '#000000'
};

function renderDrop() {
  //needs  to be refactored to animate multiple drops at once
  // maybe an array that stores all on screen drop objects gets looped through each frame?
  clearSection(context, topSection);
  context.beginPath();
  context.rect(square.x, square.y, square.width, square.height);
  context.fillStyle = square.fill;
  context.fill();

  requestAnimationFrame(renderDrop);
}

renderDrop();

// libs

function image(file) {
  var tmp = new Image();
  tmp.src = file;
  return tmp;
}

function clearSection(context, obj) {
  context.clearRect(obj.left, obj.top, obj.right, obj.bottom);
}

var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(callback) {
      return setTimeout(callback, 1);
    };

function animate(property, value, duration) {
  var start = new Date().getTime();
  var end = start + duration;
  var current = square[property];
  var distance = value - current;

  function step() {
    var timestamp = new Date().getTime();
    var progress = Math.min((duration - (end - timestamp)) / duration, 1);

    square[property] = current + (distance * progress);

    if(progress < 1) { requestAnimationFrame(step); }
  }

  return step();
}

animate('y', topSection.bottom - square.height, 3000);
