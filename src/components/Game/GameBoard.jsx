import updateGameStates from "../../utils/helpers/updateGameStates";
import getGridWinner from "../../utils/helpers/getGridWinner";
import useGameLogic from "../../hooks/useGameLogic";
import { getWinningLineStyles } from "../../utils/gameFunctions";
import NameChip from "../NameChip";
import renderCell from "../../utils/renderCell";

function GameBoard(props) {
	// renders individual tic-tac-toes
	const renderGrid = (row, i, activeGrid, wonGrids, handleClick) => {
		// winner line style
		const lineStyle = getWinningLineStyles(wonGrids, i);

		return (
			<div
				key={i}
				className={`relative inline-grid grid-cols-3 gap-0.5 bg-primaryGray border-4 group ${
					activeGrid === i
						? "border-playerBlue"
						: "border-primaryLight"
				}`}
			>
				{row.map((value, j) => renderCell(value, i, j, handleClick))}

				{wonGrids[i] && (
					<>
						<div
							className="absolute h-0.5 bg-primaryDark"
							style={{ ...lineStyle }}
						/>
						<div
							className="absolute invisible transition-all duration-100 ease-in-out bg-center group-hover:visible"
							style={{
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
							}}
						>
							{wonGrids[i].result === "W" && (
								<NameChip
									name={"Player1"}
									color={"playerRed"}
								/>
							)}
							{wonGrids[i].result === "L" && (
								<NameChip
									name={"Player2"}
									color={"playerBlue"}
								/>
							)}
						</div>
					</>
				)}
			</div>
		);
	};

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
					{cells.map((row, i) =>
						renderGrid(row, i, activeGrid, wonGrids, handleClick)
					)}
				</div>
			</div>
		</>
	);
}

export default GameBoard;
