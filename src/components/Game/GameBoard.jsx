import WinnerCard from "../WinnerCard";
import renderGrid from "../../utils/renderGrid";
import useGameLogic from "../../hooks/useGameLogic";
import updateGameStates from "../../utils/helpers/updateGameStates";

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
		finalWinner,
		setFinalWinner,
	} = props;

	useGameLogic(
		cells,
		scores,
		wonGrids,
		setScores,
		setWonGrids,
		setFinalWinner
	);

	console.log("GameBoard.jsx, finalWinner: ", finalWinner);

	const handleClick = (i, j) => {
		updateGameStates(
			i,
			j,
			xIsNext,
			setXIsNext,
			wonGrids,
			activeGrid,
			setActiveGrid,
			cells,
			setCells
		);
	};

	return (
		<>
			<div className="flex items-center justify-center">
				<div className="inline-grid grid-cols-3 sm:gap-1.5 gap-1 bg-primaryDark">
					{cells.map((grid, gridIndex) =>
						renderGrid(
							grid,
							gridIndex,
							activeGrid,
							wonGrids,
							handleClick
						)
					)}
				</div>
				{finalWinner && <WinnerCard winner={finalWinner} />}
			</div>
		</>
	);
}

export default GameBoard;
