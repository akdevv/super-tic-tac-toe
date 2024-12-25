"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/shared/button";
import LoginModal from "@/components/landing/login-modal";
import RegisterModal from "@/components/landing/register-modal";

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
			<Button onClick={() => setIsLoginModalOpen(true)}>Login</Button>
			<Button onClick={() => setIsRegisterModalOpen(true)}>
				Register
			</Button>

			<LoginModal
				isOpen={isLoginModalOpen}
				onClose={() => setIsLoginModalOpen(false)}
			/>
			<RegisterModal
				isOpen={isRegisterModalOpen}
				onClose={() => setIsRegisterModalOpen(false)}
			/>

			<footer>
				<Link
					href="https://github.com/akdevv"
					target="_blank"
					className="font-fira"
				>
					made by @akdevv
				</Link>
			</footer>
		</div>
	);
}
