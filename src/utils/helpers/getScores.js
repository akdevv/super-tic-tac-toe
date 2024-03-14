/**
 * Calculates the scores based on the winner of each tic-tac-toe grid.
 *
 * @param {Array} wonGrids Array containing the winner of each grid.
 * @returns {Object} Returns an object with wins, draws, and losses.
 */

function getScores(wonGrids) {
	let scores = { wins: 0, draws: 0, losses: 0 };

	wonGrids.forEach((grid) => {
		if (grid && grid.result === "W") scores.wins += 1;
		if (grid && grid.result === "L") scores.losses += 1;
		else scores.draws += 1;
	});

	return scores;
}

export default getScores;
