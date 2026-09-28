import { useEffect, useMemo, useReducer, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import Board from '../components/Board.tsx'
import Device, { Hud, StatusLine, type Pad } from '../components/Device.tsx'
import { sfx } from '../audio/sfx.ts'
import { Menu } from '../components/Menu.tsx'
import { useGameSounds } from '../hooks/useSound.ts'
import { useSettingsMenu } from '../hooks/useSettingsMenu.tsx'
import { useAboutMenu } from '../hooks/useAboutMenu.ts'
import About from '../components/About.tsx'
import { haptic } from '../audio/haptics.ts'
import { useMenu, type MenuEntry } from '../hooks/useMenu.ts'
import { useOnceHint } from '../hooks/useOnceHint.ts'
import { useRules } from '../hooks/useRules.ts'
import Rules from '../components/Rules.tsx'
import {
  ResultBanner,
  ScreenOverlay,
  ScreenChip,
} from '../components/Overlay.tsx'
import Sprite, { DrawMark } from '../components/Sprite.tsx'
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

// Even touching sessionStorage/localStorage can throw when storage is blocked.
const noStore = { getItem: () => null, setItem() {}, removeItem() {} }
function storage(kind: 'sessionStorage' | 'localStorage') {
  try {
    return window[kind]
  } catch {
    return noStore
  }
}

/** Reads the mode from the URL; remounts the game when it changes. */
export default function Game() {
  const [params] = useSearchParams()
  const levelParam = params.get('bot') ?? ''
  const level = Object.hasOwn(LEVELS, levelParam) ? (levelParam as Level) : null
  const me: Player = params.get('me') === 'O' ? 'O' : 'X'
  const bot = level ? other(me) : null
  const mode = level ? `bot-${level}-${me}` : 'local'
  // Score is per difficulty, not per side, since it's kept as you/bot.
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

  // Cursor snaps into the forced board after each move.
  const [rawCursor, setCursor] = useState(40)
  const cursor = followPlay(s, rawCursor)
  const [showCursor, setShowCursor] = useState(false)
  const [overlay, setOverlay] = useState<
    'pause' | 'settings' | 'about' | 'help' | null
  >(null)
  // The result banner can be hidden to look at the final board.
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
      onSelect: () => {
        settings.setSel(0)
        setOverlay('settings')
      },
    },
    { label: 'how to play', onSelect: () => setOverlay('help') },
    {
      label: 'main menu',
      hint: 'THIS GAME STAYS SAVED FOR 1 HOUR',
      onSelect: () => navigate('/'),
    },
  ]
  const pause = useMenu(pauseEntries, close)
  const about = useAboutMenu(() => setOverlay('settings'))
  const settings = useSettingsMenu(
    () => setOverlay('pause'),
    () => {
      about.setSel(0)
      setOverlay('about')
    },
  )
  const blocked = () => {
    sfx.blocked()
    haptic.blocked()
  }
  // First-time players learn that START holds new game, undo and the menu.
  const [startHint, dismissStartHint] = useOnceHint('sttt:hint:start')
  const rules = useRules(close)
  const undo = () => {
    sfx.undo()
    dispatch({ type: 'undo' })
  }
  const restart = () => {
    sfx.start()
    dispatch({ type: 'restart' })
  }
  const openHelp = () => {
    sfx.select()
    setOverlay('help')
  }
  const closeOverlay = () => {
    sfx.back()
    close()
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
    // First press just reveals the cursor.
    if (!showCursor) return setShowCursor(true)
    const board = Math.floor(cursor / 9)
    if (!botThinking && canPlay(s, board, cursor % 9)) {
      haptic.place()
      dispatch({ type: 'move', cell: cursor })
    } else blocked()
  }

  const pads: Record<'game' | 'pause' | 'settings' | 'about' | 'help', Pad> = {
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
      select: openHelp,
      labels: {
        a: s.winner ? 'AGAIN' : 'PLACE',
        b: s.winner ? (bannerShown ? 'BOARD' : 'RESULT') : 'UNDO',
        start: 'PAUSE',
        select: 'HELP',
      },
    },
    pause: {
      ...pause.pad,
      start: closeOverlay,
      select: openHelp,
      labels: { a: 'OK', b: 'BACK', start: 'RESUME', select: 'HELP' },
    },
    settings: {
      ...settings.pad,
      start: closeOverlay,
      labels: { a: 'OK', b: 'BACK', start: 'RESUME' },
    },
    about: {
      ...about.pad,
      start: closeOverlay,
      labels: { a: 'OK', b: 'BACK', start: 'RESUME' },
    },
    help: rules.pad,
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
    // The sprite before the text shows whose turn it is; the hidden letter
    // says it for screen readers.
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
            title={result}
            icon={
              s.winner === 'draw' ? (
                <DrawMark className="animate-pop text-lcd-3 w-16" />
              ) : (
                <Sprite
                  p={s.winner!}
                  className="animate-pop text-lcd-3 size-10"
                />
              )
            }
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
      {overlay === 'settings' && (
        <ScreenOverlay title="SETTINGS">
          <Menu label="Settings" {...settings} />
        </ScreenOverlay>
      )}
      {overlay === 'about' && (
        <ScreenOverlay label="About">
          <About {...about} />
        </ScreenOverlay>
      )}
      {overlay === 'help' && (
        <ScreenOverlay label="How to play">
          <Rules
            page={rules.page}
            setPage={rules.setPage}
            onDone={rules.done}
          />
        </ScreenOverlay>
      )}
    </Device>
  )
}
