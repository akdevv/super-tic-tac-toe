import PlayerBadge from "@/components/shared/player-badge";

let p1 = "Player 1";
let p2 = "Player 2";

export default function Scoreboard() {
	return (
		<div>
			<PlayerBadge name={p1} color="player-red-dark" />
			<PlayerBadge name={p2} color="player-blue-dark" />
		</div>
	);
}
