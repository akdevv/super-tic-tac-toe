import getScores from "./helpers/getScores";
import isGridFull from "./helpers/isGridFull";
import updateWonGrid from "./helpers/updateWonGrid";
import updateActiveGrid from "./helpers/updateActiveGrid";

const gameLogic = (
	i,
	j,
	xIsNext,
	setXIsNext,
	setActiveGrid,
	wonGrids,
	cells,
	setCells
) => {
	// if cell is occupied, return
	if (cells[i][j]) return;

	// create copy of cells
	const nextCells = [...cells];
	nextCells[i] = [...nextCells[i]];

	nextCells[i][j] = xIsNext ? "X" : "O";

	updateActiveGrid(i, j, nextCells, wonGrids, setActiveGrid);
	setCells(nextCells);
	setXIsNext(!xIsNext);
};

export { gameLogic, isGridFull, updateWonGrid, getScores };
