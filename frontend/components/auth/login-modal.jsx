"use client";

import axios from "axios";
import { useState } from "react";
import AuthModal from "./auth-modal";
import Button from "@/components/shared/button";
import { GoogleLogo } from "@phosphor-icons/react";
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

			const res = await axios.post(`${baseURL}/api/auth/login`, {
				token,
			});

			if (res.status === 200) {
				console.log("Login successful");
				router.push("/game");
			} else {
				console.error("Login failed");
			}
		} catch (error) {
			console.error("Login error: ", error);
		}
	};

	const handleGoogleLogin = async () => {};

	return (
		<AuthModal isOpen={isOpen} onClose={onClose} type="login">
			<form onSubmit={() => {}}>
				{/* Email and Password Inputs */}
				<div className="space-y-2 mb-8">
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter your email"
						className="w-full p-3 border-2 border-black focus:outline-none font-medium"
						required
					/>

					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter your password"
						className="w-full p-3 border-2 border-black focus:outline-none font-medium"
						required
					/>
					<div className="text-right">
						<a
							href="/forgot-password"
							className="text-sm text-light-500 hover:underline"
						>
							Forgot Password?
						</a>
					</div>
				</div>

				<Button type="submit" variant="destructive" size="full">
					Login with Email
				</Button>

				{/* Divider */}
				<div className="relative my-6">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-black" />
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-white text-light-600">OR</span>
					</div>
				</div>

				{/* Google Login Button */}
				<Button size="full" variant="secondary" onClick={() => {}}>
					<div className="flex items-center justify-center gap-2">
						<GoogleLogo size={28} weight="bold" />
						<span>Continue with Google</span>
					</div>
				</Button>
			</form>

			{/* Privacy Policy */}
			<div className="mt-6 text-xs text-light-500 text-center">
				<p>
					By logging in, you agree to our{" "}
					<a
						href="/privacy-policy"
						className="underline hover:text-light-600"
					>
						Privacy Policy
					</a>
					.
				</p>
			</div>
		</AuthModal>
	);
}

// const handleLogin = async (e) => {
// 	e.preventDefault();

// 	try {
// 		const data = await signInWithEmailAndPassword(auth, email, password);
// 		const token = await data.user.getIdToken();

// 		// const res = await axios.post(`${baseURL}/api/auth/login`, {
// 		// 	token,
// 		// });
// 		// if (res.status === 200) {
// 		// 	console.log("Login successful");
// 		// 	console.log("res = ", res);
// 		// }
// 	} catch (error) {
// 		console.error("Login error: ", error);
// 	}
// };
