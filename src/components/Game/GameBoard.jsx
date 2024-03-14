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
		wonGrids,
		setWonGrids,
		cells,
		setCells,
		scores,
		setScores,
		isGameOver,
		setIsGameOver,
	} = props;

	console.log("scores ==> ", scores);

	// find the final winner
	const calculateFinalWinner = (wonGrids, scores) => {
		// let finalWinner;
		// find is there is any winning lines
		// make arr of lables from winnerArr
		const winnerLabels = wonGrids.map((value) => value?.winner);
		const winnerLine = getGridWinner(winnerLabels);

		if (winnerLine) {
			// finalWinner = winnerLine.label;
			setIsGameOver(!isGameOver);
		} else {
			// if the grid is full, then check the scores
			if (wonGrids.every((value) => value !== null)) {
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
	};

	useGameLogic(cells, wonGrids, setScores, setWonGrids, calculateFinalWinner);

	const handleClick = (i, j) => {
		// if activeGrid is not null & activeGrid is not same as current cells & activeGrid is not full, do nothing
		if (activeGrid !== null && activeGrid !== i && !isGridFull(activeGrid))
			return;
		if (wonGrids[i] !== null) return;
		gameLogic(
			i,
			j,
			xIsNext,
			setXIsNext,
			setActiveGrid,
			wonGrids,
			setWonGrids,
			cells,
			setCells
		);
	};

	return (
		<>
			<div className="flex items-center justify-center">
				<div className="inline-grid grid-cols-3 sm:gap-1.5 gap-1 bg-primaryDark">
					{cells.map((row, i) =>
						renderGrid(row, i, activeGrid, wonGrids, handleClick)
					)}
				</div>
			</div>
		</>
	);
}

export default GameBoard;
