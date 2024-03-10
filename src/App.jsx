import Footer from "./components/Footer";
import GameBoard from "./components/GameBoard";

function App() {
	return (
		<>
			<div className="flex flex-col justify-center h-screen p-5 bg-primaryLight">
				<div className="flex flex-grow items-center justify-center">
					<GameBoard />
				</div>
				<Footer />
			</div>
		</>
	);
}

export default App;
