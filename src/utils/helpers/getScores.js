/**
 * Calculates the scores based on the winner of each tic-tac-toe grid.
 *
 * @param {Array} wonGrid Array containing the winner of each grid.
 * @returns {Object} Returns an object with wins, draws, and losses.
 */

function getScores(wonGrid) {
	let scores = { wins: 0, draws: 0, losses: 0 };

	wonGrid.forEach((grid) => {
		if (grid && grid.winner === "W") scores.wins += 1;
		if (grid && grid.winner === "L") scores.losses += 1;
		else scores.draws += 1;
	});

	return scores;
}

export default getScores;
