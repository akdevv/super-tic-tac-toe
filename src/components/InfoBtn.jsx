function InfoBtn({ text, showInfo, onClick }) {
	return (
		<div>
			<div
				onClick={onClick}
				className="flex justify-center w-10 h-10 p-2 font-bold rounded-full cursor-pointer bg-primaryGray font-firaMono"
			>
				{text}
			</div>
			{showInfo && <h1>Coming Soon...</h1>}
		</div>
	);
}

export default InfoBtn;
