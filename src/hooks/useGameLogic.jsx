import { useEffect } from "react";
import { getScores, updateWonGrid } from "../utils/gameFunctions";

function useGameLogic(
	cells,
	winnerArr,
	setScores,
	setwinnerArr,
	calculateFinalWinner
) {
	useEffect(() => {
		updateWonGrid(cells, winnerArr, setwinnerArr);
		const scores = getScores(winnerArr);
		setScores(scores);
		calculateFinalWinner(winnerArr, scores);
	}, [cells, winnerArr]);
}

export default useGameLogic;
