const getWinnerLine = (winnerGrid, i) => {
	if (winnerGrid[i] && winnerGrid[i].sequence) {
		const { sequence } = winnerGrid[i];

		// check if winner line is row or column
		const isRow = sequence.every(
			(val) => Math.floor(val / 3) === Math.floor(sequence[0] / 3)
		);
		const isColumn = sequence.every((val) => val % 3 === sequence[0] % 3);

		// find index of winner line
		const rowIndex = Math.floor(sequence[0] / 3);
		const columnIndex = sequence[0] % 3;

		// check if winner line is right diagonal
		const isDiagonalRight =
			sequence.includes(0) &&
			sequence.includes(4) &&
			sequence.includes(8);
		// check if winner line is left diagonal
		const isDiagonalLeft =
			sequence.includes(2) &&
			sequence.includes(4) &&
			sequence.includes(6);

		if (isDiagonalLeft) {
			return {
				left: "50%",
				top: "50%",
				width: "120%",
				transform: "translate(-50%, -50%) rotate(-45deg)",
			};
		} else if (isDiagonalRight) {
			return {
				left: "50%",
				top: "50%",
				width: "120%",
				transform: "translate(-50%, -50%) rotate(45deg)",
			};
		} else if (isRow) {
			return {
				top: `${rowIndex * 33.33 + 16.67}%`,
				left: "50%",
				width: "90%",
				transform: "translate(-50%)",
			};
		} else if (isColumn) {
			return {
				left: `${columnIndex * 33.33 + 16.67}%`,
				top: "50%",
				width: "90%",
				transform: "translate(-50%) rotate(90deg)",
			};
		}
	} else return {};
};

export default getWinnerLine;
