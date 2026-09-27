import { canPlay, other, play, type GameState, type Result } from './engine.ts'

export type Move = [board: number, cell: number]

/** Thinking time per move in ms. 0 = random legal move. */
export const LEVELS = { easy: 0, medium: 200, hard: 1500 }
export type Level = keyof typeof LEVELS

export function legalMoves(s: GameState): Move[] {
  const moves: Move[] = []
  if (s.winner) return moves
  for (let b = 0; b < 9; b++) {
    for (let c = 0; c < 9; c++) if (canPlay(s, b, c)) moves.push([b, c])
  }
  return moves
}

const pick = <T>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]

interface Node {
  state: GameState
  move: Move | null
  parent: Node | null
  children: Node[]
  untried: Move[]
  /** Score for the player who made `move`: win 1, draw 0.5. */
  wins: number
  visits: number
}

function node(state: GameState, move: Move | null, parent: Node | null): Node {
  return {
    state,
    move,
    parent,
    children: [],
    untried: legalMoves(state),
    wins: 0,
    visits: 0,
  }
}

function rollout(s: GameState): Result {
  while (!s.winner) s = play(s, ...pick(legalMoves(s)))
  return s.winner
}

/**
 * Monte Carlo Tree Search: repeatedly picks a promising line (UCT), plays
 * the rest of the game randomly, and credits the result back up the tree.
 * Returns the most-visited move after `ms` milliseconds.
 */
export function bestMove(s: GameState, ms: number): Move {
  const moves = legalMoves(s)
  if (moves.length === 0) throw new Error('No legal moves: game is over')
  if (moves.length === 1) return moves[0]
  const root = node(s, null, null)
  const end = Date.now() + ms

  while (Date.now() < end) {
    // Select
    let n = root
    while (n.untried.length === 0 && n.children.length > 0) {
      const logN = Math.log(n.visits)
      n = n.children.reduce((best, c) => {
        const uct = (c: Node) =>
          c.wins / c.visits + 1.4 * Math.sqrt(logN / c.visits)
        return uct(c) > uct(best) ? c : best
      })
    }
    // Expand
    if (n.untried.length > 0) {
      const m = n.untried.splice(
        Math.floor(Math.random() * n.untried.length),
        1,
      )[0]
      const child = node(play(n.state, ...m), m, n)
      n.children.push(child)
      n = child
    }
    // Simulate + backpropagate
    const result = rollout(n.state)
    for (let p: Node | null = n; p; p = p.parent) {
      const mover = other(p.state.turn)
      p.visits++
      p.wins += result === mover ? 1 : result === 'draw' ? 0.5 : 0
    }
  }

  if (root.children.length === 0) return pick(moves)
  return root.children.reduce((a, b) => (b.visits > a.visits ? b : a)).move!
}
