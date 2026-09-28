import { useEffect, useMemo, useReducer, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import Device from '../device/Device.tsx'
import type { Pad } from '../device/pad.ts'
import { useOnceHint } from '../device/useOnceHint.ts'
import { haptic } from '../feedback/haptics.ts'
import { sfx } from '../feedback/sfx.ts'
import { blocked, useGameSounds } from '../feedback/useGameSounds.ts'
import { LEVELS, type Level, type Move } from '../game/bot.ts'
import { followPlay, moveWithin, type Dir } from '../game/cursor.ts'
import { canPlay, other, type Player } from '../game/engine.ts'
import {
  canUndo,
  loadGame,
  loadScore,
  reducer,
  saveGame,
  saveScore,
  stateOf,
  type LocalGame,
} from '../game/localGame.ts'
import { Menu } from '../menus/Menu.tsx'
import { useGameMenus } from '../menus/useGameMenus.tsx'
import { useMenu, type MenuEntry } from '../menus/useMenu.ts'
import Board from '../screen/Board.tsx'
import { Hud, StatusLine } from '../screen/Hud.tsx'
import { ResultBanner, ScreenChip, ScreenOverlay } from '../screen/Overlay.tsx'
import Sprite from '../screen/Sprite.tsx'

// Even touching sessionStorage/localStorage can throw when storage is blocked.
const noStore = { getItem: () => null, setItem() {}, removeItem() {} }
function storage(kind: 'sessionStorage' | 'localStorage') {
  try {
    return window[kind]
  } catch {
    return noStore
  }
}

export default function Game() {
  const [params] = useSearchParams()
  const levelParam = params.get('bot') ?? ''
  const level = Object.hasOwn(LEVELS, levelParam) ? (levelParam as Level) : null
  const me: Player = params.get('me') === 'O' ? 'O' : 'X'
  const bot = level ? other(me) : null
  const mode = level ? `bot-${level}-${me}` : 'local'
  // Scores are kept as you/bot, so they're per level, not per side.
  const scoreMode = level ? `bot-${level}` : 'local'
  return (
    <LocalGamePage
      key={mode}
      bot={bot}
      level={level}
      mode={mode}
      scoreMode={scoreMode}
    />
  )
}

interface Props {
  bot: Player | null
  level: Level | null
  mode: string
  scoreMode: string
}

function LocalGamePage({ bot, level, mode, scoreMode }: Props) {
  const navigate = useNavigate()
  const [g, dispatch] = useReducer(reducer, null, () => ({
    bot,
    first: 'X' as Player,
    moves: [],
    ...loadGame(storage('sessionStorage'), mode),
    score: loadScore(storage('localStorage'), scoreMode),
  }))
  const s = useMemo(() => stateOf(g), [g])
  const botThinking = bot !== null && !s.winner && s.turn === bot
  useGameSounds(s, g.moves.length, bot ? other(bot) : null)

  const [rawCursor, setCursor] = useState(40)
  const cursor = followPlay(s, rawCursor)
  const [showCursor, setShowCursor] = useState(false)
  const [overlay, setOverlay] = useState<
    'pause' | 'settings' | 'about' | 'help' | null
  >(null)
  const [hiddenFor, setHiddenFor] = useState<LocalGame | null>(null)
  const bannerShown = !!s.winner && hiddenFor !== g

  useEffect(() => saveGame(storage('sessionStorage'), mode, g), [mode, g])
  useEffect(
    () => saveScore(storage('localStorage'), scoreMode, g.score),
    [scoreMode, g.score],
  )

  useEffect(() => {
    if (!botThinking || !level) return
    const worker = new Worker(
      new URL('../game/bot.worker.ts', import.meta.url),
      { type: 'module' },
    )
    worker.onmessage = (e: MessageEvent<Move>) =>
      dispatch({ type: 'move', cell: e.data[0] * 9 + e.data[1] })
    worker.postMessage({ state: s, ms: LEVELS[level] })
    // Undo/restart/leaving mid-think kills the stale search.
    return () => worker.terminate()
  }, [botThinking, level, s])

  const close = () => setOverlay(null)
  const act = (action: Parameters<typeof dispatch>[0]) => () => {
    dispatch(action)
    close()
  }
  const menus = useGameMenus(setOverlay)
  const pauseEntries: MenuEntry[] = [
    { label: 'resume', onSelect: close },
    {
      label: 'undo',
      hint: bot ? "TAKES BACK YOUR MOVE AND THE CPU'S" : 'TAKES BACK ONE MOVE',
      disabled: !canUndo(g),
      onSelect: act({ type: 'undo' }),
    },
    {
      label: 'new game',
      hint: 'SCORE IS KEPT · STARTER SWAPS',
      onSelect: act({ type: 'restart' }),
    },
    {
      label: 'reset score',
      hint: 'BACK TO 00 - 00',
      onSelect: act({ type: 'resetScore' }),
    },
    {
      label: 'settings',
      hint: 'SOUND AND VIBRATION',
      onSelect: menus.openSettings,
    },
    { label: 'how to play', onSelect: () => setOverlay('help') },
    {
      label: 'main menu',
      hint: 'THIS GAME STAYS SAVED FOR 1 HOUR',
      onSelect: () => navigate('/'),
    },
  ]
  const pause = useMenu(pauseEntries, close)
  const [startHint, dismissStartHint] = useOnceHint('sttt:hint:start')

  const undo = () => {
    sfx.undo()
    dispatch({ type: 'undo' })
  }
  const restart = () => {
    sfx.start()
    dispatch({ type: 'restart' })
  }
  const openPause = () => {
    sfx.select()
    dismissStartHint()
    pause.setSel(0)
    setOverlay('pause')
  }
  const go = (dir: Dir) => () => {
    setShowCursor(true)
    setCursor(moveWithin(cursor, dir, s.winner ? null : s.activeBoard))
  }
  function pressA() {
    if (s.winner) return restart()
    if (!showCursor) return setShowCursor(true)
    const board = Math.floor(cursor / 9)
    if (!botThinking && canPlay(s, board, cursor % 9)) {
      haptic.place()
      dispatch({ type: 'move', cell: cursor })
    } else blocked()
  }

  const pads: Record<NonNullable<typeof overlay> | 'game', Pad> = {
    game: {
      up: go('up'),
      down: go('down'),
      left: go('left'),
      right: go('right'),
      a: pressA,
      b: s.winner
        ? () => setHiddenFor(bannerShown ? g : null)
        : canUndo(g)
          ? undo
          : undefined,
      start: openPause,
      select: menus.openHelp,
      labels: {
        a: s.winner ? 'AGAIN' : 'PLACE',
        b: s.winner ? (bannerShown ? 'BOARD' : 'RESULT') : 'UNDO',
        start: 'PAUSE',
        select: 'HELP',
      },
    },
    pause: {
      ...pause.pad,
      start: menus.closeOverlay,
      select: menus.openHelp,
      labels: { a: 'OK', b: 'BACK', start: 'RESUME', select: 'HELP' },
    },
    ...menus.pads,
  }

  const result =
    s.winner === 'draw'
      ? 'DRAW GAME'
      : s.winner && bot
        ? s.winner === bot
          ? 'CPU WINS'
          : 'YOU WIN!'
        : `${s.winner} WINS!`

  let status
  if (s.winner) status = 'game over · A to play again'
  else if (botThinking)
    status = (
      <>
        cpu thinking<span className="animate-blink">…</span>
      </>
    )
  else {
    status = (
      <>
        {!bot && <span className="sr-only">{s.turn} </span>}
        {bot ? 'your move' : 'to move'}
        {s.activeBoard === null && ' · any board'}
      </>
    )
  }

  const n = (k: string) => g.score[k] ?? 0
  const hud: [string, number][] = bot
    ? [
        [`YOU ${other(bot)}`, n('you')],
        [`CPU ${level?.toUpperCase()}`, n('bot')],
        ['DRAW', n('draw')],
      ]
    : [
        ['X', n('X')],
        ['O', n('O')],
        ['DRAW', n('draw')],
      ]

  return (
    <Device
      title={level ? `vs CPU (${level})` : '2 players'}
      pad={pads[overlay ?? 'game']}
      glow={startHint && !overlay ? 'start' : undefined}
    >
      <Hud items={hud} />
      <div className="relative">
        <Board
          state={s}
          locked={botThinking}
          last={g.moves.at(-1)}
          cursor={cursor}
          showCursor={showCursor && !s.winner}
          onCursor={setCursor}
          onBlocked={blocked}
          onPlay={(b, c) => {
            setShowCursor(false)
            haptic.place()
            dispatch({ type: 'move', cell: b * 9 + c })
          }}
        />
        {bannerShown && (
          <ResultBanner
            winner={s.winner!}
            title={result}
            hint="A: PLAY AGAIN · B: SEE BOARD"
            onDismiss={() => setHiddenFor(g)}
          />
        )}
        {startHint && !bannerShown && !overlay && (
          <ScreenChip blink>PRESS START FOR MENU</ScreenChip>
        )}
      </div>
      <StatusLine
        icon={!s.winner && <Sprite p={s.turn} className="size-3.5 shrink-0" />}
      >
        {status}
      </StatusLine>

      {overlay === 'pause' && (
        <ScreenOverlay title="PAUSED">
          <Menu label="Pause menu" entries={pauseEntries} {...pause} />
        </ScreenOverlay>
      )}
      {menus.render(overlay)}
    </Device>
  )
}
