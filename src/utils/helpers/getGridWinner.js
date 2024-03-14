/**
 * Finds and returns the winner in a tic-tac-toe grid.
 *
 * @param {Array<string|null>} cells The tic-tac-toe grid to check for a winner.
 *
 * @returns {?{winner: string, sequence: number[]}} Object with winner and sequence | null.
 *
 * @example
 * // Example: Winner "X" in the top row
 * const cells = ["X", "X", "X", "O", null, "O", null, null, null];
 * getGridWinner(cells); // Returns { winner: "X", sequence: [0, 1, 2] }
 *
 * @example
 * // Example: No winner
 * const cells = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
 * getGridWinner(cells); // Returns null
 *
 */

const getGridWinner = (cells) => {
	const winningLines = [
		// Horizontal lines
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],

		// Vertical lines
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],

		// Diagonal lines
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let line of winningLines) {
		const [a, b, c] = line;
		if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
			return { winner: cells[a], sequence: line };
		}
	}
	return null;
};

export default getGridWinner;
