import { useState } from "react";

export default function Toggle({ isOn, onToggle, disabled = false }) {
	return (
		<button
			onClick={() => !disabled && onToggle()}
			className={`
				relative inline-flex h-5 w-10 items-center rounded-full
				transition-colors duration-200 ease-in-out border border-black
				${isOn ? "bg-player-blue-dark" : "bg-light-500"} 
				${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
			`}
			disabled={disabled}
		>
			{/* Toggle Circle */}
			<span
				className={`
					inline-block h-4 w-4 transform rounded-full bg-light-100 
					transition-transform duration-200 ease-in-out border border-black
					${isOn ? "translate-x-[21px]" : "translate-x-[1px]"}
				`}
			/>
		</button>
	);
}
