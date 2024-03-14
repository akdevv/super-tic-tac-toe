// calculate winner for the entire tic-tac-toe
const calculateWinner = (squares, winnerGrid, setWinnerGrid) => {
	if (winnerGrid && winnerGrid.every((value) => value !== null)) return;

	squares.map((square, i) => {
		if (winnerGrid[i] !== null) return;
		// if grid is full, set winnerGrid to draw
		if (isGridFull(squares, i)) {
			setWinnerGrid((prev) =>
				prev.map((value, idx) =>
					idx === i ? { label: "D", sequence: null } : value
				)
			);
		}
		if (square) {
			const gridWinner = calculateGridWinner(square);
			// if X is winner, set winnerGrid to W
			if (gridWinner && gridWinner.label === "X") {
				setWinnerGrid((prev) =>
					prev.map((value, idx) =>
						idx === i
							? { label: "W", sequence: gridWinner.sequence }
							: value
					)
				);
			}
			// // if O is winner, set winnerGrid to L
			else if (gridWinner && gridWinner.label === "O") {
				setWinnerGrid((prev) =>
					prev.map((value, idx) =>
						idx === i
							? { label: "L", sequence: gridWinner.sequence }
							: value
					)
				);
			}
		}
	});
};

function calculateScores(winnerGrid) {
	let scores = { red: 0, gray: 0, blue: 0 };

	winnerGrid.forEach((score) => {
		if (score && score.label === "W") {
			scores.red += 1;
		} else if (score && score.label === "L") {
			scores.blue += 1;
		} else {
			// Count both 'null' and 'd' as gray
			scores.gray += 1;
		}
	});

	return scores;
}

// check if the tic-tac-toe is full
const isGridFull = (squares, gridIndex) => {
	if (squares[gridIndex]) {
		return squares[gridIndex].every((value) => value !== null);
	}
};

// is the game over
const isGameOver = (winnerGrid) => {
	return winnerGrid.every((value) => value !== null);
};

const gameLogic = (
	i,
	j,
	xIsNext,
	setXIsNext,
	setActiveGrid,
	winnerGrid,
	setWinnerGrid,
	squares,
	setSquares
) => {
	// if square is occupied, return
	if (squares[i][j]) return;

	// create copy of squares
	const nextSquares = [...squares];
	nextSquares[i] = [...nextSquares[i]];

	nextSquares[i][j] = xIsNext ? "X" : "O";
	const gridWinner = calculateGridWinner(nextSquares[i]);

	const nextActiveGrid = j;
	if (
		gridWinner !== null ||
		isGridFull(squares, i) ||
		(i === nextActiveGrid && gridWinner !== null) ||
		winnerGrid[nextActiveGrid] !== null ||
		isGridFull(squares, nextActiveGrid)
	) {
		setActiveGrid(null);
	} else {
		setActiveGrid(nextActiveGrid);
	}

	setSquares(nextSquares);
	setXIsNext(!xIsNext);

	// REMOVE THIS LATER
	// console.log("****************************************");
	// console.log("winnerGrid ==>", winnerGrid);
	// console.log("****************************************");
};

export { gameLogic, isGridFull, calculateWinner, calculateScores };
