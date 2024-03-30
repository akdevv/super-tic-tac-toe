import getGridWinner from "./getGridWinner";

/**
 * Determines the final winner of the Tic-Tac-Toe game.
 *
 * @param {{
 * 		result: string,
 * 		sequence: number[]
 * 	}} wonGrids Array tracking result & sequence of each grid.
 * @param {{ wins: 0, draws: 0, losses: 0 }} scores An object containing the number of wins, losses & draws.
 * @returns {string | null} Return's final winner ('X', 'L', 'D' for draw) or null if no winner yet.
 */

const getFinalWinner = (wonGrids, scores) => {
	let finalWinner;

	// arr of winners of each grid
	const winners = wonGrids.map((grid) => grid?.result);

	// if there is winner line in whole tic-tac-toe
	const winnerLine = getGridWinner(winners);
	if (winnerLine) {
		finalWinner = winnerLine.winner;
	} else {
		// if no winner line & all grids full, then scores decide finalWinner
		if (wonGrids.every((grid) => grid !== null)) {
			if (scores.wins > scores.losses) {
				finalWinner = "X";
			} else if (scores.wins < scores.losses) {
				finalWinner = "L";
			} else {
				finalWinner = "D";
			}
		}
	}

	return finalWinner;
};

export default getFinalWinner;
