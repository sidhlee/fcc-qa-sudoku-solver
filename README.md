# freeCodeCamp\*\* - Quality Assurance 4: Sudoku Solver

---

## User stories:

1. I can enter a sudoku puzzle by filling in the text area with either a number or period (.) to represent an empty cell.
2. When a valid number is entered in the text area, the same number is applied to the correct cell of the sudoku grid.
3. I can enter a sudoku puzzle by adding numbers directly to the sudoku grid.
4. When a valid number is entered in the sudoku grid, the same number appears in the correct position in the text area.
5. The text area should only update the corresponding sudoku grid cell when a whole number between 1 and 9 is entered.
6. The sudoku grid should only update the puzzle string in the text area when a whole number between 1 and 9 is entered into a cell.
7. I can solve an incomplete puzzle by clicking the "Solve" button. When a solution is found, the sudoku grid and text area are automatically populated with the correct numbers for each cell in the grid or position in the text area.
8. This sudoku solver is not expected to be able to solve every incomplete puzzle. See `/public/puzzle-strings.js` for a list of puzzle strings it should be able to solve along with their solutions.
9. If the puzzle is not 81 numbers or periods long, append the message "Error: Expected puzzle to be 81 characters long." to the `error-msg` `div` so the text appears in red.
10. I can clear the text area and sudoku grid by clicking the "Clear" button.
11. All 6 unit tests are complete and passing. See `/tests/1_unit-tests.js` for the expected behavior you should write tests for.
12. All 4 functional tests are complete and passing. See `/tests/2_functional-tests.js` for the functionality you should write tests for.

### Testing and additional notes

- To run the tests on Glitch, set NODE_ENV to `test` without quotes.
- To run the tests in the console, use the command `npm run test`. To open the Glitch console, first click "Tools" in the bottom left corner and then click "Terminal".
- All logic can go into `public/sudoku-solver.js`.
- Create all of the unit/functional tests in `tests/1_unit-tests.js` and `tests/2_functional-tests.js`.

## Notes:

- Re-implement solving logic with different algorithm
- Current implementation is based on the [answer](https://glitch.com/~bottlenose-eucalyptus) because I wasn't sure whether that particular implementation is coupled with the FCC testing.
- But the original code is difficult to understand, disorganized and even wrong in some places.
- So I tried to re-write it as much as possible adding JSDoc and add separate module for creating data models but still limited by the main algorithm and overall structure.
