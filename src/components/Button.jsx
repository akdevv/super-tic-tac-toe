function button({ src, text, onClick }) {
	return (
		<div
			onClick={onClick}
			className="flex justify-center w-10 h-10 p-2 font-bold rounded-full cursor-pointer bg-primaryGray font-firaMono"
		>
			{src && <img className="w-5" src={src} alt="btn img" />}
			{text && <p>{text}</p>}
		</div>
	);
}

export default button;
