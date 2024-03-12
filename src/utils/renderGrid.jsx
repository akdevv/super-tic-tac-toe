import Square from "../components/Square";
import getWinnerLine from "./getWinnerLine";

// renders a single square
const renderSquare = (value, i, j, handleClick) => (
	<Square key={`${i}${j}`} value={value} onClick={() => handleClick(i, j)} />
);

// renders individual tic-tac-toes
const renderGrid = (row, i, activeGrid, winnerGrid, handleClick) => {
	// winner line style
	const lineStyle = getWinnerLine(winnerGrid, i);

	return (
		<div
			key={i}
			className="relative inline-grid grid-cols-3 gap-0.5 bg-primaryGray border-4 border-primaryLight"
		>
			{row.map((value, j) => renderSquare(value, i, j, handleClick))}

			{/* show win line */}
			{winnerGrid[i] && (
				<div
					className="absolute h-0.5 bg-primaryDark"
					style={{ ...lineStyle }}
				></div>
			)}
		</div>
	);
};

export default renderGrid;
