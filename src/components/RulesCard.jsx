function RulesCard() {
	return (
		<div className="">
			<div className="">
				<h2 className="">#Game Rules</h2>
				<ol className="">
					<li className="mb-2">
						1. Super Tic Tac Toe incorporates all the basic rules of
						regular Tic Tac Toe.
					</li>
					<li className="mb-2">
						2. The player using X starts the game. The subsequent
						move by player O must be in the smaller Tic Tac Toe grid
						that corresponds to the grid position marked by X.
					</li>
					<li className="mb-2">
						3. If the designated smaller Tic Tac Toe grid for the
						next move is either full or already won, the player is
						free to make their move in any grid.
					</li>
					<li className="mb-2">
						4. If a player&apos;s move leads to the next move being
						in a smaller Tic Tac Toe grid that is already won or
						full, the next player can choose any available space in
						any grid for their move.
					</li>
					<li className="mb-2">
						5. To win the game, a player must form a straight line
						(horizontal, vertical, or diagonal) comprised of three
						smaller Tic Tac Toe grids that they have won.
					</li>
					<li>
						6. The game ends when one of the players forms a line
						winner, or all grids are completed. The player with the
						most individual grid wins is declared the final winner
						if no line winner is formed.
					</li>
				</ol>
			</div>
		</div>
	);
}

export default RulesCard;
