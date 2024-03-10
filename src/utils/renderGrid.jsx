import Square from "../components/Square";

// renders a single square
const renderSquare = (value, i, j, handleClick) => (
	<Square key={`${i}${j}`} value={value} onClick={() => handleClick(i, j)} />
);

// renders individual tic-tac-toes
const renderGrid = (row, i, activeGrid, winnerGrid, handleClick) => {
	return (
		<div
			key={i}
			className="inline-grid grid-cols-3 gap-0.5 bg-primaryGray border-4 border-primaryLight"
		>
			{row.map((value, j) => renderSquare(value, i, j, handleClick))}
		</div>
	);
};

export default renderGrid;
