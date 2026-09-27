export default function PlayerBadge({ name, color }) {
	return (
		<div
			className={`w-fit px-3 py-1 rounded-full border-2 border-black bg-${color}`}
		>
			{name}
		</div>
	);
}
