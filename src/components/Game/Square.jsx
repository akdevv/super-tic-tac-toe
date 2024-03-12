function Square({ value, onClick }) {
	return (
		<div
			className="sm:h-10 h-8 sm:w-10 w-8 p-2 text-center bg-primaryLight"
			onClick={onClick}
		>
			{value}
		</div>
	);
}

export default Square;
