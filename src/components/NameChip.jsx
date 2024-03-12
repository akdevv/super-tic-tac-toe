function NameChipRed({ name }) {
	return (
		<div className="w-min px-3 rounded-full font-firaMono bg-playerRed">
			{name}
		</div>
	);
}

function NameChipBlue({ name }) {
	return (
		<div className="w-min px-3 rounded-full font-firaMono bg-playerBlue">
			{name}
		</div>
	);
}

export { NameChipRed, NameChipBlue };
