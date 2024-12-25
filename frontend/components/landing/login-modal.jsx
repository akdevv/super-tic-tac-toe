"use client";

import { useState } from "react";
import Button from "@/components/shared/button";

export default function LoginModal({ isOpen, onClose }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		// TODO: Implement login logic
		console.log("Login attempt with:", { email, password });
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg w-full max-w-md p-6 relative">
				<button
					onClick={onClose}
					className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
				>
					X
				</button>

				<h2 className="text-2xl font-bold mb-6">Login</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<Button type="submit" className="w-full">
						Login
					</Button>
				</form>
			</div>
		</div>
	);
}
