import Square from "../components/Square";

// renders a single square
const renderSquare = (value, i, j, handleClick) => (
	<Square key={`${i}${j}`} value={value} onClick={() => handleClick(i, j)} />
);

// renders individual tic-tac-toes
const renderGrid = (row, i, activeGrid, winnerGrid, handleClick) => {
	let style = "inline-grid grid-cols-3 gap-1";
	if (activeGrid === i) {
		style += " border border-blue-400";
	} else if (winnerGrid[i] === "W" || winnerGrid[i] === "L") {
		style += " border border-green-400";
	}

	return (
		<div key={i} className={style}>
			{row.map((value, j) => renderSquare(value, i, j, handleClick))}
		</div>
	);
};

export default renderGrid;
