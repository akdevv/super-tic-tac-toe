import Square from "../components/Square";

// renders a single square
const renderSquare = (value, i, j, handleClick) => (
	<Square key={`${i}${j}`} value={value} onClick={() => handleClick(i, j)} />
);

// renders individual tic-tac-toes
const renderGrid = (row, i, activeGrid, winnerGrid, handleClick) => {
	let style = "inline-grid grid-cols-3";

	return (
		<div key={i} className={style}>
			{row.map((value, j) => renderSquare(value, i, j, handleClick))}
		</div>
	);
};

export default renderGrid;
