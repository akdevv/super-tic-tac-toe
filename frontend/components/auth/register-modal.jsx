"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogo } from "@phosphor-icons/react";
import { auth, provider } from "@/firebase/index";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import {
	validateUsername,
	validateEmail,
	validatePassword,
	validatePasswordMatch,
	firebaseErrors,
} from "@/validators/user";

import AuthModal from "./auth-modal";
import Button from "@/components/shared/button";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function RegisterModal({ isOpen, onClose }) {
	const router = useRouter();
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleInputChange = (e) => {
		const { id, value } = e.target;
		setForm({ ...form, [id]: value });

		// clear errors
		setErrors({ ...errors, [id]: "" });

		// validate username
		if (id === "username") {
			const usernameError = validateUsername(value);
			setErrors({ ...errors, username: usernameError });
		}
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		console.log("form = ", form);

		// try {
		// 	const data = await createUserWithEmailAndPassword(
		// 		auth,
		// 		email,
		// 		password
		// 	);
		// 	console.log("data = ", data);
		// 	const token = await data.user.getIdToken();
		// 	console.log("token = ", token);
		// 	// const res = await axios.post(`${backendURL}/api/auth/register`, {
		// 	// 	token,
		// 	// });
		// 	// if (res.status === 200) {
		// 	// 	console.log("Registration successful");
		// 	// 	console.log("res = ", res);
		// 	// 	router.push("/game");
		// 	// } else {
		// 	// 	console.error("Registration failed");
		// 	// }
		// } catch (error) {
		// 	console.error("Registration error: ", error);
		// }
	};

	const handleGoogleRegister = async () => {
		try {
			const data = await signInWithPopup(auth, provider);
			const token = await data.user.getIdToken();
			const res = await axios.post(`${backendURL}/api/auth/google`, {
				token,
			});

			if (res.status === 200) {
				localStorage.setItem("token", token);
				router.push("/game");
			} else {
				console.error("Google registration failed!");
			}
		} catch (error) {
			console.error("Google registration error: ", error);
		}
	};

	return (
		<AuthModal isOpen={isOpen} onClose={onClose} type="register">
			<form onSubmit={handleRegister}>
				<div className="space-y-2 mb-8">
					{/* username */}
					<input
						type="text"
						id="username"
						value={form.username}
						onChange={handleInputChange}
						placeholder="Enter your username"
						className="w-full p-3 border-2 border-black focus:outline-none font-medium bg-light-100"
						required
					/>

					{/* email */}
					<input
						type="email"
						id="email"
						value={form.email}
						onChange={handleInputChange}
						placeholder="Enter your email"
						className="w-full p-3 border-2 border-black focus:outline-none font-medium bg-light-100"
						required
					/>

					{/* password */}
					<input
						type="password"
						id="password"
						value={form.password}
						onChange={handleInputChange}
						placeholder="Enter your password"
						className="w-full p-3 border-2 border-black focus:outline-none font-medium bg-light-100"
						required
					/>

					{/* confirm password */}
					<input
						type="password"
						id="confirmPassword"
						value={form.confirmPassword}
						onChange={handleInputChange}
						placeholder="Confirm your password"
						className="w-full p-3 border-2 border-black focus:outline-none font-medium bg-light-100"
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
			</form>

			{/* Google Register Button */}
			<Button
				size="full"
				variant="secondary"
				onClick={handleGoogleRegister}
			>
				<div className="flex items-center justify-center gap-2">
					<GoogleLogo size={28} weight="bold" />
					<span>Continue with Google</span>
				</div>
			</Button>

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
