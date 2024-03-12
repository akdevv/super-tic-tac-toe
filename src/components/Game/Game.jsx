import ScoreBar from "./ScoreBar";
import GameBoard from "./GameBoard";
import useGameStates from "../../hooks/useGameStates";

function Game() {
	const gameStates = useGameStates();

	return (
		<>
			<ScoreBar scores={gameStates.scores} />
			<div className="flex flex-grow items-center justify-center">
				<GameBoard {...gameStates} />
			</div>
		</>
	);
}

export default Game;
