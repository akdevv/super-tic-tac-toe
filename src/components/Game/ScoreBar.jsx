import { NameChipBlue, NameChipRed } from "../NameChip";

function ScoreBar({ scores }) {
	console.log("scores", scores);
	const scoreCells = Array(9).fill(0);

	return (
		<div className="flex flex-col w-full items-center">
			{/* names components */}
			<div className="flex sm:w-4/5 md:w-3/5 w-full mb-1.5 justify-between">
				<NameChipRed name={"Player1"} />
				<NameChipBlue name={"Player2"} />
			</div>
			{/* score bar component */}
			<div className="flex sm:w-4/5 md:w-3/5 w-full h-2 rounded-full border border-primaryDark">
				{scoreCells.map((_, idx) => (
					<div
						key={idx}
						className={`flex-1 h-full ${
							idx === 0 ? "rounded-l-full border-r" : ""
						} ${
							idx === scoreCells.length - 1
								? "rounded-r-full"
								: "border-r"
						} bg-playerRed border-primaryDark`}
					></div>
				))}
			</div>
		</div>
	);
}

export default ScoreBar;
