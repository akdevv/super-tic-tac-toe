function Cell({ value, onClick }) {
	return (
		<div
			className="w-8 h-8 p-2 text-center sm:h-10 sm:w-10 bg-primaryLight"
			onClick={onClick}
		>
			{value}
		</div>
	);
}

export default Cell;
