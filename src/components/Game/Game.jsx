import ScoreBar from "./ScoreBar";
import GameBoard from "./GameBoard";
import useGameStates from "../../hooks/useGameStates";
import WinnerBanner from "../WinnerBanner";

function Game() {
	const gameStates = useGameStates();

	return (
		<>
			<ScoreBar scores={gameStates.scores} />
			<div className="flex items-center justify-center flex-grow">
				<GameBoard {...gameStates} />
				{gameStates.isGameOver && <WinnerBanner winner={"Player1"} />}
			</div>
		</>
	);
}

export default Game;
