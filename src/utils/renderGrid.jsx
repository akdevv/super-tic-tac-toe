import renderCell from "./renderCell";
import NameChip from "../components/NameChip";
import { getWinningLineStyles } from "./gameFunctions";

/**
 * Renders a grid for the game board.
 *
 * @param {Array<string | null>} grid Single Tic-Tac-Toe grid.
 * @param {number} gridIndex Index of tic-tac-toe.
 * @param {number} activeGrid Index of the current active grid.
 * @param {{
 * 		result: string,
 * 		sequence: number[]
 * 	}} wonGrids Array tracking result & sequence of each grid.
 * @param {Function} handleClick Function to update cell's value.
 * @returns {JSX.Element} The grid component.
 */

const renderGrid = (grid, gridIndex, activeGrid, wonGrids, handleClick) => {
	// determine winner line style
	const lineStyle = getWinningLineStyles(wonGrids, gridIndex);

	return (
		<div
			key={gridIndex}
			className={`relative grid-cols-3 inline-grid gap-0.5 bg-primaryGray border-4 group ${
				activeGrid === gridIndex
					? "border-playerBlue"
					: "border-primaryLight"
			}`}
		>
			{grid.map((cell, cellIndex) =>
				renderCell(cell, gridIndex, cellIndex, handleClick)
			)}

			{wonGrids[gridIndex] && (
				<>
					{/* show line over won grids */}
					<div
						className="absolute h-0.5 bg-primaryDark"
						style={{ ...lineStyle }}
					/>

					{/* show winner name on hover */}
					<div
						className="absolute invisible transition-all duration-100 ease-in-out bg-center group-hover:visible"
						style={{
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
						}}
					>
						{wonGrids[gridIndex].result === "W" && (
							<NameChip name={"Player1"} color={"playerRed"} />
						)}
						{wonGrids[gridIndex].result === "L" && (
							<NameChip name={"Player2"} color={"playerBlue"} />
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default renderGrid;
