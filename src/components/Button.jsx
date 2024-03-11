function SettingsBtn() {
	return (
		<div className="flex w-10 h-10 justify-center p-2 rounded-full bg-primaryGray cursor-pointer">
			<img
				className="w-5"
				src="public/settings-btn.svg"
				alt="settings button"
			/>
		</div>
	);
}

function InfoBtn() {
	return (
		<div className="flex w-10 h-10 justify-center p-2 rounded-full bg-primaryGray cursor-pointer">
			<img className="w-2" src="public/info-btn.svg" alt="info button" />
		</div>
	);
}

export { SettingsBtn, InfoBtn };
