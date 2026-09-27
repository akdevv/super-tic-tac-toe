import assert from 'node:assert/strict'
import { test } from 'node:test'
import { newGame, play } from './game.ts'
import {
  decodeMoves,
  encodeMove,
  isGameId,
  newGameId,
  onlineState,
  seatOf,
  type OnlineGame,
} from './onlineCore.ts'

test('ids are 10 alphanumeric chars and valid', () => {
  for (let i = 0; i < 1000; i++) {
    const id = newGameId()
    assert.match(id, /^[A-Za-z0-9]{10}$/)
    assert.ok(isGameId(id))
  }
})

test('ids do not repeat', () => {
  const ids = new Set(Array.from({ length: 10000 }, newGameId))
  assert.equal(ids.size, 10000)
})

test('every character gets used (no skewed alphabet)', () => {
  const seen = new Set(Array.from({ length: 2000 }, newGameId).join(''))
  assert.equal(seen.size, 62)
})

test('rejects malformed ids, including Firebase path characters', () => {
  for (const bad of [
    '',
    'abc',
    'abcdefghijk',
    'abcde/ghij',
    'abcde.ghij',
    'abcde#ghij',
    'abcde$ghij',
    'abcde[ghij',
    'abcde ghij',
    'abcdé fghi',
  ])
    assert.equal(isGameId(bad), false, bad)
})

const game = (over: Partial<OnlineGame> = {}): OnlineGame => ({
  players: { X: 'hostUid', O: 'guestUid' },
  first: 'X',
  moves: '',
  score: { X: 0, O: 0, draw: 0 },
  ...over,
})

test('moves encode to two digits and decode back', () => {
  assert.equal(encodeMove(0, 0), '00')
  assert.equal(encodeMove(4, 0), '36')
  assert.equal(encodeMove(8, 8), '80')
  assert.deepEqual(decodeMoves('360080'), [36, 0, 80])
  assert.deepEqual(decodeMoves(''), [])
})

test('online state replays moves like a local game', () => {
  assert.deepEqual(
    onlineState(game({ moves: '3600' })),
    play(play(newGame(), 4, 0), 0, 0),
  )
  assert.equal(onlineState(game({ first: 'O', moves: '36' })).turn, 'X')
})

test('a forfeit ends an unfinished game for the other player', () => {
  assert.equal(onlineState(game({ moves: '36', forfeit: 'X' })).winner, 'O')
  assert.equal(onlineState(game({ forfeit: 'O' })).winner, 'X')
})

test('an illegal move in the stored string loses for its maker', () => {
  // X 36 sends O to board 0; O plays 45 (board 5) instead.
  assert.equal(onlineState(game({ moves: '3645' })).winner, 'X')
})

test('a result on the board beats a later forfeit', () => {
  const s = onlineState(game({ moves: '3645', forfeit: 'X' }))
  assert.equal(s.winner, 'X')
})

test('seatOf maps uids to marks', () => {
  assert.equal(seatOf(game(), 'hostUid'), 'X')
  assert.equal(seatOf(game(), 'guestUid'), 'O')
  assert.equal(seatOf(game(), 'someoneElse'), null)
  assert.equal(seatOf(game({ players: { X: 'hostUid' } }), 'x'), null)
})
