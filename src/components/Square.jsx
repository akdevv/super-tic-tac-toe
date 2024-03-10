function Square({ value, onClick }) {
	return (
		<div
			className="h-10 w-10 p-2 text-cente border border-blue-500"
			onClick={onClick}
		>
			{value}
		</div>
	);
}

export default Square;
