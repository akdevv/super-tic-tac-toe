import Cell from "../components/Game/Cell";
import getWinnerLine from "./helpers/getWinnerLine";
import NameChip from "../components/NameChip";

// renders a single cell
const renderCell = (value, i, j, handleClick) => (
	<Cell key={`${i}${j}`} value={value} onClick={() => handleClick(i, j)} />
);

// renders individual tic-tac-toes
const renderGrid = (row, i, activeGrid, winnerArr, handleClick) => {
	// winner line style
	const lineStyle = getWinnerLine(winnerArr, i);
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

			{winnerArr[i] && (
				<>
					<div
						className="absolute h-0.5 bg-primaryDark"
						style={{ ...lineStyle }}
					/>
					<div
						className="absolute bg-center invisible group-hover:visible ease-in-out transition-all duration-100"
						style={{
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
						}}
					>
						{winnerArr[i].winner === "W" && (
							<NameChip name={"Player1"} color={"playerRed"} />
						)}
						{winnerArr[i].winner === "L" && (
							<NameChip name={"Player2"} color={"playerBlue"} />
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default renderGrid;
