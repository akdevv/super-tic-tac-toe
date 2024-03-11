import { NameChipBlue, NameChipRed } from "./NameChip";

function ScoreBar() {
	return (
		<div className="flex">
			{/* names components */}
			<div>
				<NameChipRed name={"ashish"} />
				<NameChipBlue name={"robin"} />
			</div>
			{/* score bar component */}
			<div></div>
		</div>
	);
}

export default ScoreBar;
