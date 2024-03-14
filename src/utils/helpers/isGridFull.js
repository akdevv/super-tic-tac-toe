/**
 * Checks if tic-tac-toe grid is full.
 *
 * @param {Array} cells Array of tic-tac-toe grids.
 * @param {number} gridIndex Index of the grid to check.
 * @returns {boolean} returns true if full | false if not
 */

const isGridFull = (cells, gridIndex) => {
	if (cells[gridIndex]) {
		return cells[gridIndex].every((val) => val !== null);
	}
};

export default isGridFull;
