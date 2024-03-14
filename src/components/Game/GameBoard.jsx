import { useEffect } from "react";
import renderGrid from "../../utils/renderGrid";
import {
	calculateWinner,
	calculateScores,
	gameLogic,
	isGridFull,
} from "../../utils/gameLogic";
import calculateGridWinner from "../../utils/helpers/calculateGridWinner";

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

	let isGameOver = false;

	// find the final winner
	const finalWinner = (winnerGrid, scores) => {
		//find if there is any winner lines
		// make an array of labels from winnerGrid
		const winnerLabels = winnerGrid.map((value) => value?.label);
		const winner = calculateGridWinner(winnerLabels);
		if (winner) {
			console.log("winner is ==> ", winner.label);
			isGameOver = true;
		} else {
			// if the grid is full, then check the score
			if (winnerGrid.every((value) => value !== null)) {
				if (scores.red > scores.blue) {
					console.log("winner is ==> ", "x");
					isGameOver = true;
				} else if (scores.red < scores.blue) {
					console.log("winner is ==> ", "o");
					isGameOver = true;
				} else {
					console.log("draw!");
					isGameOver = true;
				}
			}
		}
		// REMOVE THESE LATER
		// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
		// console.log("winnerGrid ==> ", winnerGrid);
		// console.log("winnerLabels ==> ", winnerLabels);
		// console.log("isGameOver ==> ", isGameOver);
		// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
	};

	// calculate winner and scores
	useEffect(() => {
		calculateWinner(squares, winnerGrid, setWinnerGrid);
		const scores = calculateScores(winnerGrid);
		setScores(scores);
		finalWinner(winnerGrid, scores);
	}, [squares, winnerGrid, setScores, setWinnerGrid]);

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

	// REMOVE THESE LATER
	// console.log("-------------------------------------");
	// // console.log("xIsNext ==> ", xIsNext);
	// // console.log("activeGrid ==> ", activeGrid);
	// winnerGrid.map((value, idx) =>
	// 	console.log(`winnerGrid[${idx}] ==>`, value)
	// );
	// console.log("-------------------------------------");

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
