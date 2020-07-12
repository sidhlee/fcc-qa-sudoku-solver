const fs = require('fs').promises;

const reference = () => {
  const combine = (a, b) => {
    const combos = [];
    for (let i in a) {
      for (let j in b) {
        combos.push(a[i] + b[j]);
      }
    }

    return combos;
  };

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const cols = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const rowSquare = [
    ['A', 'B', 'C'],
    ['D', 'E', 'F'],
    ['G', 'H', 'I'],
  ];
  const colSquare = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ];

  const coords = combine(rows, cols);
  const rowUnits = rows.map((row) => combine(row, cols));
  const colUnits = cols.map((col) => combine(rows, col));
  const boxUnits = rowSquare.reduce((acc, curr) => {
    colSquare.forEach((col, j) => {
      acc.push(combine(curr, colSquare[j]));
    });

    return acc;
  }, []);

  const allUnits = rowUnits.concat(colUnits, boxUnits);
  const groups = {};
  /* 
    Generate an array of the three units (row, col, and box) that contain a single
    cell/coordinate. Each unit has a length of 9.
  */
  groups.units = coords.reduce((acc, currCell) => {
    acc[currCell] = allUnits.reduce((acc, currArr) => {
      if (currArr.includes(currCell)) {
        acc.push(currArr);
      }

      return acc;
    }, []);

    return acc;
  }, {});
  /* 
    Generate a list of peers for each cell/coordinate, which
    is a list of all cells in the three units *except* the cell
    itself. For ex., the peers of C2 are all the cells in its 
    three units except for C2. Each peer list has a length of 20.
  */
  groups.peers = coords.reduce((acc, currCell) => {
    const flattenedArr = groups.units[currCell].reduce((acc, currArr) => {
      currArr.forEach((el) => acc.push(el));
      return acc;
    }, []);

    acc[currCell] = Array.from(new Set(flattenedArr)).filter(
      (el) => el !== currCell
    );

    return acc;
  }, {});

  return {
    coords,
    groups,
    allUnits,
  };
};

// Make these available globally
const { coords, groups, allUnits } = reference();

module.exports = async () => {
  try {
    await fs.writeFile(
      './models/referenceObj.json',
      JSON.stringify(reference())
    );
  } catch (err) {
    console.log('error while writing file...', err);
  }
};
