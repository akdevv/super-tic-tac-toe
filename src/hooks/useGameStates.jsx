import { useState } from "react";

function useGameStates() {
	// player's turn state
	const [xIsNext, setXIsNext] = useState(true);

	// active grid state (which states player can play in)
	const [activeGrid, setActiveGrid] = useState(null);

	// winner grid state (which grid has been won)
	const [winnerGrid, setWinnerGrid] = useState(Array(9).fill(null));

	// Game board state
	const [squares, setSquares] = useState(
		[...Array(9)].map(() => Array(9).fill(null))
	);

	return {
		xIsNext,
		setXIsNext,
		activeGrid,
		setActiveGrid,
		winnerGrid,
		setWinnerGrid,
		squares,
		setSquares,
	};
}

export default useGameStates;
