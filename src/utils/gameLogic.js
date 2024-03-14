import getScores from "./helpers/getScores";
import isGridFull from "./helpers/isGridFull";
import updateWonGrid from "./helpers/getWinner";
import getGridWinner from "./helpers/getGridWinner";

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

export { gameLogic, isGridFull, updateWonGrid, getScores };
