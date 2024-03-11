// import { useState } from "react";

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

export default SettingsBtn;
