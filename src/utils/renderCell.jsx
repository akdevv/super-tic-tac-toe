import Cell from "../components/Game/Cell";

/**
 * Renders a single cell component.
 *
 * @param {string} value The value of cell (X, O, or null).
 * @param {number} gridIndex Index of tic-tac-toe.
 * @param {number} cellIndex Index of single square (cell) of tic-tac-toe.
 * @param {Function} handleClick Function to update cell's value.
 * @returns {JSX.Element} The cell component.
 */

const renderCell = (value, gridIndex, cellIndex, handleClick) => {
	return (
		<Cell
			key={`${gridIndex}${cellIndex}`}
			value={value}
			onClick={() => handleClick(gridIndex, cellIndex)}
		/>
	);
};

export default renderCell;
