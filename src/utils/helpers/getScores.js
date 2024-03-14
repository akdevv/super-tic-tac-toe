/**
 * Calculates the scores based on the winner of each tic-tac-toe grid.
 *
 * @param {{
 * 		result: string,
 * 		sequence: number[]
 * 	}} wonGrids Array tracking result & sequence of each grid.
 * @returns {{ wins: 0, draws: 0, losses: 0 }} Returns an object with wins, draws, and losses.
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
