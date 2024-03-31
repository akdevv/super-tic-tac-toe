function WinnerBanner({ winner }) {
	let color;
	let winnerName;
	if (winner === "W") {
		color = "bg-playerRed";
		winnerName = "Player 1";
	} else if (winner === "L") {
		color = "bg-playerBlue";
		winnerName = "Player 2";
	} else {
		color = "bg-primaryGray";
		winnerName = "Nooo one";
	}
	return (
		<div className="absolute w-full h-full backdrop-blur-sm bg-primaryLight/30">
			<div className="flex items-center justify-center h-dvh">
				<div
					className={`flex items-center justify-center gap-2 px-2 py-2 rounded-full w-52 font-firaMono ${color}`}
				>
					<p className="font-medium">{winnerName} wins!</p>
					<button>
						<img
							src="/restart-btn.svg"
							alt="restart button"
							className="w-12"
						/>
					</button>
				</div>
			</div>
		</div>
	);
}

export default WinnerBanner;
