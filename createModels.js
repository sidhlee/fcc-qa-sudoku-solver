const fs = require('fs').promises;

/**
 * Create an array of grid cells
 * @param {string[]} rowNames
 * @param {string[]} colNames
 */
const createGridCells = (rowNames, colNames) => {
  let result = [];
  for (let r = 0; r < rowNames.length; r++) {
    for (let c = 0; c < colNames.length; c++) {
      result.push(`${rowNames[r]}${colNames[c]}`);
    }
  }
  return result;
};

const rowNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const colNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const gridCells = createGridCells(rowNames, colNames);

/**
 * An array containing grid rows. A grid row contains all cells in each row.
 */
const gridRows = rowNames.map((rowName) =>
  createGridCells([rowName], colNames)
);

const gridCols = colNames.map((colName) =>
  createGridCells(rowNames, [colName])
);

const subgrids = (() => {
  const result = [];
  for (let r = 0; r < 9; r += 3) {
    for (let c = 0; c < 9; c += 3) {
      const subgridRows = rowNames.slice(r, r + 3);
      const subgridCols = colNames.slice(c, c + 3);
      result.push(createGridCells(subgridRows, subgridCols));
    }
  }
  return result;
})();

// You could also put together groups declaratively -
// find groups that include cellName
const cellGroupsMap = gridCells.reduce((obj, cellName, i) => {
  obj[cellName] = [
    gridRows[~~(i / 9)],
    gridCols[i % 9],
    subgrids[(~~(i / 3) % 3) + ~~(i / 27) * 3],
  ];
  return obj;
}, {});

const cellSubgridMap = gridCells.reduce((obj, cellName, i) => {
  obj[cellName] = subgrids[(~~(i / 3) % 3) + ~~(i / 27) * 3];
  return obj;
}, {});

/**
 * Map cell to an array of all its peers
 * (Use this to check a number is contained in all peers no more than once)
 */
const cellPeersMap = gridCells.reduce((obj, cellName) => {
  const all = [
    ...cellGroupsMap[cellName][0],
    ...cellGroupsMap[cellName][1],
    ...cellGroupsMap[cellName][2],
  ].filter((peer) => peer !== cellName);

  const set = new Set(all);

  obj[cellName] = [...set];
  return obj;
}, {});

const grid = {
  cells: gridCells,
  rows: gridRows,
  cols: gridCols,
  subgrids,
  cellGroupsMap,
  cellPeersMap,
  cellSubgridMap,
};

module.exports = async () => {
  try {
    await fs.writeFile('./models/grid.json', JSON.stringify(grid));
  } catch (err) {
    console.log('Error while creating models...', err);
  }
};
