import { useEffect } from "react";
import renderGrid from "../utils/renderGrid";
import useGameStates from "../hooks/useGameStates";
import { calculateWinner, gameLogic, isGridFull } from "../utils/gameLogic";

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

	// find the game winner
	useEffect(() => {
		calculateWinner(squares, winnerGrid, setWinnerGrid);
	}, [squares, winnerGrid, setWinnerGrid]);

	const handleClick = (i, j) => {
		// if activeGrid is not null & activeGrid is not same as current square & activeGrid is not full, do nothing
		if (activeGrid !== null && activeGrid !== i && !isGridFull(activeGrid))
			return;
		if (winnerGrid[i] !== null) return;
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
	};

	return (
		<>
			<div className="flex justify-center items-center">
				<div className="inline-grid grid-cols-3">
					{squares.map((row, i) =>
						renderGrid(row, i, activeGrid, winnerGrid, handleClick)
					)}
				</div>
			</div>
		</>
	);
}

export default GameBoard;
