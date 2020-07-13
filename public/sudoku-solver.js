import { gridCells, cellPeersMap, gridAllPeerGroups } from './grid.js';

const textArea = document.getElementById('text-input');
const solveButton = document.getElementById('solve-button');
const clearButton = document.getElementById('clear-button');
const sudokuInputs = document.querySelectorAll('.sudoku-input');
// import { puzzlesAndSolutions } from './puzzle-strings.js';

/**
 * @typedef { {[cell: string]: string} } SudokuGrid
 */

/**
 * Set grid cells with numbers from text input. Set empty string for '.' or invalid characters.
 * @param {string} str
 */
const setGrid = (str) => {
  const numbers = str.split('');
  return sudokuInputs.forEach((cell, i) => {
    const num = numbers[i];
    validSudokuInput(num) && num !== '.'
      ? (cell.value = num)
      : (cell.value = '');
  });
};

/**
 * Set textarea with grid input values. Set '.' for empty/invalid input.
 */
const setTextArea = () => {
  const gridInputs = [...document.querySelectorAll('.sudoku-input')];
  textArea.value = gridInputs.reduce((str, { value }) => {
    value !== '' && validSudokuInput(value) ? (str += value) : (str += '.');
    return str;
  }, '');
};

const validSudokuInput = (str) => {
  return /^[1-9]$/.test(str);
};

/**
 * Take sudoku string and return an object with cell:value pairs
 * @param {string} str
 */
const parseSudokuString = (str) => {
  /* 
    Create a map of the incomplete sudoku puzzle at
    the beginning of the game with each cell and 
    either the current value or '.'
  */
  const cellValueMap = gridCells.reduce((obj, cell, i) => {
    obj[cell] = str[i];
    return obj;
  }, {});

  const errorDiv = document.getElementById('error-msg');

  if (str.length === 81) {
    errorDiv.innerText = '';
    return cellValueMap;
  } else {
    errorDiv.innerText = 'Error: Expected puzzle to be 81 characters long.';
    // explicitly returning null so we can handle that case when it's called
    return null;
  }
};

/**
 *
 * @param {string} sudokuString
 * @returns {SudokuGrid|false}
 */
const solveSudoku = (sudokuString = textArea.value) => {
  /*
    User clicks solve button
  */
  const initialPossibilities = '123456789';
  let initialGrid = parseSudokuString(sudokuString);
  // Bail out if the puzzle is not valid
  if (!initialGrid) return null;
  // Filter out cells with no value
  const knownCellMap = Object.keys(initialGrid).reduce((obj, cell) => {
    const cellValue = initialGrid[cell];
    if (cellValue !== '.') {
      obj[cell] = cellValue;
    }
    return obj;
  }, {});

  // populate all cells with initial possibilities
  let workingGrid = gridCells.reduce((obj, cell) => {
    obj[cell] = initialPossibilities;
    return obj;
  }, {});

  /* 
    Loop through the known cells on the initial grid 
    and begin eliminating other possibilities for cells 
    without a value -- first pass of constraint propagation
  */
  Object.entries(knownCellMap).forEach(([knownCell, knownValue]) => {
    workingGrid = removeOtherNumbers(workingGrid, knownCell, knownValue);
  });

  // If puzzle is complete after first pass, return it
  if (validateGrid(workingGrid)) {
    return workingGrid;
  }
  // Guess digits for incomplete puzzle
  return guessDigit(workingGrid);
};

/**
 * Remove all other numbers but the given number from the gridCell
 * @param {SudokuGrid} grid
 * @param {string} cell
 * @param {string} cellNumber
 * @returns {SudokuGrid | false}
 */
const removeOtherNumbers = (grid, cell, cellNumber) => {
  const otherNumbers = grid[cell].replace(cellNumber, '');

  // Eliminate other numbers from the known cells
  otherNumbers.split('').forEach((otherNumber) => {
    grid = eliminateNumber(grid, cell, otherNumber);
  });

  return grid;
};

const eliminateNumber = (grid, targetCell, removingNumber) => {
  if (!grid) return false;
  const targetCellNumbers = grid[targetCell];

  if (!targetCellNumbers.includes(removingNumber)) return grid; // Exit if we've already eliminated the value from the grid/cell

  grid[targetCell] = targetCellNumbers.replace(removingNumber, ''); // Set cell value if known, otherwise remove possibility

  const targetCellRemainingNumbers = grid[targetCell];

  if (targetCellRemainingNumbers.length === 0) {
    // If there are no possibilities after removing the number, we made a wrong guess somewhere
    return false;
  } else if (targetCellRemainingNumbers.length === 1) {
    const knownCellValue = targetCellRemainingNumbers;
    // Once we narrowed down to one number, (which we will with the initially known cells)
    // remove that number from all its peers recursively
    cellPeersMap[targetCell].forEach((peer) => {
      grid = eliminateNumber(grid, peer, knownCellValue);

      if (!grid) return false;
    });
  }

  // If there are 2 or more numbers left in the target cell,
  // (This would be the case of removing other numbers from the peer)
  // find all cells that include removed number from the target cell's peers,
  // (removed number has to be in one and only one peer)
  const PeersWithRemovedNumber = cellPeersMap[targetCell].filter(
    (targetSubgridCell) =>
      grid[targetSubgridCell] &&
      grid[targetSubgridCell].includes(removingNumber)
  );

  if (PeersWithRemovedNumber.length === 0) {
    // We made a mistake somewhere if there are no cell that include removed number
    // (Removed number must exist within the peer group)
    return false;
  } else if (
    PeersWithRemovedNumber.length === 1 && // If there is only one possible position that the removed number can end up in,
    grid[PeersWithRemovedNumber[0]].length > 1 // but the grid still has some other numbers with the removed number
  ) {
    // Try removing other numbers from that peer
    if (!removeOtherNumbers(grid, PeersWithRemovedNumber[0], removingNumber)) {
      return false; // If it fails, return false
    }
  }

  // If successfully removed other numbers from the peer that has the removed number
  // return grid.

  return grid; // But the grid might have not been solved yet. (we just removed all possible numbers from the given clue)
};

/**
 * Try removing remaining numbers from cells recursively until we find the solution or fail.
 * @param {SudokuGrid} unsolvedGrid
 * @returns {SudokuGrid|false}
 */
const guessDigit = (unsolvedGrid) => {
  // Base case 1 - failed
  if (!unsolvedGrid) return false;

  // Base case 2 - solved
  if (validateGrid(unsolvedGrid)) return unsolvedGrid;

  // Sort cells by the number of remaining numbers (ascending)
  const unresolvedCellEntries = Object.entries(unsolvedGrid)
    .filter(([cell, numbers]) => numbers.length > 1)
    .sort((a, b) => {
      return a[1].length - b[1].length;
    });

  // pick cell with least numbers
  const guessingCell = unresolvedCellEntries[0][0];

  // Try numbers from the cell that has least numbers left
  for (const guessingNumber of unsolvedGrid[guessingCell]) {
    const grid = guessDigit(
      removeOtherNumbers({ ...unsolvedGrid }, guessingCell, guessingNumber)
    );
    if (grid) return grid; // if solved, break out of the loop and return grid
  }
};

/**
 * @param {SudokuGrid} grid
 */
const validateGrid = (grid) => {
  if (!grid) return false;

  const allNumbers = '123456789'.split('');
  // peerGroups: peerRow + peerColumn + peerSubgrid
  const allPeerGroups = gridAllPeerGroups.map((peerGroup) => {
    return peerGroup.map((cell) => {
      return grid[cell];
    });
  });

  // Check if all numbers are included in all peer groups
  const isGridValid = allPeerGroups.every((peerGroup) => {
    return allNumbers.every((number) => peerGroup.includes(number));
  });

  return isGridValid;
};

/**
 *
 * @param {SudokuGrid} solvedSudoku
 */
const displaySolution = (solvedSudoku) => {
  // Only handle cases where the puzzle is valid
  if (solvedSudoku) {
    const solutionStr = Object.values(solvedSudoku).join('');
    setGrid(solutionStr);
    setTextArea();
  }
};

const clearInput = () => {
  const textArea = document.getElementById('text-input');
  textArea.value = '';
  setGrid('');
};

document.addEventListener('DOMContentLoaded', () => {
  // Set text area with a simple puzzle
  textArea.value =
    '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

  setGrid(textArea.value);
  // NodeList inherits forEach method
  sudokuInputs.forEach((input) => input.addEventListener('input', setTextArea));

  textArea.addEventListener('input', () => setGrid(textArea.value));

  solveButton.addEventListener(
    'click',
    () => {
      displaySolution(solveSudoku());
    },
    false
  );
  clearButton.addEventListener('click', clearInput, false);
});

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    validSudokuInput,
    validateGrid,
    parseSudokuString,
    solveSudoku,
    setTextArea,
    setGrid,
    clearInput,
    displaySolution,
  };
} catch (err) {} // eslint-disable-line
