const textArea = document.getElementById('text-input');
const solveButton = document.getElementById('solveButton');
const clearButton = document.getElementById('clearButton');
const sudokuInputs = document.querySelectorAll('.sudoku-input');
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

const { coords, groups, allUnits } = (() => {})();

document.addEventListener('DOMContentLoaded', () => {
  // Load a simple puzzle into the text area
  textArea.value =
    '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
});

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {};
} catch (e) {}
