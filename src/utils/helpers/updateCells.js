/**
 * Updates the game board with the player's move.
 *
 * @param {number} rowIndex The row index of the cell.
 * @param {number} colIndex The column index of the cell.
 * @param {Array<Array<string | null>>} cells The current state of the game board.
 * @param {boolean} xIsNext If true, X is next else O is next.
 * @param {Function} setCells Function to update cells.
 * @returns {Array<Array<string | null>>} The updated state of the game board.
 */

const updateCells = (rowIndex, colIndex, cells, xIsNext, setCells) => {
	// if cell is occupied, return
	console.log("rowIndex: ", rowIndex, "colIndex: ", colIndex);
	console.log("cells ==> ", cells);
	console.log("cells[i][j] ==> ", cells[rowIndex][colIndex]);

	if (cells[rowIndex][colIndex]) return;

	// create copy of cells
	const nextCells = [...cells];
	nextCells[rowIndex] = [...nextCells[rowIndex]];

	// set the cell to X or O
	nextCells[rowIndex][colIndex] = xIsNext ? "X" : "O";
	setCells(nextCells);

	return nextCells;
};

export default updateCells;
