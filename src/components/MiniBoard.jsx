import Square from "./Square";

function MiniBoard() {
	return (
		<div className="p-2">
			<div className="flex">
				<Square value="1" />
				<Square value="2" />
				<Square value="3" />
			</div>
			<div className="flex">
				<Square value="4" />
				<Square value="5" />
				<Square value="6" />
			</div>
			<div className="flex">
				<Square value="7" />
				<Square value="8" />
				<Square value="9" />
			</div>
		</div>
	);
}

export default MiniBoard;
