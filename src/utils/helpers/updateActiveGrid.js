import { isGridFull, getGridWinner } from "../gameFunctions";

/**
 * Finds and updates next active grid based on the current move.
 *
 * @param {number} gridIndex Grid (tic-tac-toe) index of current move.
 * @param {number} cellIndex Cell (square) index of current move.
 * @param {Array<Array<string | null>>} cells The current state of the game board.
 * @param {{
 * 		result: string,
 * 		sequence: number[]
 * 	}} wonGrids Array tracking result & sequence of each grid.
 * @param {Function} setActiveGrid Function to set the next active grid.
 */

const updateActiveGrid = (
	gridIndex,
	cellIndex,
	cells,
	wonGrids,
	setActiveGrid
) => {
	const gridWinner = getGridWinner(cells[gridIndex]);

	// nextActiveGrid is column index of current grid
	const nextActiveGrid = cellIndex;
	if (
		isGridFull(cells, gridIndex) ||
		(gridIndex === nextActiveGrid && gridWinner != null) ||
		wonGrids[nextActiveGrid] !== null ||
		isGridFull(cells, nextActiveGrid)
	) {
		setActiveGrid(null);
	} else {
		setActiveGrid(nextActiveGrid);
	}
};

export default updateActiveGrid;
