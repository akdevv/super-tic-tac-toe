import Square from "../components/Square";

// renders a single square
const renderSquare = (value, i, j, handleClick) => (
	<Square key={`${i}${j}`} value={value} onClick={() => handleClick(i, j)} />
);

// renders individual tic-tac-toes
const renderRows = (row, i, handleClick) => (
	<div key={i} className="inline-grid grid-cols-3 gap-1">
		{row.map((value, j) => renderSquare(value, i, j, handleClick))}
	</div>
);

export default renderRows;
