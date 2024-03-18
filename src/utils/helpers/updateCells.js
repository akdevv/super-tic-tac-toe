/**
 * Updates the game board with the player's move.
 *
 * @param {number} gridIndex Index of tic-tac-toe.
 * @param {number} cellIndex Index of single square (cell) of tic-tac-toe.
 * @param {Array<Array<string | null>>} cells The current state of the game board.
 * @param {boolean} xIsNext If true, X is next else O is next.
 * @param {Function} setCells Function to update cells.
 * @returns {Array<Array<string | null>>} The updated state of the game board.
 */

const updateCells = (gridIndex, cellIndex, cells, xIsNext, setCells) => {
	if (cells[gridIndex][cellIndex]) return;

	// create copy of cells
	const nextCells = [...cells];
	nextCells[gridIndex] = [...nextCells[gridIndex]];

	// set the cell to X or O
	nextCells[gridIndex][cellIndex] = xIsNext ? "X" : "O";
	setCells(nextCells);

	return nextCells;
};

export default updateCells;
