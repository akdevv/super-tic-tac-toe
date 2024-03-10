import renderRows from "../utils/renderRows";
import useGameStates from "../hooks/useGameStates";
import { gameLogic, isGridFull } from "../utils/gameLogic";

function GameBoard() {
	const {
		xIsNext,
		setXIsNext,
		activeGrid,
		setActiveGrid,
		squares,
		setSquares,
	} = useGameStates();

	const handleClick = (i, j) => {
		// if activeGrid is not null & activeGrid is not same as current square & activeGrid is not full, do nothing
		if (activeGrid !== null && activeGrid !== i && !isGridFull(activeGrid))
			return;
		gameLogic(
			i,
			j,
			squares,
			setSquares,
			xIsNext,
			setXIsNext,
			setActiveGrid
		);

		console.log("i:", i, "j:", j);
	};

	return (
		<>
			<h1>Game Board</h1>
			<div className="inline-grid grid-cols-3 gap-3 m-3">
				{squares.map((row, i) =>
					renderRows(row, i, activeGrid, handleClick)
				)}
				ActiveGrid: {activeGrid}
			</div>
		</>
	);
}

export default GameBoard;
