"use client";

import axios from "axios";
import { useState } from "react";
import Button from "@/components/shared/button";
import { auth, googleProvider } from "@/firebase/index";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterModal({ isOpen, onClose }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleRegister = async (e) => {
		e.preventDefault();

		try {
			const data = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const token = await data.user.getIdToken();
			console.log("token = ", token);
			console.log("data = ", data);

			// const res = await axios.post(`${baseURL}/api/auth/register`, {
			// 	token,
			// });
			// if (res.status === 200) {
			// 	console.log("Registration successful");
			// 	console.log("res = ", res);
			// }
		} catch (error) {
			console.error("Registration error: ", error);
		}
	};

	const handleGoogleRegister = () => {
		// TODO: Implement Google registration
		console.log("Google registration attempted");
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
			<div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none w-full max-w-md p-8 relative">
				<button
					onClick={onClose}
					className="absolute right-4 top-4 bg-black text-white hover:bg-player-red-dark px-3 py-1 font-bold transition-colors"
				>
					x
				</button>

				<div className="flex flex-col items-center mb-8">
					<div className="w-20 h-20 bg-player-blue-dark rounded-full mb-4"></div>
					<h2 className="text-3xl font-bold mb-2">Join the Game!</h2>
					<p className="text-gray-600">Create an account to play</p>
				</div>

				<form onSubmit={handleRegister} className="space-y-6">
					<div>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
							className="w-full px-4 py-3 border-2 border-black focus:outline-none"
							required
						/>
					</div>

					<div>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							className="w-full px-4 py-3 border-2 border-black focus:outline-none"
							required
						/>
					</div>

					<Button type="submit" className="w-full">
						Create Account
					</Button>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-gray-500">
								Or continue with
							</span>
						</div>
					</div>

					<Button
						variant="outline"
						className="w-full flex items-center justify-center gap-2"
						onClick={handleGoogleRegister}
					>
						<svg
							className="w-5 h-5"
							viewBox="0 0 24 24"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/>
						</svg>
						Google
					</Button>

					<p className="text-center text-sm text-gray-600">
						Already have an account?{" "}
						<button
							type="button"
							onClick={onClose}
							className="text-blue-600 hover:text-blue-700 font-medium"
						>
							Login
						</button>
					</p>
				</form>
			</div>
		</div>
	);
}
