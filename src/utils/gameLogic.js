// check if the grid is full
const isGridFull = (squares, gridIndex) => {
	if (squares[gridIndex]) {
		return squares[gridIndex].every((value) => value !== null);
	}
};

const gameLogic = (
	i,
	j,
	squares,
	setSquares,
	xIsNext,
	setXIsNext,
	setActiveGrid
) => {
	// if square is filled, return
	if (squares[i][j]) return;

	// create copy of squares
	const nextSquares = [...squares];
	nextSquares[i] = [...nextSquares[i]];

	// set the square to X or O based on xIsNext
	nextSquares[i][j] = xIsNext ? "X" : "O";

	// set the next active grid
	const nextActiveGrid = j;
	if (isGridFull(squares, nextActiveGrid)) {
		setActiveGrid(null); // Set all grids as active for one move
	} else {
		setActiveGrid(nextActiveGrid);
	}

	// update squares
	setSquares(nextSquares);

	// toggle xIsNext
	setXIsNext(!xIsNext);
};

export { gameLogic, isGridFull };
