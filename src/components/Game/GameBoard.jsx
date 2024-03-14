import { useEffect } from "react";
import renderGrid from "../../utils/renderGrid";
import {
	calculateWinner,
	calculateScores,
	gameLogic,
	isGridFull,
} from "../../utils/gameLogic";
import getGridWinner from "../../utils/helpers/getGridWinner";

function GameBoard(props) {
	let isGameOver = false;

	const {
		xIsNext,
		setXIsNext,
		activeGrid,
		setActiveGrid,
		winnerArr,
		setwinnerArr,
		cells,
		setCells,
		setScores,
	} = props;

	// find the final winner
	const calculateFinalWinner = (winnerArr, scores) => {
		let finalWinner;
		// find is there is any winning lines
		// make arr of lables from winnerArr
		const winnerLabels = winnerArr.map((value) => value?.label);
		const winnerLine = getGridWinner(winnerLabels);
		if (winnerLine) {
			finalWinner = winnerLine.label;
			isGameOver = true;
		} else {
			// if the grid is full, then check the scores
			if (winnerArr.every((value) => value !== null)) {
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
		// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
		// console.log("winnerArr ==> ", winnerArr);
		// console.log("winnerLabels ==> ", winnerLabels);
		// console.log("isGameOver ==> ", isGameOver);
		// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");

		return { finalWinner, isGameOver };
	};

	// calculate winner and scores
	useEffect(() => {
		calculateWinner(cells, winnerArr, setwinnerArr);
		const scores = calculateScores(winnerArr);
		setScores(scores);
		const { finalWinner, isGameOver } = calculateFinalWinner(
			winnerArr,
			scores
		);
		if (isGameOver) {
			alert(`Game Over! ${finalWinner} wins!`);
		}
	}, [cells, winnerArr, setScores, setwinnerArr]);

	const handleClick = (i, j) => {
		// if activeGrid is not null & activeGrid is not same as current cells & activeGrid is not full, do nothing
		if (activeGrid !== null && activeGrid !== i && !isGridFull(activeGrid))
			return;
		if (winnerArr[i] !== null) return;
		gameLogic(
			i,
			j,
			xIsNext,
			setXIsNext,
			setActiveGrid,
			winnerArr,
			setwinnerArr,
			cells,
			setCells
		);
	};

	// REMOVE THESE LATER
	// console.log("-------------------------------------");
	// // console.log("xIsNext ==> ", xIsNext);
	// // console.log("activeGrid ==> ", activeGrid);
	winnerArr.map((value, idx) => console.log(`winnerArr[${idx}] ==>`, value));
	// console.log("-------------------------------------");

	return (
		<>
			<div className="flex justify-center items-center">
				<div className="inline-grid grid-cols-3 sm:gap-1.5 gap-1 bg-primaryDark">
					{cells.map((row, i) =>
						renderGrid(row, i, activeGrid, winnerArr, handleClick)
					)}
				</div>
			</div>
		</>
	);
}

export default GameBoard;
