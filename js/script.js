const model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,

  ships: [
    { locations: [0, 0, 0], hits: ['', '', ''] },
    { locations: [0, 0, 0], hits: ['', '', ''] },
    { locations: [0, 0, 0], hits: ['', '', ''] },
  ],

  fire: function (guess) {
    for (let i = 0; i < this.numShips; i++) {
      const ship = this.ships[i];
      const index = ship.locations.indexOf(guess);

      if (ship.hits[index] === 'hit') {
        view.displayMessage('Ups, you hit again in the same field!');
        return true;
      } else if (index >= 0) {
        ship.hits[index] = 'hit';
        view.displayHit(guess);
        view.displayMessage('HIT !');

        if (this.isSunk(ship)) {
          view.displayMessage('You sunk my ship!');
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage('You misshited.');
    return false;
  },

  isSunk: function (ship) {
    for (let i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== 'hit') {
        return false;
      }
    }
    return true;
  },

  generateShipLocations: function () {
    let locations = null;
    for (let i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },

  generateShip: function () {
    const direction = Math.floor(Math.random() * 2);
    let row = null;
    let col = null;

    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }

    let newShipLocations = [];
    for (let i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + '' + (col + i));
      } else {
        newShipLocations.push(row + i + '' + col);
      }
    }
    return newShipLocations;
  },

  collision: function (locations) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      for (let j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  },
};

var view = {
  displayMessage: function (msg) {
    const messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = msg;
  },

  displayHit: function (location) {
    const cell = document.getElementById(location);
    cell.setAttribute('class', 'hit');
  },

  displayMiss: function (location) {
    const cell = document.getElementById(location);
    cell.setAttribute('class', 'miss');
  },
};

var controller = {
  guesses: 0,

  processGuess: function (guess) {
    const location = parseGuess(guess);
    if (location) {
      this.guesses++;
      const hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage(
          'You sunk all my ships at ' + this.guesses + ' attempt.'
        );
      }
    }
  },
};

function parseGuess(guess) {
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  if (guess === null || guess.length !== 2) {
    alert('Ups, I need letter and number.');
  } else {
    const firstChar = guess.charAt(0);
    const row = alphabet.indexOf(firstChar);
    const column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert('Ups, it is not coordinate!');
    } else if (
      row < 0 ||
      row >= model.boardSize ||
      column < 0 ||
      column >= model.boardSize
    ) {
      alert('Ups, field out of map!');
    } else {
      return row + column;
    }
  }
  return null;
}

function handleFireButton() {
  const guessInput = document.getElementById('guessInput');
  const guess = guessInput.value.toUpperCase();

  controller.processGuess(guess);

  guessInput.value = '';
}

function handleKeyPress(event) {
  const fireButton = document.getElementById('fireButton');

  event = event || window.event;

  if (event.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

window.onload = init;

function init() {
  const fireButton = document.getElementById('fireButton');
  fireButton.onclick = handleFireButton;

  const guessInput = document.getElementById('guessInput');
  guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations();
}
