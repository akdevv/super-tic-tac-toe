// calculate winner for individual tic-tac-toe
const calculateGridWinner = (squares) => {
	const lines = [
		// horizontal
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		// vertical
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		// diagonal
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (
			squares[a] &&
			squares[a] === squares[b] &&
			squares[a] === squares[c]
		) {
			return { label: squares[a], sequence: [a, b, c] };
		}
	}
	return null;
};

export default calculateGridWinner;
