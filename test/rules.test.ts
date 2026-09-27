// Security rules check. Needs the emulator running: `pnpm emulators`, then `pnpm test:rules`.
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth, signInAnonymously } from 'firebase/auth'
import {
  connectDatabaseEmulator,
  get,
  getDatabase,
  goOffline,
  ref,
  set,
  update,
} from 'firebase/database'

async function user(name: string) {
  const app = initializeApp(
    {
      apiKey: 'demo',
      projectId: 'demo-sttt',
      databaseURL: 'http://127.0.0.1:9000?ns=demo-sttt-default-rtdb',
    },
    name,
  )
  const auth = getAuth(app)
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  const db = getDatabase(app)
  connectDatabaseEmulator(db, '127.0.0.1', 9000)
  const { uid } = (await signInAnonymously(auth)).user
  return { uid, db, path: (p: string) => ref(db, `games/${id}/${p}`) }
}

const id = `t${Date.now()}`
const ok = (p: Promise<unknown>) => assert.doesNotReject(p)
const denied = (p: Promise<unknown>) => assert.rejects(p, /PERMISSION_DENIED/i)

test('rules', async () => {
  const [host, guest, third, spectator] = await Promise.all(
    ['host', 'guest', 'third', 'spectator'].map(user),
  )
  const newGame = {
    players: { X: host.uid },
    first: 'X',
    moves: '',
    score: { X: 0, O: 0, draw: 0 },
  }

  // Create
  await denied(set(ref(guest.db, `games/${id}`), newGame)) // not own seat
  await ok(set(ref(host.db, `games/${id}`), newGame))
  await denied(set(ref(host.db, `games/${id}`), newGame)) // already exists
  assert.equal((await get(host.path('moves'))).val(), '')

  // Join
  await denied(set(host.path('moves'), '40')) // no opponent yet
  await denied(set(host.path('players/O'), host.uid)) // can't take both seats
  await denied(set(guest.path('players/O'), third.uid)) // only own uid
  await ok(set(guest.path('players/O'), guest.uid))
  await denied(set(third.path('players/O'), third.uid)) // seat taken

  // Moves
  await denied(set(guest.path('moves'), '40')) // X starts
  await denied(set(spectator.path('moves'), '40'))
  await denied(set(host.path('moves'), '4')) // bad format
  await denied(set(host.path('moves'), '81')) // out of range
  await ok(set(host.path('moves'), '40'))
  await denied(set(host.path('moves'), '4041')) // not X's turn
  await denied(set(guest.path('moves'), '0041')) // rewrites history
  await denied(set(guest.path('moves'), '404142')) // two moves at once
  await ok(set(guest.path('moves'), '4041'))

  // Can't steal the start or fake score mid-game
  await denied(set(guest.path('first'), 'O'))
  await denied(set(guest.path('score/O'), 5))
  await denied(set(host.path('moves'), '')) // reset needs the paired update

  // Rematch: reset + flip starter + score, atomically
  const rematch = { moves: '', first: 'O', 'score/X': 1 }
  await denied(update(ref(spectator.db, `games/${id}`), rematch))
  await ok(update(ref(guest.db, `games/${id}`), rematch))
  await denied(update(ref(host.db, `games/${id}`), rematch)) // double reset
  assert.deepEqual((await get(host.path('score'))).val(), {
    X: 1,
    O: 0,
    draw: 0,
  })
  await denied(set(host.path('moves'), '40')) // O starts now
  await ok(set(guest.path('moves'), '40'))

  // Presence and junk fields
  await ok(set(host.path(`presence/${host.uid}`), true))
  await denied(set(host.path(`presence/${guest.uid}`), true))
  await denied(set(host.path('junk'), 1))

  ;[host, guest, third, spectator].forEach((u) => goOffline(u.db))
})
