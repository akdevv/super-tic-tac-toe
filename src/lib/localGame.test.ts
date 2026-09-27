import assert from 'node:assert/strict'
import { test } from 'node:test'
import { canPlay, newGame, play, type Player } from './game.ts'
import {
  canUndo,
  GAME_TTL,
  loadGame,
  loadScore,
  reducer,
  saveGame,
  saveScore,
  stateOf,
  type Action,
  type LocalGame,
} from './localGame.ts'

const fresh = (bot: Player | null = null): LocalGame => ({
  bot,
  first: 'X',
  moves: [],
  score: {},
})
const run = (g: LocalGame, ...actions: Action[]) => actions.reduce(reducer, g)
const mv = (cell: number): Action => ({ type: 'move', cell })

/** Map-backed stand-in for localStorage/sessionStorage. */
function memStore() {
  const m = new Map<string, string>()
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    raw: m,
  }
}

/** Plays random legal moves until the game ends. */
function finish(g: LocalGame): LocalGame {
  while (!stateOf(g).winner) {
    const s = stateOf(g)
    const legal = [...Array(81).keys()].filter((i) =>
      canPlay(s, Math.floor(i / 9), i % 9),
    )
    g = reducer(g, mv(legal[Math.floor(Math.random() * legal.length)]))
  }
  return g
}

test('ignores illegal moves instead of throwing', () => {
  const g = run(fresh(), mv(36)) // X board 4 cell 0 -> O must play board 0
  assert.equal(reducer(g, mv(45)), g) // wrong board
  assert.equal(reducer(g, mv(36)), g) // occupied
  assert.equal(reducer(g, mv(81)), g) // out of range
  assert.equal(reducer(g, mv(-1)), g)
})

test('undo in 2-player takes back one move', () => {
  const g = run(fresh(), mv(36), mv(0))
  assert.deepEqual(reducer(g, { type: 'undo' }).moves, [36])
  assert.equal(canUndo(fresh()), false)
})

test("undo vs bot takes back the bot's reply and your move", () => {
  // Human X moved, bot O replied: back to empty board, your turn.
  const g = run(fresh('O'), mv(36), mv(0))
  assert.deepEqual(reducer(g, { type: 'undo' }).moves, [])
  // Bot still thinking after your move: only your move is undone.
  assert.deepEqual(reducer(run(fresh('O'), mv(36)), { type: 'undo' }).moves, [])
})

test('undo is disabled when only the bot has moved, or the game is over', () => {
  const botFirst = run({ ...fresh('X') }, mv(36)) // bot X opened
  assert.equal(canUndo(botFirst), false)
  assert.equal(reducer(botFirst, { type: 'undo' }), botFirst)
  const done = finish(fresh())
  assert.equal(canUndo(done), false)
})

test('a finished game scores once, with the right key', () => {
  for (let i = 0; i < 10; i++) {
    const g = finish(fresh())
    const w = stateOf(g).winner!
    assert.deepEqual(g.score, { [w]: 1 })
    assert.equal(reducer(g, mv(40)), g) // no moves after the end
  }
  const vsBot = finish(fresh('O'))
  const w = stateOf(vsBot).winner
  const key = w === 'draw' ? 'draw' : w === 'O' ? 'bot' : 'you'
  assert.deepEqual(vsBot.score, { [key]: 1 })
})

test('restart alternates the starter and keeps the score', () => {
  const g = finish(fresh())
  const next = reducer(g, { type: 'restart' })
  assert.equal(next.first, 'O')
  assert.deepEqual(next.moves, [])
  assert.deepEqual(next.score, g.score)
  assert.equal(reducer(next, { type: 'restart' }).first, 'X')
  assert.deepEqual(reducer(g, { type: 'resetScore' }).score, {})
})

test('saved game round-trips and replays to the same board', () => {
  const store = memStore()
  const g = run(fresh(), mv(36), mv(0), mv(4))
  saveGame(store, 'local', g, 1000)
  const loaded = loadGame(store, 'local', 2000)
  assert.deepEqual(loaded, { first: 'X', moves: [36, 0, 4] })
  assert.deepEqual(stateOf({ ...g, ...loaded! }), stateOf(g))
})

test('saved game expires after the TTL and is removed', () => {
  const store = memStore()
  saveGame(store, 'local', run(fresh(), mv(36)), 0)
  assert.notEqual(loadGame(store, 'local', GAME_TTL), null)
  assert.equal(loadGame(store, 'local', GAME_TTL + 1), null)
  assert.equal(store.raw.size, 0)
})

test('one saved game per tab: other modes are not restored', () => {
  const store = memStore()
  saveGame(store, 'bot-hard-X', run(fresh('O'), mv(36)))
  assert.equal(loadGame(store, 'local'), null)
  assert.equal(loadGame(store, 'bot-hard-O'), null)
  assert.notEqual(loadGame(store, 'bot-hard-X'), null)
})

test('corrupt or tampered saves are rejected', () => {
  const store = memStore()
  const now = Date.now()
  const put = (v: unknown) => store.setItem('sttt:game', JSON.stringify(v))
  const base = { mode: 'local', first: 'X', savedAt: now }

  store.setItem('sttt:game', '{not json')
  assert.equal(loadGame(store, 'local', now), null)
  put({ ...base, moves: [36, 45] }) // O played the wrong board
  assert.equal(loadGame(store, 'local', now), null)
  put({ ...base, moves: [36, 36] }) // occupied
  assert.equal(loadGame(store, 'local', now), null)
  put({ ...base, moves: ['36'] })
  assert.equal(loadGame(store, 'local', now), null)
  put({ ...base, first: 'Z', moves: [] })
  assert.equal(loadGame(store, 'local', now), null)
  put({ ...base, moves: 'nope' })
  assert.equal(loadGame(store, 'local', now), null)
  put({ ...base, savedAt: 'yesterday', moves: [] })
  assert.equal(loadGame(store, 'local', now), null)
})

test('score persists per mode and drops junk values', () => {
  const store = memStore()
  saveScore(store, 'local', { X: 2, O: 1, draw: 0 })
  saveScore(store, 'bot-hard', { you: 1, bot: 3 })
  assert.deepEqual(loadScore(store, 'local'), { X: 2, O: 1, draw: 0 })
  assert.deepEqual(loadScore(store, 'bot-hard'), { you: 1, bot: 3 })
  assert.deepEqual(loadScore(store, 'bot-easy'), {})
  store.setItem(
    'sttt:score:local',
    JSON.stringify({ X: -1, O: 1.5, draw: '2', evil: 9, you: 4 }),
  )
  assert.deepEqual(loadScore(store, 'local'), { you: 4 })
  store.setItem('sttt:score:local', 'garbage')
  assert.deepEqual(loadScore(store, 'local'), {})
})

test('storage that throws (blocked/full) does not break the game', () => {
  const broken = {
    getItem: () => {
      throw new Error('blocked')
    },
    setItem: () => {
      throw new Error('full')
    },
    removeItem: () => {
      throw new Error('blocked')
    },
  }
  saveGame(broken, 'local', fresh())
  saveScore(broken, 'local', {})
  assert.equal(loadGame(broken, 'local'), null)
  assert.deepEqual(loadScore(broken, 'local'), {})
})

test('stateOf matches playing the same moves directly', () => {
  const g = run(fresh(), mv(36), mv(0))
  assert.deepEqual(stateOf(g), play(play(newGame(), 4, 0), 0, 0))
})
