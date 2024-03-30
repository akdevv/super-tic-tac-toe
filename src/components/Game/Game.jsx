import ScoreBar from "./ScoreBar";
import GameBoard from "./GameBoard";
import useGameStates from "../../hooks/useGameStates";

function Game() {
	const gameStates = useGameStates();

	return (
		<>
			<ScoreBar scores={gameStates.scores} />
			<div className="flex items-center justify-center flex-grow">
				<GameBoard {...gameStates} />
			</div>
		</>
	);
}

export default Game;
