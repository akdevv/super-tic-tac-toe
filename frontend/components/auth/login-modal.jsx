"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback } from "react";
import { ToastAction } from "@/components/ui/toast";
import { Eye, EyeClosed, GoogleLogo } from "@phosphor-icons/react";

import AuthModal from "./auth-modal";
import Button from "@/components/shared/button";

import { auth, provider } from "@/firebase/index";
import { firebaseErrors } from "@/validators/user";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function LoginModal({ isOpen, onClose }) {
	const router = useRouter();
	const { toast } = useToast();
	const [form, setForm] = useState({
		email: "",
		password: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	// error toast
	const errorToast = (error) => {
		toast({
			title: "Registration failed!",
			description: firebaseErrors(error.code),
			status: "error",
			duration: 2000,
			position: "top",
			variant: "destructive",
			action: <ToastAction altText="Try again">Try again</ToastAction>,
		});
	};

	const handleInputChange = (e) => {
		const { id, value } = e.target;
		setForm((prev) => ({ ...prev, [id]: value }));
	};

	const handleLogin = useCallback(
		async (e) => {
			e.preventDefault();

			try {
				setIsSubmitting(true);

				const data = await signInWithEmailAndPassword(
					auth,
					email,
					password
				);
				const token = await data.user.getIdToken();

				const res = await axios.post(`${backendURL}/api/auth/login`, {
					token,
				});

				if (res.status === 200) {
					localStorage.setItem("token", token);
					router.push("/game");
				} else {
					console.error("Login failed");
				}
			} catch (error) {
				console.error("Login error: ", error);
				errorToast(error);
			} finally {
				setIsSubmitting(false);
			}
		},
		[form]
	);

	const handleGoogleLogin = async () => {
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
				console.error("Google login failed!");
			}
		} catch (error) {
			console.error("Google login error: ", error);
			errorToast(error);
		}
	};

	return (
		<AuthModal isOpen={isOpen} onClose={onClose} type="login">
			<form>
				{/* Email and Password Inputs */}
				<div className="space-y-2 mb-8">
					<input
						type="email"
						id="email"
						value={form.email}
						onChange={handleInputChange}
						placeholder="Enter your email"
						className="w-full p-3 border-2 border-black focus:outline-none font-medium bg-light-100"
						required
					/>

					{/* Password Input */}

					<div className="flex items-center gap-2 pr-3 border-2 border-black transition-all duration-300">
						<input
							type={isPasswordVisible ? "text" : "password"}
							id="password"
							value={form.password}
							onChange={handleInputChange}
							placeholder="Enter your password"
							className="w-full p-3 focus:outline-none font-medium bg-light-100"
							required
						/>
						<div
							className="cursor-pointer transition-all duration-300"
							onClick={() =>
								setIsPasswordVisible(!isPasswordVisible)
							}
						>
							{isPasswordVisible ? (
								<Eye size={28} />
							) : (
								<EyeClosed size={28} />
							)}
						</div>
					</div>

					<div className="text-right">
						<a
							href="/forgot-password"
							className="text-sm text-light-500 hover:underline"
						>
							Forgot Password?
						</a>
					</div>
				</div>

				<Button
					variant="destructive"
					disabled={isSubmitting}
					size="full"
					onClick={handleLogin}
				>
					{isSubmitting ? "Logging in..." : "Login with Email"}
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

			{/* Google Login Button */}
			<Button size="full" variant="secondary" onClick={handleGoogleLogin}>
				<div className="flex items-center justify-center gap-2">
					<GoogleLogo size={28} weight="bold" />
					<span>Continue with Google</span>
				</div>
			</Button>

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
