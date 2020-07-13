/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

let Solver;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load sudoku solver then run tests

    Solver = require('../public/sudoku-solver.js');
  });

  suite('Text area and sudoku grid update automatically', () => {
    // Entering a valid number in the text area populates
    // the correct cell in the sudoku grid with that number
    test('Valid number in text area populates correct cell in grid', (done) => {
      const sudokuString =
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const textArea = document.getElementById('text-input');
      textArea.value = sudokuString;

      Solver.setGrid(textArea.value);

      const sudokuInputs = document.querySelectorAll('.sudoku-input');

      const inputValues = [...sudokuInputs].map((input) =>
        !input.value ? '.' : input.value
      );

      assert.deepStrictEqual(inputValues, sudokuString.split(''));
      done();
    });

    // Entering a valid number in the grid automatically updates
    // the puzzle string in the text area
    test('Valid number in grid updates the puzzle string in the text area', (done) => {
      const sudokuString =
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const sudokuInputs = document.querySelectorAll('.sudoku-input');
      sudokuInputs.forEach((input, i) => {
        const inputValue = sudokuString[i];
        input.value = inputValue === '.' ? '' : inputValue;
      });
      const textInput = document.getElementById('text-input');
      Solver.setTextArea();
      assert.strictEqual(textInput.value, sudokuString);
      done();
    });
  });

  suite('Clear and solve buttons', () => {
    // Pressing the "Clear" button clears the sudoku
    // grid and the text area
    test('Function clearInput()', (done) => {
      // pre-populate text input and grid
      const sudokuString =
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const textInput = document.getElementById('text-input');
      textInput.value = sudokuString;
      Solver.setGrid(textInput.value);

      // jsdom only handles static html, meaning that it cannot generate event
      // So we resort to calling handler directly
      Solver.clearInput();

      assert.strictEqual(textInput.value, '');

      const sudokuInputs = document.querySelectorAll('.sudoku-input');
      // filter out inputs whose values are empty.
      const inputValues = [...sudokuInputs].filter(
        (input) => input.value !== ''
      );
      assert.strictEqual(inputValues.length, 0);
      done();
    });

    // Pressing the "Solve" button solves the puzzle and
    // fills in the grid with the solution
    test('Function showSolution(solve(input))', (done) => {
      const sudokuString =
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const textInput = document.getElementById('text-input');
      textInput.value = sudokuString;
      Solver.setGrid(textInput.value);

      const solvedGrid = Solver.solveSudoku(textInput.value);
      Solver.displaySolution(solvedGrid);

      const solutionString =
        '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      assert.strictEqual(textInput.value, solutionString);

      const gridInputs = document.querySelectorAll('.sudoku-input');
      const gridInputValues = [...gridInputs].map((input) =>
        input.value ? input.value : '.'
      );
      assert.strictEqual(gridInputValues.join(''), solutionString);
      done();
    });
  });
});
