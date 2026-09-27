export default function Cell({ value, onClick }) {
	return (
		<div
			className="w-8 h-8 p-2 text-center sm:h-10 sm:w-10 bg-red-500"
			onClick={onClick}
		>
			{value}
		</div>
	);
}
