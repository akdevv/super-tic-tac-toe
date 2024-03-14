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
	let isGameOver = false;

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

	// find the final winner
	const calculateFinalWinner = (winnerGrid, scores) => {
		let finalWinner;
		// find is there is any winning lines
		// make arr of lables from winnerGrid
		const winnerLabels = winnerGrid.map((value) => value?.label);
		const winnerLine = calculateGridWinner(winnerLabels);
		if (winnerLine) {
			finalWinner = winnerLine.label;
			isGameOver = true;
		} else {
			// if the grid is full, then check the scores
			if (winnerGrid.every((value) => value !== null)) {
				if (scores.red > scores.blue) {
					finalWinner = "X";
					isGameOver = true;
				} else if (scores.red < scores.blue) {
					finalWinner = "L";
					isGameOver = true;
				} else {
					finalWinner = "D";
					isGameOver = true;
				}
			}
		}

		// REMOVE THESE LATER
		console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
		console.log("winnerGrid ==> ", winnerGrid);
		console.log("winnerLabels ==> ", winnerLabels);
		console.log("isGameOver ==> ", isGameOver);
		console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");

		return { finalWinner, isGameOver };
	};

	// calculate winner and scores
	useEffect(() => {
		calculateWinner(squares, winnerGrid, setWinnerGrid);
		const scores = calculateScores(winnerGrid);
		setScores(scores);
		const { finalWinner, isGameOver } = calculateFinalWinner(
			winnerGrid,
			scores
		);
		if (isGameOver) {
			alert(`Game Over! ${finalWinner} wins!`);
		}
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
