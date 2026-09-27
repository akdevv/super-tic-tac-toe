import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth, signInAnonymously } from 'firebase/auth'
import {
  connectDatabaseEmulator,
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  remove,
  set,
  update,
} from 'firebase/database'
import { newGame, play, type GameState, type Player } from './game.ts'

/** Shape of `games/{id}`. Security rules in database.rules.json enforce turns. */
export interface OnlineGame {
  players: { X: string; O?: string }
  /** Who starts the current round; flips each rematch. */
  first: Player
  /** Two digits per move: cell index 0-80 (board * 9 + cell). */
  moves: string
  score: { X: number; O: number; draw: number }
  presence?: Record<string, boolean>
}

const env = import.meta.env
// No Firebase config in dev = use the local emulator (`pnpm emulators`).
const emulator = env.DEV && !env.VITE_FIREBASE_API_KEY

const app = initializeApp(
  emulator
    ? {
        apiKey: 'demo',
        projectId: 'demo-sttt',
        databaseURL: 'http://127.0.0.1:9000?ns=demo-sttt-default-rtdb',
      }
    : {
        apiKey: env.VITE_FIREBASE_API_KEY,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
        databaseURL: env.VITE_FIREBASE_DATABASE_URL,
        projectId: env.VITE_FIREBASE_PROJECT_ID,
        appId: env.VITE_FIREBASE_APP_ID,
      },
)
const auth = getAuth(app)
const db = getDatabase(app)
if (emulator) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectDatabaseEmulator(db, '127.0.0.1', 9000)
}

const gameRef = (id: string, path = '') => ref(db, `games/${id}/${path}`)

/** Anonymous uid, stable per browser (Firebase persists it). */
export async function getUid(): Promise<string> {
  await auth.authStateReady()
  return (auth.currentUser ?? (await signInAnonymously(auth)).user).uid
}

export async function createGame(): Promise<string> {
  // ponytail: 8 hex chars, create rule rejects the rare collision.
  const id = crypto.randomUUID().slice(0, 8)
  await set(gameRef(id), {
    players: { X: await getUid() },
    first: 'X',
    moves: '',
    score: { X: 0, O: 0, draw: 0 },
  })
  return id
}

/** Takes the O seat. Rejects if someone else got it first. */
export async function joinGame(id: string) {
  await set(gameRef(id, 'players/O'), await getUid())
}

export function watchGame(id: string, cb: (g: OnlineGame | null) => void) {
  return onValue(gameRef(id), (snap) => cb(snap.val()))
}

/** Rebuilds the board by replaying moves; throws on an illegal move. */
export function replay(g: OnlineGame): GameState {
  return (g.moves.match(/../g) ?? [])
    .map(Number)
    .reduce((s, i) => play(s, Math.floor(i / 9), i % 9), newGame(g.first))
}

export function sendMove(
  id: string,
  g: OnlineGame,
  board: number,
  cell: number,
) {
  return set(
    gameRef(id, 'moves'),
    g.moves + String(board * 9 + cell).padStart(2, '0'),
  )
}

/** Records the result and starts a new round with the other starter. */
export function rematch(id: string, g: OnlineGame, winner: Player | 'draw') {
  return update(gameRef(id), {
    moves: '',
    first: g.first === 'X' ? 'O' : 'X',
    [`score/${winner}`]: g.score[winner] + 1,
  })
}

/** Marks `uid` online in this game until disconnect or cleanup. */
export function trackPresence(id: string, uid: string) {
  const me = gameRef(id, `presence/${uid}`)
  const unsub = onValue(ref(db, '.info/connected'), (snap) => {
    // Re-register on every reconnect; onDisconnect runs server-side.
    if (snap.val())
      onDisconnect(me)
        .remove()
        .then(() => set(me, true))
  })
  return () => {
    unsub()
    remove(me)
  }
}
