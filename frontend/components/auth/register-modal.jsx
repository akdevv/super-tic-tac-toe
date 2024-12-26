"use client";

import { useState } from "react";
import AuthModal from "./auth-modal";
import Button from "@/components/shared/button";
import { GoogleLogo } from "@phosphor-icons/react";

export default function RegisterModal({ isOpen, onClose }) {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	return (
		<AuthModal isOpen={isOpen} onClose={onClose} type="register">
			<form onSubmit={() => {}}>
				{/* username, email, password, confirm password */}
				<div className="space-y-2 mb-8">
					<input
						type="text"
						id="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Enter your username"
						className="w-full p-3 border-2 border-black focus:outline-none font-medium"
						required
					/>

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

					<input
						type="password"
						id="confirmPassword"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="Confirm your password"
						className="w-full p-3 border-2 border-black focus:outline-none font-medium"
						required
					/>
				</div>

				<Button type="submit" variant="destructive" size="full">
					Create Account
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

				{/* Google Register Button */}
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
					By creating an account, you agree to our{" "}
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

// 	const handleRegister = async (e) => {
// 		e.preventDefault();

// 		try {
// 			const data = await createUserWithEmailAndPassword(
// 				auth,
// 				email,
// 				password
// 			);
// 			const token = await data.user.getIdToken();
// 			console.log("token = ", token);
// 			console.log("data = ", data);

// 			// const res = await axios.post(`${baseURL}/api/auth/register`, {
// 			// 	token,
// 			// });
// 			// if (res.status === 200) {
// 			// 	console.log("Registration successful");
// 			// 	console.log("res = ", res);
// 			// }
// 		} catch (error) {
// 			console.error("Registration error: ", error);
// 		}
// 	};

// 	const handleGoogleRegister = () => {
// 		// TODO: Implement Google registration
// 		console.log("Google registration attempted");
// 	};
