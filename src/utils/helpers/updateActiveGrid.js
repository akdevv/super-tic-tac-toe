import isGridFull from "./isGridFull";
import getGridWinner from "./getGridWinner";

/**
 * Finds and updates next active grid based on the current move.
 *
 * @param {number} rowIndex The row index of the current move.
 * @param {number} colIndex The column index of the current move.
 * @param {Array<Array<string | null>>} cells The current state of the game board.
 * @param {{
 * 		result: string,
 * 		sequence: number[]
 * 	}} wonGrids Array tracking result & sequence of each grid.
 * @param {Function} setActiveGrid Function to set the next active grid.
 */

const updateActiveGrid = (
	rowIndex,
	colIndex,
	cells,
	wonGrids,
	setActiveGrid
) => {
	const gridWinner = getGridWinner(cells[rowIndex]);

	// nextActiveGrid is column index of current grid
	const nextActiveGrid = colIndex;
	if (
		isGridFull(cells, rowIndex) ||
		(rowIndex === nextActiveGrid && gridWinner != null) ||
		wonGrids[nextActiveGrid] !== null ||
		isGridFull(cells, nextActiveGrid)
	) {
		setActiveGrid(null);
	} else {
		setActiveGrid(nextActiveGrid);
	}
};

export default updateActiveGrid;
