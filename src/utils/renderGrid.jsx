import Cell from "../components/Game/Cell";
import getWinningLineStyles from "./getWinningLineStyles";
import NameChip from "../components/NameChip";

// renders a single cell
const renderCell = (value, i, j, handleClick) => (
	<Cell key={`${i}${j}`} value={value} onClick={() => handleClick(i, j)} />
);

// renders individual tic-tac-toes
const renderGrid = (row, i, activeGrid, wonGrids, handleClick) => {
	// winner line style
	const lineStyle = getWinningLineStyles(wonGrids, i);
	// console.log("lineStyle ==> ", lineStyle);
	// console.log("winnerArr ==> ", winnerArr);

	return (
		<div
			key={i}
			className={`relative inline-grid grid-cols-3 gap-0.5 bg-primaryGray border-4 group ${
				activeGrid === i ? "border-playerBlue" : "border-primaryLight"
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
							<NameChip name={"Player1"} color={"playerRed"} />
						)}
						{wonGrids[i].result === "L" && (
							<NameChip name={"Player2"} color={"playerBlue"} />
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default renderGrid;
