import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth, signInAnonymously } from 'firebase/auth'
import {
  connectDatabaseEmulator,
  getDatabase,
  goOffline,
  goOnline,
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
  update,
} from 'firebase/database'
import type { Player } from './game.ts'
import { encodeMove, newGameId, type OnlineGame } from './onlineCore.ts'

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

// The page opens the connection on mount and closes it on leave/idle, so
// nothing stays connected in the background.
export const connect = () => goOnline(db)
export const disconnect = () => goOffline(db)

const gameRef = (id: string, path = '') => ref(db, `games/${id}/${path}`)

let serverOffset = 0
onValue(ref(db, '.info/serverTimeOffset'), (s) => (serverOffset = s.val() ?? 0))
/** Current time on the database server (what the rules call `now`). */
export const serverNow = () => Date.now() + serverOffset

/** Anonymous uid, stable per browser (Firebase persists it). */
export async function getUid(): Promise<string> {
  await auth.authStateReady()
  return (auth.currentUser ?? (await signInAnonymously(auth)).user).uid
}

export async function createGame(): Promise<string> {
  connect()
  const uid = await getUid()
  // Retry on the (astronomically rare) id collision, which the rules reject.
  for (let attempt = 0; ; attempt++) {
    const id = newGameId()
    try {
      await set(gameRef(id), {
        players: { X: uid },
        first: 'X',
        moves: '',
        score: { X: 0, O: 0, draw: 0 },
      })
      return id
    } catch (e) {
      if (attempt >= 2) throw e
    }
  }
}

/** Takes the O seat. Rejects if it's taken or the host is offline. */
export async function joinGame(id: string) {
  await set(gameRef(id, 'players/O'), await getUid())
}

/** Calls `onDenied` when the game becomes unreadable (full, you're not in it). */
export function watchGame(
  id: string,
  cb: (g: OnlineGame | null) => void,
  onDenied: () => void,
) {
  return onValue(gameRef(id), (snap) => cb(snap.val()), onDenied)
}

export function sendMove(
  id: string,
  g: OnlineGame,
  board: number,
  cell: number,
) {
  return set(gameRef(id, 'moves'), g.moves + encodeMove(board, cell))
}

/** Records the result and starts a new round with the other starter. */
export function rematch(id: string, g: OnlineGame, winner: Player | 'draw') {
  return update(gameRef(id), {
    moves: '',
    first: g.first === 'X' ? 'O' : 'X',
    forfeit: null,
    [`score/${winner}`]: g.score[winner] + 1,
  })
}

/** Ends the game with `loser` losing: resigning, or claiming a disconnect. */
export function forfeit(id: string, loser: Player) {
  return set(gameRef(id, 'forfeit'), loser)
}

/** Marks `uid` online; the server records the time if the connection drops. */
export function trackPresence(id: string, uid: string) {
  const me = gameRef(id, `presence/${uid}`)
  return onValue(ref(db, '.info/connected'), (snap) => {
    // Re-register on every reconnect; onDisconnect runs server-side.
    if (snap.val())
      onDisconnect(me)
        .set(serverTimestamp())
        .then(() => set(me, true))
  })
}
