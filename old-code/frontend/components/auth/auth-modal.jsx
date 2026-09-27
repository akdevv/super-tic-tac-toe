import { XCircle } from "@phosphor-icons/react";

export default function AuthModal({ children, isOpen, onClose, type }) {
	if (!isOpen) return null;

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div
			onClick={handleBackdropClick}
			className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-sm p-4"
		>
			<div className="bg-light-100 border-2 border-black shadow-[6px_6px_0px_0px_#949392] w-full max-w-sm sm:max-w-md p-4 sm:p-8 relative">
				<button
					onClick={onClose}
					className="absolute right-4 top-4 font-bold transition-colors"
				>
					<XCircle size={32} />
				</button>

				{/* Heading */}
				<div className="flex flex-col items-center mb-8">
					<div className="w-20 h-20 rounded-full bg-gradient-to-br from-player-blue via-purple-500 to-player-red blur-md" />

					{/* Heading */}
					<h2 className="text-3xl font-bold font-bricolage mt-6">
						{type === "login"
							? "Welcome Back"
							: "Create an Account"}
					</h2>
					<p className="text-light-600">
						{type === "login"
							? "Login to continue"
							: "Create an account to get started"}
					</p>
				</div>
				{children}
			</div>
		</div>
	);
}
