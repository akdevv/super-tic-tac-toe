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
		console.log("winnerArr from useEffect() ==> ", winnerArr);
		calculateFinalWinner(winnerArr, scores);
	}, [cells, winnerArr]);
}

export default useGameLogic;
