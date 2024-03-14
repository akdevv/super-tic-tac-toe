/**
 * Updates the game board with the player's move.
 *
 * @param {number} i The row index of the cell.
 * @param {number} j The column index of the cell.
 * @param {Array<Array<string | null>>} cells The current state of the game board.
 * @param {boolean} xIsNext If true, X is next else O is next.
 * @param {Function} setCells Function to update cells.
 * @returns {Array<Array<string | null>>} The updated state of the game board.
 */

const updateCells = (i, j, cells, xIsNext, setCells) => {
	// if cell is occupied, return
	console.log("i: ", i, "j: ", j);
	console.log("cells ==> ", cells);
	console.log("cells[i][j] ==> ", cells[i][j]);

	if (cells[i][j]) return;

	// create copy of cells
	const nextCells = [...cells];
	nextCells[i] = [...nextCells[i]];

	// set the cell to X or O
	nextCells[i][j] = xIsNext ? "X" : "O";
	setCells(nextCells);

	return nextCells;
};

export default updateCells;
