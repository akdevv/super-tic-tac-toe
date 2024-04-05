import { useState } from "react";
import Footer from "./components/Footer";
import Button from "./components/Button";
import Game from "./components/Game/Game";
import RulesCard from "./components/RulesCard";

function App() {
	const [infoCard, setInfoCard] = useState(false);
	const [settingsCard, setSettingsCard] = useState(false);

	const toggleCard = (cardName) => {
		if (cardName === "infoCard") {
			setInfoCard(!infoCard);
		} else if (cardName === "settingsCard") {
			setSettingsCard(!settingsCard);
		}
	};

	return (
		<>
			<div className="flex flex-col justify-center h-screen p-5 bg-primaryLight">
				<Game />
				<div className="flex justify-between">
					<Button
						src="/settings-btn.svg"
						onClick={() => toggleCard("settingsCard")}
					/>
					{settingsCard && <div>SettingsCard</div>}
					<Footer />
					<Button text={"i"} onClick={() => toggleCard("infoCard")} />
					{/* {infoCard && <RulesCard />} */}
					<RulesCard />
				</div>
			</div>
		</>
	);
}

export default App;
