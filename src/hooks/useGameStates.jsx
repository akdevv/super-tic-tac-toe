import { useState } from "react";

/**
 * Custom hook to manage the game states.
 *
 * @returns {Object} An object containing the game states
 */

function useGameStates() {
	const [xIsNext, setXIsNext] = useState(true);
	const [activeGrid, setActiveGrid] = useState(null);
	const [wonGrids, setWonGrids] = useState(Array(9).fill(null));
	const [scores, setScores] = useState({ wins: 0, draws: 0, losses: 0 });
	const [finalWinner, setFinalWinner] = useState(null);
	const [cells, setCells] = useState(
		[...Array(9)].map(() => Array(9).fill(null))
	);

	return {
		xIsNext,
		setXIsNext,
		activeGrid,
		setActiveGrid,
		wonGrids,
		setWonGrids,
		scores,
		setScores,
		finalWinner,
		setFinalWinner,
		cells,
		setCells,
	};
}

export default useGameStates;
