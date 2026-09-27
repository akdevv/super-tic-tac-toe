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
  onDisconnect,
  ref,
  serverTimestamp,
  set,
  update,
  type Database,
} from 'firebase/database'
import { newGameId } from '../../src/online/core.ts'

const DB_URL = 'http://127.0.0.1:9000?ns=demo-sttt-default-rtdb'

async function user(name: string) {
  const app = initializeApp(
    { apiKey: 'demo', projectId: 'demo-sttt', databaseURL: DB_URL },
    name,
  )
  const auth = getAuth(app)
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  const db = getDatabase(app)
  connectDatabaseEmulator(db, '127.0.0.1', 9000)
  const { uid } = (await signInAnonymously(auth)).user
  return { uid, db }
}
type User = Awaited<ReturnType<typeof user>>

const ok = (p: Promise<unknown>) => assert.doesNotReject(p)
const denied = (p: Promise<unknown>) => assert.rejects(p, /permission.denied/i)
const newGame = (hostUid: string) => ({
  players: { X: hostUid },
  first: 'X',
  moves: '',
  score: { X: 0, O: 0, draw: 0 },
})

let n = 0
const users: User[] = []
async function freshUser() {
  const u = await user(`u${n++}`)
  users.push(u)
  return u
}

/** Creates a game with host online and guest seated. */
async function startGame() {
  const [host, guest] = [await freshUser(), await freshUser()]
  const id = newGameId()
  const at = (u: User, p = '') => ref(u.db, `games/${id}/${p}`)
  await ok(set(at(host), newGame(host.uid)))
  await ok(set(at(host, `presence/${host.uid}`), true))
  await ok(set(at(guest, 'players/O'), guest.uid))
  return { id, host, guest, at }
}

test('create: valid id, own seat, clean initial state', async () => {
  const [host, other] = [await freshUser(), await freshUser()]
  const g = (db: Database, id: string) => ref(db, `games/${id}`)
  const base = newGame(host.uid)
  await denied(set(g(host.db, 'short'), base))
  await denied(set(g(host.db, 'abc-def_gh'), base)) // 10 chars, not alphanumeric
  await denied(set(g(other.db, newGameId()), base)) // not own seat
  await denied(set(g(host.db, newGameId()), { ...base, first: 'O' }))
  await denied(set(g(host.db, newGameId()), { ...base, moves: '40' }))
  await denied(
    set(g(host.db, newGameId()), { ...base, score: { X: 5, O: 0, draw: 0 } }),
  )
  await denied(set(g(host.db, newGameId()), { ...base, forfeit: 'O' }))
  await denied(set(g(host.db, newGameId()), { ...base, junk: 1 }))
  const id = newGameId()
  await ok(set(g(host.db, id), base))
  await denied(set(g(host.db, id), base)) // no overwrite
  await denied(set(g(host.db, id), null)) // no delete
  assert.equal((await get(ref(host.db, `games/${id}/moves`))).val(), '')
})

test('join: one guest only, host must be online, then game is private', async () => {
  const [host, guest, third] = [
    await freshUser(),
    await freshUser(),
    await freshUser(),
  ]
  const id = newGameId()
  const at = (u: User, p = '') => ref(u.db, `games/${id}/${p}`)
  await ok(set(at(host), newGame(host.uid)))

  await ok(get(at(third))) // anyone can read an open game (to join it)
  await denied(set(at(guest, 'players/O'), guest.uid)) // host not online yet
  await ok(set(at(host, `presence/${host.uid}`), true))
  await denied(set(at(host, 'players/O'), host.uid)) // can't take both seats
  await denied(set(at(guest, 'players/O'), third.uid)) // only own uid
  await ok(set(at(guest, 'players/O'), guest.uid))
  await denied(set(at(third, 'players/O'), third.uid)) // seat taken
  await denied(set(at(guest, 'players/O'), null)) // can't leave the seat
  await denied(set(at(third, 'players/X'), third.uid))

  await denied(get(at(third))) // full game: players only
  await ok(get(at(host)))
  await ok(get(at(guest)))
  await denied(set(at(third, `presence/${third.uid}`), true))
})

test('moves: turn order, format, append-only', async () => {
  const { host, guest, at } = await startGame()
  const spectator = await freshUser()
  await denied(set(at(guest, 'moves'), '40')) // X starts
  await denied(set(at(spectator, 'moves'), '40'))
  await denied(set(at(host, 'moves'), '4')) // bad format
  await denied(set(at(host, 'moves'), '81')) // out of range
  await denied(set(at(host, 'moves'), null)) // no delete
  await ok(set(at(host, 'moves'), '40'))
  await denied(set(at(host, 'moves'), '4041')) // not X's turn
  await denied(set(at(guest, 'moves'), '0041')) // rewrites history
  await denied(set(at(guest, 'moves'), '404142')) // two moves at once
  await ok(set(at(guest, 'moves'), '4041'))
  // No aborting a game or rigging the next one outside a rematch.
  await denied(set(at(host, 'moves'), ''))
  await denied(set(at(guest, 'first'), 'O'))
  await denied(set(at(guest, 'score/O'), 1))
  await denied(set(at(host, 'first'), null))
})

test('rematch: atomic, flips starter, score +1 at most', async () => {
  const { id, host, guest, at } = await startGame()
  const game = (u: User) => ref(u.db, `games/${id}`)
  await ok(set(at(host, 'moves'), '40'))
  await denied(update(game(guest), { moves: '', first: 'O', 'score/X': 2 })) // +2
  await denied(update(game(guest), { moves: '', first: 'X', 'score/X': 1 })) // no flip
  await denied(update(game(guest), { moves: '', first: 'O', 'score/X': -1 }))
  await denied(update(game(guest), { moves: '', first: 'O', score: null }))
  await ok(
    update(game(guest), { moves: '', first: 'O', 'score/X': 1, forfeit: null }),
  )
  // The other player's simultaneous click is rejected: no double count.
  await denied(
    update(game(host), { moves: '', first: 'X', 'score/X': 2, forfeit: null }),
  )
  assert.deepEqual((await get(at(host, 'score'))).val(), {
    X: 1,
    O: 0,
    draw: 0,
  })
  await denied(set(at(host, 'moves'), '40')) // O starts now
  await ok(set(at(guest, 'moves'), '40'))
})

test('forfeit: resign any time, claim only after opponent is gone 60s', async () => {
  const { id, host, guest, at } = await startGame()
  await ok(set(at(guest, `presence/${guest.uid}`), true))
  await ok(set(at(host, 'moves'), '40'))

  await denied(set(at(host, 'forfeit'), 'O')) // guest is online
  await denied(set(at(host, `presence/${host.uid}`), Date.now() + 60_000)) // future
  await ok(set(at(guest, `presence/${guest.uid}`), Date.now() - 30_000))
  await denied(set(at(host, 'forfeit'), 'O')) // only 30s
  await ok(set(at(guest, `presence/${guest.uid}`), Date.now() - 61_000))
  await denied(set(at(guest, 'forfeit'), 'X')) // can't claim a present host
  await ok(set(at(host, 'forfeit'), 'O'))
  await denied(set(at(host, 'forfeit'), 'X')) // can't overwrite
  await denied(set(at(host, 'forfeit'), null)) // only via rematch
  await denied(set(at(guest, 'moves'), '4041')) // game over

  const game = (u: User) => ref(u.db, `games/${id}`)
  await ok(
    update(game(host), { moves: '', first: 'O', 'score/X': 1, forfeit: null }),
  )

  // Resign: own mark only (guest is back, so no claim either).
  await ok(set(at(guest, `presence/${guest.uid}`), true))
  await denied(set(at(host, 'forfeit'), 'O'))
  await ok(set(at(host, 'forfeit'), 'X'))
})

test('disconnect sets a server timestamp via onDisconnect', async () => {
  const { host, guest, at } = await startGame()
  const p = at(guest, `presence/${guest.uid}`)
  await ok(set(p, true))
  await ok(onDisconnect(p).set(serverTimestamp()))
  const before = Date.now()
  goOffline(guest.db)
  // Server runs the handler; poll until it lands.
  let v: unknown = true
  for (let i = 0; i < 50 && v === true; i++) {
    await new Promise((r) => setTimeout(r, 100))
    v = (await get(at(host, `presence/${guest.uid}`))).val()
  }
  assert.equal(typeof v, 'number')
  assert.ok(Math.abs((v as number) - before) < 5000)
})

test.after(() => users.forEach((u) => goOffline(u.db)))
