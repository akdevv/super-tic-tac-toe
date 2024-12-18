"use client";

import { useState } from "react";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";

export default function Home() {
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isRegisterOpen, setIsRegisterOpen] = useState(false);

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
				<h1 className="text-3xl font-bold text-center mb-8">
					Welcome to Super Tic-Tac-Toe
				</h1>

				<div className="space-y-4">
					<button
						onClick={() => setIsLoginOpen(true)}
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
					>
						Login
					</button>

					<button
						onClick={() => setIsRegisterOpen(true)}
						className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
					>
						Register
					</button>
				</div>

				<LoginModal
					isOpen={isLoginOpen}
					onClose={() => setIsLoginOpen(false)}
				/>

				<RegisterModal
					isOpen={isRegisterOpen}
					onClose={() => setIsRegisterOpen(false)}
				/>
			</div>
		</div>
	);
}
