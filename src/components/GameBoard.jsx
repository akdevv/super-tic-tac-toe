import Square from "./Square";
import { gameLogic, isGridFull } from "../utils/gameLogic";
import useGameStates from "../hooks/useGameStates";

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
			{
				squares,
				setSquares,
				xIsNext,
				setXIsNext,
				setActiveGrid,
			},
			i,
			j
		);

		console.log("i:", i, "j:", j);
	};

	const renderSquare = (value, i, j) => (
		<Square
			key={`${i}${j}`}
			value={value}
			onClick={() => handleClick(i, j)}
		/>
	);

	const renderRow = (row, i) => (
		<div key={i} className="inline-grid grid-cols-3 gap-1">
			{row.map((value, j) => renderSquare(value, i, j))}
		</div>
	);

	return (
		<>
			<h1>Game Board</h1>
			<div className="inline-grid grid-cols-3 gap-3 m-3">
				{squares.map((row, i) => renderRow(row, i))}
				ActiveGrid: {activeGrid}
			</div>
		</>
	);
}

export default GameBoard;
