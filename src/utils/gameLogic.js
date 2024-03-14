import getScores from "./helpers/getScores";
import isGridFull from "./helpers/isGridFull";
import updateWonGrid from "./helpers/updateWonGrid";
import updateActiveGrid from "./helpers/updateActiveGrid";
import updateCells from "./helpers/updateCells";

const gameLogic = (
	i,
	j,
	xIsNext,
	setXIsNext,
	setActiveGrid,
	wonGrids,
	setWonGrids,
	cells,
	setCells
) => {
	const nextCells = updateCells(i, j, cells, xIsNext, setCells);
	updateActiveGrid(i, j, nextCells, wonGrids, setActiveGrid);
	setXIsNext(!xIsNext);
};

export { gameLogic, isGridFull, updateWonGrid, getScores };
