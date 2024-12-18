"use client";

import { useState } from "react";

export default function LoginModal({ isOpen, onClose }) {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
				formData,
				{ withCredentials: true }
			);
			console.log("Login success:", res.data);
			onClose();
		} catch (error) {
			console.error(
				"Login error:",
				error.response?.data || error.message
			);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-8 max-w-md w-full">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold">Login</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						X
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="email"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
							value={formData.email}
							onChange={(e) =>
								setFormData({
									...formData,
									email: e.target.value,
								})
							}
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
							value={formData.password}
							onChange={(e) =>
								setFormData({
									...formData,
									password: e.target.value,
								})
							}
							required
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
}
