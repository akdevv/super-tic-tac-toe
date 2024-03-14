import { useState } from "react";

function useGameStates() {
	// player's turn state
	const [xIsNext, setXIsNext] = useState(true);

	// active grid state (which states player can play in)
	const [activeGrid, setActiveGrid] = useState(null);

	// winner grid state (which grid has been won)
	const [winnerArr, setwinnerArr] = useState(Array(9).fill(null));

	// scores
	const [scores, setScores] = useState({ red: 0, gray: 0, blue: 0 });

	// Game board state
	const [cells, setCells] = useState(
		[...Array(9)].map(() => Array(9).fill(null))
	);

	return {
		xIsNext,
		setXIsNext,
		activeGrid,
		setActiveGrid,
		winnerArr,
		setwinnerArr,
		cells,
		setCells,
		scores,
		setScores,
	};
}

export default useGameStates;
