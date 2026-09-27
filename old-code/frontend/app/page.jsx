"use client";

import Link from "next/link";
import { useState } from "react";
import { SmileyWink } from "@phosphor-icons/react";

import Button from "@/components/shared/button";
import LoginModal from "@/components/auth/login-modal";
import RegisterModal from "@/components/auth/register-modal";
import Footer from "@/components/shared/footer";

export default function Home() {
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
	return (
		<div className="flex flex-col h-screen justify-between px-6 py-4 md:px-8 bg-dark-700">
			<div className="flex flex-col items-center justify-center h-full space-y-10">
				<div>
					<h1 className="bg-gradient-to-r from-player-red-dark via-purple-600 to-player-blue-dark bg-clip-text text-transparent w-fit mx-auto text-3xl sm:text-5xl md:text-7xl font-bold font-lilita">
						SUPER TIC-TAC-TOE
					</h1>
					<div className="flex gap-2 items-center justify-center text-dark-300 text-sm md:text-xl">
						<p className="text-center">
							The best Tic-Tac-Toe game in the world!
						</p>
						<SmileyWink size={28} />
					</div>
				</div>
				<div className="flex gap-10">
					<Button onClick={() => setIsLoginModalOpen(true)}>
						Login
					</Button>
					<Button
						onClick={() => setIsRegisterModalOpen(true)}
						variant="secondary"
					>
						Register
					</Button>
				</div>
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
