function Square({ value, onClick }) {
	return (
		<div
			className="border border-red-500 h-10 w-10 p-2 text-center"
			onClick={onClick}
		>
			{value}
		</div>
	);
}

export default Square;
