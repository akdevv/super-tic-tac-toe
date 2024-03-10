import renderGrid from "../utils/renderGrid";
import useGameStates from "../hooks/useGameStates";
import { gameLogic, isGridFull } from "../utils/gameLogic";
import { useEffect } from "react";

function GameBoard() {
	const {
		xIsNext,
		setXIsNext,
		activeGrid,
		setActiveGrid,
		winnerGrid,
		setWinnerGrid,
		squares,
		setSquares,
	} = useGameStates();

	const calculateGridWinner = (squares) => {
		const lines = [
			// horizontal
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			// vertical
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			// diagonal
			[0, 4, 8],
			[2, 4, 6],
		];

		for (let i = 0; i < lines.length; i++) {
			const [a, b, c] = lines[i];
			if (
				squares[a] &&
				squares[a] === squares[b] &&
				squares[a] === squares[c]
			) {
				return squares[a];
			}
		}
		return null;
	};

	useEffect(() => {
		squares.map((square, idx) => {
			const winner = calculateGridWinner(square);
			if (winner) {
				console.log(`winner at ${idx}:`, winner);
			}
		});
	}, [squares]);

	const handleClick = (i, j) => {
		// if activeGrid is not null & activeGrid is not same as current square & activeGrid is not full, do nothing
		if (activeGrid !== null && activeGrid !== i && !isGridFull(activeGrid))
			return;
		gameLogic(
			i,
			j,
			xIsNext,
			setXIsNext,
			setActiveGrid,
			winnerGrid,
			setWinnerGrid,
			squares,
			setSquares
		);

		// const winner = calculateGridWinner(squares[i]);
		// console.log("winner:", winner);

		console.log("i:", i, "j:", j);
	};

	return (
		<>
			<h1>Game Board</h1>
			<div className="inline-grid grid-cols-3 gap-3 m-3">
				{squares.map((row, i) =>
					renderGrid(row, i, activeGrid, handleClick)
				)}
				ActiveGrid: {activeGrid}
			</div>
		</>
	);
}

export default GameBoard;
