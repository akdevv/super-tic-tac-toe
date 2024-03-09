import { useState } from "react";

function useGameStates() {
	// Player's turn state
	const [xIsNext, setXIsNext] = useState(true);

	// Active grid state (which states player can play in)
	const [activeGrid, setActiveGrid] = useState(null);

	// Game board state
	const [squares, setSquares] = useState(
		[...Array(9)].map(() => Array(9).fill(null))
	);

	return {
		xIsNext,
		setXIsNext,
		activeGrid,
		setActiveGrid,
		squares,
		setSquares,
	};
}

export default useGameStates;
