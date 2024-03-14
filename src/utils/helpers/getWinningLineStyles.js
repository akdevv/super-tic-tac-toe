/**
 * Generates the style for the winning line in tic-tac-toe grid.
 *
 * @param {Array} gridWinners Array of winner objects.
 * @param {number} gridIndex Index of the current grid.
 * @returns {Object} Style object for winning line | null.
 */

const getWinningLineStyles = (wonGrids, gridIndex) => {
	const gridWinner = wonGrids[gridIndex];
	if (!gridWinner || !gridWinner.sequence) return {};

	const { sequence } = gridWinner;

	// find index of row and column
	const rowIndex = Math.floor(sequence[0] / 3);
	const columnIndex = sequence[0] % 3;

	// check if winning line is row or column
	const isRow = sequence.every((val) => Math.floor(val / 3) === rowIndex);
	const isColumn = sequence.every((val) => val % 3 === columnIndex);

	// check if winning line is left or right diagonal
	const isDiagonalLeft =
		sequence.includes(2) && sequence.includes(4) && sequence.includes(6);
	const isDiagonalRight =
		sequence.includes(0) && sequence.includes(4) && sequence.includes(8);

	// return styles for winning line
	if (isRow) {
		return {
			top: `${rowIndex * 33.33 + 16.67}%`,
			left: "50%",
			width: "90%",
			transform: "translate(-50%)",
		};
	} else if (isColumn) {
		return {
			left: `${columnIndex * 33.33 + 16.67}%`,
			top: "50%",
			width: "90%",
			transform: "translate(-50%) rotate(90deg)",
		};
	} else if (isDiagonalLeft) {
		return {
			left: "50%",
			top: "50%",
			width: "120%",
			transform: "translate(-50%, -50%) rotate(-45deg)",
		};
	} else if (isDiagonalRight) {
		return {
			left: "50%",
			top: "50%",
			width: "120%",
			transform: "translate(-50%, -50%) rotate(45deg)",
		};
	}

	return {};
};

export default getWinningLineStyles;
