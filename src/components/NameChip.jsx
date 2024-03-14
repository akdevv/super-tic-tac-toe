function NameChip({ name, color }) {
	return (
		<div
			className={`w-min px-3 py-1 rounded-full font-firaMono bg-${color}`}
		>
			{name}
		</div>
	);
}

export default NameChip;
