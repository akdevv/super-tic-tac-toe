import { updateCells, updateActiveGrid } from "../gameFunctions";

/**
 * Update the game states based on the current move.
 *
 * @param {number} rowIndex The row index of the current move.
 * @param {number} colIndex The column index of the current move.
 * @param {boolean} xIsNext If true, X is next else O is next.
 * @param {Function} setXIsNext Function to toggle the current player.
 * @param {{
 * 		result: string,
 * 		sequence: number[]
 * 	}} wonGrids Array tracking result & sequence of each grid.
 * @param {number | null} activeGrid The index of the current playable grid.
 * @param {Function} setActiveGrid Function to set the next active grid.
 * @param {Array<Array<string | null>>} cells The current state of game board.
 * @param {Function} setCells Function to update current state of game board.
 */

const updateGameStates = (
	rowIndex,
	colIndex,
	xIsNext,
	setXIsNext,
	wonGrids,
	activeGrid,
	setActiveGrid,
	cells,
	setCells
) => {
	// if activeGrid is !null, and move is not in activeGrid, return
	//  (activeGrid = null means any grid can be played)
	if (activeGrid !== null && activeGrid !== rowIndex) return;

	// if the grid is already won, return
	if (wonGrids[rowIndex] !== null) return;

	const nextCells = updateCells(rowIndex, colIndex, cells, xIsNext, setCells);
	updateActiveGrid(rowIndex, colIndex, nextCells, wonGrids, setActiveGrid);
	setXIsNext(!xIsNext); // toggle player
};

export default updateGameStates;
