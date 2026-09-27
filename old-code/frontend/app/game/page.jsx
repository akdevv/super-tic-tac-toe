"use client";

import { GameController } from "@phosphor-icons/react";

import Button from "@/components/shared/button";
import Board from "@/components/game/board/board";
import Scoreboard from "@/components/game/scoreboard/scoreboard";
import SettingsButton from "@/components/game/settings/settings-button";

export default function OfflineGame() {
	return (
		<div className="flex flex-col items-center justify-between h-full">
			<Scoreboard />
			<Board />

			<div className="flex w-full justify-between">
				<SettingsButton />

				<Button variant="icon">
					<GameController size={28} />
				</Button>
			</div>
		</div>
	);
}
