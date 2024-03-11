import React from "react";
import { NameChipBlue, NameChipRed } from "./NameChip";

function ScoreBar() {
	const scoreCells = Array(9).fill(0);
	return (
		<div className="flex">
			{/* names components */}
			<div>
				<NameChipRed name={"Player1"} />
				<NameChipBlue name={"Player2"} />
			</div>
			{/* score bar component */}
			<div className="flex w-3/4 h-2 rounded-full bg-primaryGray">
				{scoreCells.map((_, idx) => (
					<React.Fragment key={idx}>
						{idx === 0 && <div></div>}
					</React.Fragment>
				))}
			</div>
		</div>
	);
}

export default ScoreBar;
