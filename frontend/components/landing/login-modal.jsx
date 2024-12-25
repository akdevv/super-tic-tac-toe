"use client";

import axios from "axios";
import { useState } from "react";
import Button from "@/components/shared/button";
import { auth, googleProvider } from "@/firebase/index";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginModal({ isOpen, onClose }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const data = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const token = await data.user.getIdToken();
			console.log("token = ", token);
			console.log("data = ", data);

			// const res = await axios.post(`${baseURL}/api/auth/login`, {
			// 	token,
			// });
			// if (res.status === 200) {
			// 	console.log("Login successful");
			// 	console.log("res = ", res);
			// }
		} catch (error) {
			console.error("Login error: ", error);
		}
	};

	const handleGoogleLogin = () => {
		// TODO: Implement Google login
		console.log("Google login attempted");
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
					<h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
					<p className="text-gray-600">Login to play now</p>
				</div>

				<form onSubmit={handleLogin} className="space-y-6">
					<div>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
							className="w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:border-player-blue-dark font-medium"
							required
						/>
					</div>

					<div>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							className="w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:border-player-blue-dark font-medium"
							required
						/>
					</div>

					<Button
						type="submit"
						className="w-full bg-player-red-dark hover:bg-player-red border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
					>
						Login with Email
					</Button>

					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-black"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-gray-500">
								OR
							</span>
						</div>
					</div>

					<button
						type="button"
						onClick={handleGoogleLogin}
						className="w-full px-4 py-3 border-2 border-black bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 font-medium"
					>
						<span>Continue with Google</span>
					</button>
				</form>
			</div>
		</div>
	);
}
