import Square from "./Square";
import { useState } from "react";

function GameBoard() {
	const [xIsNext, setXIsNext] = useState(true);
	const [squares, setSquares] = useState(
		[...Array(9)].map(() => Array(9).fill(null))
	);

	const handleClick = (i, j) => {
		if (squares[i][j]) return;
		const nextSquares = [...squares];
		nextSquares[i] = [...nextSquares[i]];
		nextSquares[i][j] = xIsNext ? "X" : "O";
		setSquares(nextSquares);
		setXIsNext(!xIsNext);

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
		<div className="inline-grid grid-cols-3 gap-1">
			{row.map((value, j) => renderSquare(value, i, j))}
		</div>
	);

	return (
		<>
			<h1>Game Board</h1>
			<div className="inline-grid grid-cols-3 gap-3">
				{squares.map((row, i) => renderRow(row, i))}
			</div>
		</>
	);
}

export default GameBoard;
