function NameChipRed({ name }) {
	return <div className={"w-min px-3 rounded-full bg-playerRed"}>{name}</div>;
}

function NameChipBlue({ name }) {
	return <div className="w-min px-3 rounded-full bg-playerBlue">{name}</div>;
}

export { NameChipRed, NameChipBlue };
