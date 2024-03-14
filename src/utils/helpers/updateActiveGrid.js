import isGridFull from "./isGridFull";
import getGridWinner from "./getGridWinner";

/**
 * Finds and updates next active grid based on the current move.
 *
 * @param {number} i The row index of the current move.
 * @param {number} j The column index of the current move.
 * @param {Array<Array<string | null>>} cells The current state of the game board.
 * @param {Array} wonGrids Array tracking the winners of each grid.
 * @param {Function} setActiveGrid Function to set the next active grid.
 */

const updateActiveGrid = (i, j, cells, wonGrids, setActiveGrid) => {
	const gridWinner = getGridWinner(cells[i]);

	// nextActiveGrid is column index of current grid
	const nextActiveGrid = j;
	if (
		isGridFull(cells, i) ||
		(i === nextActiveGrid && gridWinner != null) ||
		wonGrids[nextActiveGrid] !== null ||
		isGridFull(cells, nextActiveGrid)
	) {
		setActiveGrid(null);
	} else {
		setActiveGrid(nextActiveGrid);
	}
};

export default updateActiveGrid;
