import getGridWinner from "./helpers/getGridWinner";

// calculate winner for the entire tic-tac-toe
const calculateWinner = (squares, winnerArr, setwinnerArr) => {
	if (winnerArr && winnerArr.every((value) => value !== null)) return;

	squares.map((square, i) => {
		if (winnerArr[i] !== null) return;
		// if grid is full, set winnerArr to draw
		if (isGridFull(squares, i)) {
			setwinnerArr((prev) =>
				prev.map((value, idx) =>
					idx === i ? { label: "D", sequence: null } : value
				)
			);
		}
		if (square) {
			const gridWinner = getGridWinner(square);
			// if X is winner, set winnerArr to W
			if (gridWinner && gridWinner.label === "X") {
				setwinnerArr((prev) =>
					prev.map((value, idx) =>
						idx === i
							? { label: "W", sequence: gridWinner.sequence }
							: value
					)
				);
			}
			// // if O is winner, set winnerArr to L
			else if (gridWinner && gridWinner.label === "O") {
				setwinnerArr((prev) =>
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

function calculateScores(winnerArr) {
	let scores = { red: 0, gray: 0, blue: 0 };

	winnerArr.forEach((score) => {
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

const gameLogic = (
	i,
	j,
	xIsNext,
	setXIsNext,
	setActiveGrid,
	winnerArr,
	setwinnerArr,
	squares,
	setSquares
) => {
	// if square is occupied, return
	if (squares[i][j]) return;

	// create copy of squares
	const nextSquares = [...squares];
	nextSquares[i] = [...nextSquares[i]];

	nextSquares[i][j] = xIsNext ? "X" : "O";
	const gridWinner = getGridWinner(nextSquares[i]);

	const nextActiveGrid = j;
	if (
		// gridWinner !== null ||
		isGridFull(squares, i) ||
		(i === nextActiveGrid && gridWinner !== null) ||
		winnerArr[nextActiveGrid] !== null ||
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
	// console.log("i ==> ", i, "nextActiveGrid ==> ", nextActiveGrid);
	// console.log("gridWinner ==> ", gridWinner);

	// console.log("================= if checks ===============");

	// console.log("gridWinner !== null ==> ", gridWinner !== null);
	// console.log("isGridFull(squares, i) ==> ", isGridFull(squares, i));

	// console.log(
	// 	"(i === nextActiveGrid && gridWinner !== null) ==> ",
	// 	i === nextActiveGrid && gridWinner !== null
	// );

	// console.log(
	// 	"winnerArr[nextActiveGrid] !== null ==> ",
	// 	winnerArr[nextActiveGrid] !== null
	// );

	// console.log(
	// 	"isGridFull(squares, nextActiveGrid) ==> ",
	// 	isGridFull(squares, nextActiveGrid)
	// );
	// console.log("****************************************");
};

export { gameLogic, isGridFull, calculateWinner, calculateScores };
