/**
 * Finds and updates the wonGrids state with winner & sequence of each grid.
 *
 * @param {Array} cells 2D array containing the tic-tac-toe grid.
 * @param {Array} wonGrids Array tracking result & sequence of each grid.
 * @param {Function} setWonGrids Function to update wonGrids.
 */

import isGridFull from "./isGridFull";
import getGridWinner from "./getGridWinner";

const updateWonGrid = (cells, wonGrids, setWonGrids) => {
	// if all grids are not null, return
	if (wonGrids && wonGrids.every((value) => value !== null)) return;

	cells.map((cell, i) => {
		// if grid is not null, return
		if (wonGrids[i] !== null) return;

		// if grid is full, set grid to draw
		if (isGridFull(cells, i)) {
			setWonGrids((prev) =>
				prev.map((val, idx) =>
					i === idx ? { result: "D", sequence: null } : val
				)
			);
		}

		// if cell is not null, find winner
		const gridWinner = getGridWinner(cell);

		if (gridWinner) {
			// if X is winner, set result to W else set result to L
			const result = gridWinner.winner === "X" ? "W" : "L";
			const sequence = gridWinner.sequence;

			setWonGrids((prev) =>
				prev.map((val, idx) => (i === idx ? { result, sequence } : val))
			);
		}
	});
};

export default updateWonGrid;
