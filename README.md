# super-tic-tac-toe

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Game Rules

1. Super Tic Tac Toe incorporates all the basic rules of regular Tic Tac Toe.
2. The player using X starts the game. The subsequent move by player O must be in the smaller Tic Tac Toe grid that corresponds to the grid position marked by X.
3. If the designated smaller Tic Tac Toe grid for the next move is either full or already won, the player is free to make their move in any grid.
4. If a player's move leads to the next move being in a smaller Tic Tac Toe grid that is already won or full, the next player can choose any available space in any grid for their move.
5. To win the game, a player must form a straight line (horizontal, vertical, or diagonal) comprised of three smaller Tic Tac Toe grids that they have won.
6. The game ends when one of the players forms a line winner, or all grids are completed. The player with the most individual grid wins is declared the final winner if no line winner is formed.
