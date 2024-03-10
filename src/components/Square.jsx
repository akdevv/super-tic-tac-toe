function Square({ value, onClick }) {
	return (
		<div
			className="h-10 w-10 p-2 text-center bg-primaryLight"
			onClick={onClick}
		>
			{value}
		</div>
	);
}

export default Square;
