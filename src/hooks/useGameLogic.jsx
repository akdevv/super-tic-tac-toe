import { useEffect } from "react";
import getScores from "../utils/helpers/getScores";
import updateWonGrid from "../utils/helpers/updateWonGrid";

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
