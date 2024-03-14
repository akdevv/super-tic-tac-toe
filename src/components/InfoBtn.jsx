function InfoBtn({ text, showInfo, onClick }) {
	return (
		<div>
			<div
				onClick={onClick}
				className="flex w-10 h-10 justify-center p-2 rounded-full bg-primaryGray cursor-pointer font-firaMono font-bold"
			>
				{text}
			</div>
			{showInfo && <h1>Coming Soon...</h1>}
		</div>
	);
}

export default InfoBtn;
