import Square from "../components/Game/Square";
import getWinnerLine from "./getWinnerLine";
import { NameChipRed, NameChipBlue } from "../components/NameChip";

// renders a single square
const renderSquare = (value, i, j, handleClick) => (
	<Square key={`${i}${j}`} value={value} onClick={() => handleClick(i, j)} />
);

// renders individual tic-tac-toes
const renderGrid = (row, i, activeGrid, winnerGrid, handleClick) => {
	// winner line style
	const lineStyle = getWinnerLine(winnerGrid, i);
	console.log(`winnerGrid[${i}] = `, winnerGrid[i]);

	return (
		<div
			key={i}
			className="relative inline-grid grid-cols-3 gap-0.5 bg-primaryGray border-4 border-primaryLight group"
		>
			{row.map((value, j) => renderSquare(value, i, j, handleClick))}

			{winnerGrid[i] && (
				<>
					<div
						className="absolute h-0.5 bg-primaryDark"
						style={{ ...lineStyle }}
					/>
					<div
						className="absolute invisible group-hover:visible ease-in-out duration-100"
						style={{ top: "40%", left: "12%" }}
					>
						{winnerGrid[i].label === "W" ? (
							<NameChipRed name="Player1" />
						) : (
							<NameChipBlue name="Player2" />
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default renderGrid;
