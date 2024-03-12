import { useEffect } from "react";
import renderGrid from "../../utils/renderGrid";
import {
	calculateWinner,
	calculateScores,
	gameLogic,
	isGridFull,
} from "../../utils/gameLogic";

function GameBoard(props) {
	const {
		xIsNext,
		setXIsNext,
		activeGrid,
		setActiveGrid,
		winnerGrid,
		setWinnerGrid,
		squares,
		setSquares,
		setScores,
	} = props;

	// calculate winner and scores
	useEffect(() => {
		calculateWinner(squares, winnerGrid, setWinnerGrid);
		const scores = calculateScores(winnerGrid);
		setScores(scores);
	}, [squares, winnerGrid]);

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
				<div className="inline-grid grid-cols-3 sm:gap-1.5 gap-1 bg-primaryDark">
					{squares.map((row, i) =>
						renderGrid(row, i, activeGrid, winnerGrid, handleClick)
					)}
				</div>
			</div>
		</>
	);
}

export default GameBoard;
