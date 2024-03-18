import Cell from "../components/Game/Cell";

/**
 * Renders a single cell component.
 *
 * @param {string} value The value of cell (X, O, or null).
 * @param {number} rowIndex The row index of the cell.
 * @param {number} columnIndex The column index of the cell.
 * @param {Function} handleClick Function to update cell's value.
 * @returns {JSX.Element} The cell component.
 */

const renderCell = (value, rowIndex, colIndex, handleClick) => {
	return (
		<Cell
			key={`${rowIndex}${colIndex}`}
			value={value}
			onClick={() => handleClick(rowIndex, colIndex)}
		/>
	);
};

export default renderCell;
