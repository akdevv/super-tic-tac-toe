import getGridWinner from "./helpers/getGridWinner";

// calculate winner for the entire tic-tac-toe
const calculateWinner = (cells, winnerArr, setwinnerArr) => {
	if (winnerArr && winnerArr.every((value) => value !== null)) return;

	cells.map((cell, i) => {
		if (winnerArr[i] !== null) return;
		// if grid is full, set winnerArr to draw
		if (isGridFull(cells, i)) {
			setwinnerArr((prev) =>
				prev.map((value, idx) =>
					idx === i ? { label: "D", sequence: null } : value
				)
			);
		}
		if (cell) {
			const gridWinner = getGridWinner(cell);
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
const isGridFull = (cells, gridIndex) => {
	if (cells[gridIndex]) {
		return cells[gridIndex].every((value) => value !== null);
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
	cells,
	setCells
) => {
	// if cell is occupied, return
	if (cells[i][j]) return;

	// create copy of cells
	const nextCells = [...cells];
	nextCells[i] = [...nextCells[i]];

	nextCells[i][j] = xIsNext ? "X" : "O";
	const gridWinner = getGridWinner(nextCells[i]);

	const nextActiveGrid = j;
	if (
		// gridWinner !== null ||
		isGridFull(cells, i) ||
		(i === nextActiveGrid && gridWinner !== null) ||
		winnerArr[nextActiveGrid] !== null ||
		isGridFull(cells, nextActiveGrid)
	) {
		setActiveGrid(null);
	} else {
		setActiveGrid(nextActiveGrid);
	}

	setCells(nextCells);
	setXIsNext(!xIsNext);

	// REMOVE THIS LATER
	// console.log("****************************************");
	// console.log("i ==> ", i, "nextActiveGrid ==> ", nextActiveGrid);
	// console.log("gridWinner ==> ", gridWinner);

	// console.log("================= if checks ===============");

	// console.log("gridWinner !== null ==> ", gridWinner !== null);
	// console.log("isGridFull(cells, i) ==> ", isGridFull(cells, i));

	// console.log(
	// 	"(i === nextActiveGrid && gridWinner !== null) ==> ",
	// 	i === nextActiveGrid && gridWinner !== null
	// );

	// console.log(
	// 	"winnerArr[nextActiveGrid] !== null ==> ",
	// 	winnerArr[nextActiveGrid] !== null
	// );

	// console.log(
	// 	"isGridFull(cells, nextActiveGrid) ==> ",
	// 	isGridFull(cells, nextActiveGrid)
	// );
	// console.log("****************************************");
};

export { gameLogic, isGridFull, calculateWinner, calculateScores };
