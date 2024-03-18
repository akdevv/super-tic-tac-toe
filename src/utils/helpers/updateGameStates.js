import { updateCells, updateActiveGrid } from "../gameFunctions";

/**
 * Update the game states based on the current move.
 *
 * @param {number} gridIndex Grid (tic-tac-toe) index of current move.
 * @param {number} cellIndex Cell (square) index of current move.
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
	gridIndex,
	cellIndex,
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
	if (activeGrid !== null && activeGrid !== gridIndex) return;

	// if the grid is already won, return
	if (wonGrids[gridIndex] !== null) return;

	const nextCells = updateCells(
		gridIndex,
		cellIndex,
		cells,
		xIsNext,
		setCells
	);
	updateActiveGrid(gridIndex, cellIndex, nextCells, wonGrids, setActiveGrid);
	setXIsNext(!xIsNext); // toggle player
};

export default updateGameStates;
