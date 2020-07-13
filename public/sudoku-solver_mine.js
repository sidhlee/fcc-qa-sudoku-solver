// Native module system needs file extension!
import grid from './grid.js';

const textArea = document.getElementById('text-input');
const solveButton = document.getElementById('solve-button');
const clearButton = document.getElementById('clear-button');
const sudokuInputs = document.querySelectorAll('.sudoku-input');
const errorDiv = document.getElementById('error-msg');
// import { puzzlesAndSolutions } from './puzzle-strings.js';

/**
 * Check if the number is a one-digit string between 1 - 9
 * @param {string} numberStr
 */
const isNumberValid = (numberStr) => {
  return /^[1-9]$/.test(numberStr);
};

/**
 * Set each grid cell with the valid number from the textarea
 * @param {string} str
 */
const setGrid = (str) => {
  const numbers = str.split('');
  numbers.forEach((number, i) => {
    if (isNumberValid(number)) {
      sudokuInputs[i].value = number;
    }
  });
};

/**
 * Convert NodeList to valid sudoku string
 * @param {NodeList} nodeList
 */
const convertInputsToString = (nodeList) => {
  let result = '';
  for (let i = 0; i < nodeList.length; i++) {
    if (isNumberValid(nodeList[i].value)) {
      result += nodeList[i].value;
    } else {
      result += '.';
    }
  }
  return result;
};

/**
 * Set textarea with the sudoku string converted from the grid inputs
 * @param {NodeList} inputs
 */
const setTextArea = (inputs = sudokuInputs) => {
  const sudokuString = convertInputsToString(inputs);
  textArea.value = sudokuString;
};

/**
 * Create grid map containing key(eg. A1)-value(eg. '3') pairs
 * @param {string} gridString
 * @returns {GridMap}
 */
const createGridMap = (gridString) => {
  if (gridString.length !== 81)
    throw new Error('Error: Expected puzzle to be 81 characters long.');
  return grid.cells.reduce((obj, cellName, i) => {
    obj[cellName] = gridString[i];
    return obj;
  }, {});
};

/**
 * Return grid map from the text area input value
 */
const parseTextAreaInput = () => {
  try {
    const gridMap = createGridMap(textArea.value);
    errorDiv.innerText = '';
    return gridMap;
  } catch (err) {
    errorDiv.innerText = err.message;
  }
};

const solve = (gridString = textArea.value) => {
  errorDiv.innerText = '';
  const possibility = '123456789';
  const givenGridMap = parseTextAreaInput();
  // Filter out empty cells
  const filteredGridMap = Object.entries(givenGridMap).reduce(
    (obj, [cellName, value]) => {
      if (value !== '.') {
        obj[cellName] = value;
      }
      return obj;
    },
    {}
  );
  // Populate empty cell values with initial possibility.
  let solvedGridMap = Object.keys(givenGridMap).reduce((obj, cellName) => {
    obj[cellName] = possibility;
    return obj;
  }, {});

  const eliminate = (gridMap, cellName) => {
    // Loop through peers and...
    for (const peer of grid.cellPeersMap[cellName]) {
      // Eliminate given cell value from possibilities of all peers
      gridMap[peer] = gridMap[peer].replace(filteredGridMap[cellName], '');

      // If any cell value is reduced to an empty string, the puzzle is invalid.
      if (solvedGridMap[peer].length === 0) {
        errorDiv.innerText = 'Cannot solve invalid puzzle.';
        return;
      } else if (solvedGridMap[peer].length === 1) {
        // If peer's possibility is reduced to one number, eliminate that number from all its peers
        // eliminate(gridMap, peer);
      }
    }
  };

  // Loop through cells with valid number
  for (const cellName in filteredGridMap) {
    solvedGridMap = eliminate(solvedGridMap, cellName);
  }
  return solvedGridMap;
};

document.addEventListener('DOMContentLoaded', () => {
  // Load a simple puzzle into the text area
  textArea.value =
    '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  setGrid(textArea.value);
  [...sudokuInputs].forEach((input) =>
    input.addEventListener('input', () => {
      setTextArea();
    })
  );
  solveButton.addEventListener('click', () => {
    console.log(solve());
  });
});

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {};
} catch (err) {}
