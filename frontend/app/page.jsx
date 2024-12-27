"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/shared/button";
import LoginModal from "@/components/auth/login-modal";
import RegisterModal from "@/components/auth/register-modal";
import Footer from "@/components/shared/footer";

export default function Home() {
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
	return (
		<div>
			<h1 className="bg-gradient-to-r from-player-red-dark via-purple-600 to-player-blue-dark bg-clip-text text-transparent w-fit mx-auto text-7xl font-bold font-lilita">
				SUPER TIC-TAC-TOE
			</h1>
			<p className="text-center text-xl">
				The best Tic-Tac-Toe game in the world!
			</p>
			<div className="flex gap-10">
				<Button onClick={() => setIsLoginModalOpen(true)}>Login</Button>
				<Button
					onClick={() => setIsRegisterModalOpen(true)}
					variant="secondary"
				>
					Register
				</Button>
			</div>

			<LoginModal
				isOpen={isLoginModalOpen}
				onClose={() => setIsLoginModalOpen(false)}
			/>
			<RegisterModal
				isOpen={isRegisterModalOpen}
				onClose={() => setIsRegisterModalOpen(false)}
			/>

			<Footer />
		</div>
	);
}
