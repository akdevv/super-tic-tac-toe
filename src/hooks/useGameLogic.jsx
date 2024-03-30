import {
	getScores,
	updateWonGrid,
	getFinalWinner,
} from "../utils/gameFunctions";
import { useEffect } from "react";

function useGameLogic(
	cells,
	scores,
	wonGrids,
	setScores,
	setWonGrids,
	setFinalWinner
) {
	useEffect(() => {
		updateWonGrid(cells, wonGrids, setWonGrids);

		const scores = getScores(wonGrids);
		setScores(scores);

		const finalWinner = getFinalWinner(wonGrids, scores);
		if (finalWinner) setFinalWinner(finalWinner);
	}, [cells, wonGrids]);
}

export default useGameLogic;
