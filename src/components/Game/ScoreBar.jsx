import NameChip from "../NameChip";

function ScoreBar({ scores }) {
	const scoreCells = [
		...Array(scores.wins).fill("bg-playerRed"),
		...Array(scores.draws).fill("bg-primaryGray"),
		...Array(scores.losses).fill("bg-playerBlue"),
	];

	return (
		<div className="flex flex-col items-center w-full">
			{/* names components */}
			<div className="flex sm:w-4/5 md:w-3/5 w-full mb-1.5 justify-between">
				<NameChip name={"Player1"} color={"playerRed"} />
				<NameChip name={"Player2"} color={"playerBlue"} />
			</div>

			{/* score bar component */}
			<div className="flex w-full h-2 border rounded-full sm:w-4/5 md:w-3/5 border-primaryDark">
				{scoreCells.map((color, idx) => (
					<div
						key={idx}
						className={`flex-1 h-full ${
							idx === 0 ? "rounded-l-full border-r" : ""
						} ${
							idx === scoreCells.length - 1
								? "rounded-r-full"
								: "border-r"
						} ${color} border-primaryDark ease-in-out transition-all duration-300`}
					></div>
				))}
			</div>
		</div>
	);
}

export default ScoreBar;
