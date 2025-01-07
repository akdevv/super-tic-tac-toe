import Cell from "./cell";

export default function Grid() {
	return (
		<div className="grid grid-cols-10 gap-2">
			<Cell />
			<Cell />
			<Cell />

			<Cell />
			<Cell />
			<Cell />

			<Cell />
			<Cell />
			<Cell />
		</div>
	);
}
