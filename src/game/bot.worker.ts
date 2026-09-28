import { bestMove } from './bot.ts'
import type { GameState } from './engine.ts'

onmessage = (e: MessageEvent<{ state: GameState; ms: number }>) => {
  postMessage(bestMove(e.data.state, e.data.ms))
}
