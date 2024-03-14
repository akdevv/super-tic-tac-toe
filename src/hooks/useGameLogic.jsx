import { useEffect } from "react";
import { calculateWinner, getScores } from "../utils/gameLogic";

function useGameLogic(
	cells,
	winnerArr,
	setScores,
	setwinnerArr,
	calculateFinalWinner
) {
	useEffect(() => {
		calculateWinner(cells, winnerArr, setwinnerArr);
		const scores = getScores(winnerArr);
		setScores(scores);
		console.log("winnerArr from useEffect() ==> ", winnerArr);
		calculateFinalWinner(winnerArr, scores);
	}, [cells, winnerArr]);
}

export default useGameLogic;
