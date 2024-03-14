/**
 * Finds and returns the winner in a tic-tac-toe grid.
 *
 * @param {Array<string|null>} squares The tic-tac-toe grid to check for a winner.
 * @returns {?{winner: string, sequence: number[]}} Object with winner and sequence | null.
 */

const getGridWinner = (squares) => {
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
		if (
			squares[a] &&
			squares[a] === squares[b] &&
			squares[a] === squares[c]
		) {
			return { winner: squares[a], sequence: line };
		}
		return null;
	}
};

export default getGridWinner;
