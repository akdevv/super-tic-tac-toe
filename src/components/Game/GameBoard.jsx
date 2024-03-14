import renderGrid from "../../utils/renderGrid";
import { gameLogic, isGridFull } from "../../utils/gameLogic";
import getGridWinner from "../../utils/helpers/getGridWinner";
import useGameLogic from "../../hooks/useGameLogic";

function GameBoard(props) {
	const {
		xIsNext,
		setXIsNext,
		activeGrid,
		setActiveGrid,
		winnerArr,
		setwinnerArr,
		cells,
		setCells,
		scores,
		setScores,
		isGameOver,
		setIsGameOver,
	} = props;

	// find the final winner
	const calculateFinalWinner = (winnerArr, scores) => {
		// let finalWinner;
		// find is there is any winning lines
		// make arr of lables from winnerArr
		const winnerLabels = winnerArr.map((value) => value?.winner);
		const winnerLine = getGridWinner(winnerLabels);

		console.log("-----------------------------------------");
		console.log("winnerLine ==> ", winnerLine);
		console.log("winnerLabels ==> ", winnerLabels);

		if (winnerLine) {
			// finalWinner = winnerLine.label;
			setIsGameOver(!isGameOver);
		} else {
			// if the grid is full, then check the scores
			if (winnerArr.every((value) => value !== null)) {
				if (scores.red > scores.blue) {
					// finalWinner = "X";
					setIsGameOver(!isGameOver);
				} else if (scores.red < scores.blue) {
					// finalWinner = "L";
					setIsGameOver(!isGameOver);
				} else {
					// finalWinner = "D";
					setIsGameOver(!isGameOver);
				}
			}
		}
		console.log("isGameOver ==> ", isGameOver);
		console.log("-----------------------------------------");
	};

	useGameLogic(
		cells,
		winnerArr,
		setScores,
		setwinnerArr,
		calculateFinalWinner
	);

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

	return (
		<>
			<div className="flex items-center justify-center">
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
