import { bestMove } from './bot.ts'
import type { GameState } from './game.ts'

// Runs the search off the main thread so the page stays responsive.
onmessage = (e: MessageEvent<{ state: GameState; ms: number }>) => {
  postMessage(bestMove(e.data.state, e.data.ms))
}
