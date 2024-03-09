import Square from "./Square";
import { useState } from "react";

function GameBoard() {
	const [xIsNext, setXIsNext] = useState(true);
	const [activeGrid, setActiveGrid] = useState(null);
	const [squares, setSquares] = useState(
		[...Array(9)].map(() => Array(9).fill(null))
	);

	const isGridFull = (gridIndex) => {
		return squares[gridIndex].every((value) => value !== null);
	};

	const gameLogic = (i, j) => {
		if (squares[i][j]) return;

		const nextSquares = [...squares];
		nextSquares[i] = [...nextSquares[i]];
		nextSquares[i][j] = xIsNext ? "X" : "O";

		const nextActiveGrid = j;

		if (isGridFull(nextActiveGrid)) {
			setActiveGrid(null); // Set all grids as active for one move
		} else {
			setActiveGrid(nextActiveGrid);
		}

		setSquares(nextSquares);
		setXIsNext(!xIsNext);
	};

	const handleClick = (i, j) => {
		if (activeGrid && activeGrid !== i && !isGridFull(activeGrid)) return;
		gameLogic(i, j);

		console.log("i", i, "j", j);
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
