import { useEffect } from "react";
import { calculateWinner, calculateScores } from "../utils/gameLogic";

function useGameLogic(
	cells,
	winnerArr,
	setScores,
	setwinnerArr,
	calculateFinalWinner
) {
	useEffect(() => {
		calculateWinner(cells, winnerArr, setwinnerArr);
		const scores = calculateScores(winnerArr);
		setScores(scores);
		const { finalWinner, isGameOver } = calculateFinalWinner(
			winnerArr,
			scores
		);
		if (isGameOver) {
			alert(`Game Over! ${finalWinner} wins!`);
		}
	}, [cells]);
}

export default useGameLogic;
