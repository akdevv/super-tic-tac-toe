"use client";

import { useState } from "react";
import { Gear, GameController } from "@phosphor-icons/react";

import Button from "@/components/shared/button";
import Board from "@/components/game/board/board";
import MiniModal from "@/components/game/settings/mini-modal";
import Scoreboard from "@/components/game/scoreboard/scoreboard";

export default function OfflineGame() {
	const [isMiniModalOpen, setIsMiniModalOpen] = useState(false);

	return (
		<div className="flex flex-col items-center justify-between h-full">
			<Scoreboard />
			<Board />

			<div className="flex w-full justify-between">
				{isMiniModalOpen && (
					<MiniModal
						isOpen={isMiniModalOpen}
						onClose={() => setIsMiniModalOpen(false)}
					/>
				)}

				<Button variant="icon" onClick={() => setIsMiniModalOpen(true)}>
					<Gear size={28} />
				</Button>

				<Button variant="icon">
					<GameController size={28} />
				</Button>
			</div>
		</div>
	);
}
