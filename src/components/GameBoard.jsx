import MiniBoard from "./MiniBoard";

function GameBoard() {
	return (
		<div>
			<div className="flex">
				<MiniBoard />
				<MiniBoard />
				<MiniBoard />
			</div>
			<div className="flex">
				<MiniBoard />
				<MiniBoard />
				<MiniBoard />
			</div>
			<div className="flex">
				<MiniBoard />
				<MiniBoard />
				<MiniBoard />
			</div>
		</div>
	);
}

export default GameBoard;
