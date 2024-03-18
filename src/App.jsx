import Footer from "./components/Footer";
import Button from "./components/Button";
import Game from "./components/Game/Game";

function App() {
	return (
		<>
			<div className="flex flex-col justify-center h-screen p-5 bg-primaryLight">
				<Game />
				<div className="flex justify-between">
					<Button src="/settings-btn.svg" />
					<Footer />
					<Button text={"i"} />
				</div>
			</div>
		</>
	);
}

export default App;
