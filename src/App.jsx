import { useState } from "react";
import Footer from "./components/Footer";
import Game from "./components/Game/Game";
import InfoBtn from "./components/InfoBtn";
import SettingsBtn from "./components/SettingsBtn";

function App() {
	const [showInfo, setShowInfo] = useState(false);

	const toggleInfoCard = () => {
		setShowInfo(!showInfo);
	};

	return (
		<>
			<div
				className={`flex flex-col justify-center h-screen p-5 bg-primaryLight`}
			>
				<Game />
				<div className="flex justify-between">
					<SettingsBtn />
					<Footer />
					<InfoBtn
						text={"i"}
						showInfo={showInfo}
						onClick={toggleInfoCard}
					/>
				</div>
			</div>
		</>
	);
}

export default App;
