import { NameChipBlue, NameChipRed } from "./NameChip";

function ScoreBar() {
	// const scoreCells = Array(9).fill(0);
	return (
		<div className="flex flex-col w-full items-center">
			{/* names components */}
			<div className="flex sm:w-3/5 md:w-3/4 w-full mb-1.5 justify-between">
				<NameChipRed name={"Player1"} />
				<NameChipBlue name={"Player2"} />
			</div>
			{/* score bar component */}
			<div className="flex sm:w-3/5 md:w-3/4 w-full h-2 rounded-full bg-primaryGray">
				{/* {scoreCells.map((_, idx) => (
					<React.Fragment key={idx}>
						{idx === 0 && <div></div>}
					</React.Fragment>
				))} */}
			</div>
		</div>
	);
}

export default ScoreBar;
