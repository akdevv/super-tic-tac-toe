"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, provider } from "@/firebase/index";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import {
	Eye,
	EyeClosed,
	GoogleLogo,
	WarningCircle,
} from "@phosphor-icons/react";
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
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
		useState(false);

	const togglePassword = (id) => {
		if (id === "password") {
			setIsPasswordVisible(!isPasswordVisible);
		} else if (id === "confirmPassword") {
			setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
		}
	};

	const renderInputFields = (id, type, value, placeholder) => {
		return (
			<div>
				<div
					className={`flex items-center gap-2 pr-3 border-2 transition-all duration-300 ${
						errors[id] ? "border-error-light" : "border-black"
					}`}
				>
					<input
						type={type}
						id={id}
						value={value}
						onChange={handleInputChange}
						placeholder={placeholder}
						className="w-full p-3 focus:outline-none font-medium bg-light-100"
						required
					/>
					{errors.username && id === "username" && (
						<WarningCircle size={28} className="text-error-light" />
					)}
					{errors.email && id === "email" && (
						<WarningCircle size={28} className="text-error-light" />
					)}
				</div>

				{errors[id] && (
					<p className="text-error-normal text-sm font-light">
						{errors[id]}
					</p>
				)}
			</div>
		);
	};

	const renderPasswordField = (id, value, placeholder) => {
		return (
			<div>
				<div
					className={`flex items-center gap-2 pr-3 border-2 transition-all duration-300 ${
						errors[id] ? "border-error-light" : "border-black"
					}`}
				>
					<input
						type={
							id === "password"
								? isPasswordVisible
									? "text"
									: "password"
								: isConfirmPasswordVisible
								? "text"
								: "password"
						}
						id={id}
						value={value}
						onChange={handleInputChange}
						placeholder={placeholder}
						className="w-full p-3 focus:outline-none font-medium bg-light-100"
						required
					/>
					{errors.username && id === "username" && (
						<WarningCircle size={28} className="text-error-light" />
					)}
					{errors.email && id === "email" && (
						<WarningCircle size={28} className="text-error-light" />
					)}
					{id === "password" && (
						<div
							className="cursor-pointer transition-all duration-300"
							onClick={() => togglePassword(id)}
						>
							{isPasswordVisible ? (
								<Eye size={28} />
							) : (
								<EyeClosed size={28} />
							)}
						</div>
					)}
					{id === "confirmPassword" && (
						<div
							className="cursor-pointer transition-all duration-300"
							onClick={() => togglePassword(id)}
						>
							{isConfirmPasswordVisible ? (
								<Eye size={28} />
							) : (
								<EyeClosed size={28} />
							)}
						</div>
					)}
				</div>

				{errors[id] && (
					<p className="text-error-normal text-sm font-light">
						{errors[id]}
					</p>
				)}
			</div>
		);
	};

	const handleInputChange = (e) => {
		const { id, value } = e.target;
		setForm((prev) => ({ ...prev, [id]: value }));

		// clear errors
		setErrors({ ...errors, [id]: "" });

		// validate inputs
		if (id === "username") {
			setErrors({ ...errors, username: validateUsername(value) });
		}
		if (id === "email") {
			setErrors({ ...errors, email: validateEmail(value) });
		}
		if (id === "password") {
			setErrors({ ...errors, password: validatePassword(value) });
			if (form.confirmPassword) {
				setErrors({
					...errors,
					confirmPassword: validatePasswordMatch(
						value,
						form.confirmPassword
					),
				});
			}
		}
		if (id === "confirmPassword") {
			setErrors({
				...errors,
				confirmPassword: validatePasswordMatch(value, form.password),
			});
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
					{renderInputFields(
						"username",
						"text",
						form.username,
						"Enter your username"
					)}

					{/* email */}
					{renderInputFields(
						"email",
						"email",
						form.email,
						"Enter your email"
					)}

					{/* password */}
					{renderPasswordField(
						"password",
						form.password,
						"Enter your password"
					)}

					{/* confirm password */}
					{renderPasswordField(
						"confirmPassword",
						form.confirmPassword,
						"Confirm your password"
					)}
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
