import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'
import Device from '../device/Device.tsx'
import type { Pad } from '../device/pad.ts'
import { useOnceHint } from '../device/useOnceHint.ts'
import { haptic } from '../feedback/haptics.ts'
import { sfx } from '../feedback/sfx.ts'
import { blocked, useGameSounds } from '../feedback/useGameSounds.ts'
import { followPlay, moveWithin, type Dir } from '../game/cursor.ts'
import { canPlay, other } from '../game/engine.ts'
import { Menu } from '../menus/Menu.tsx'
import { useGameMenus } from '../menus/useGameMenus.tsx'
import { useMenu, type MenuEntry } from '../menus/useMenu.ts'
import {
  decodeMoves,
  FORFEIT_AFTER,
  IDLE_TIMEOUT,
  isGameId,
  onlineState,
  seatOf,
  type OnlineGame as Game,
} from '../online/core.ts'
import {
  connect,
  disconnect,
  forfeit,
  getUid,
  joinGame,
  rematch,
  sendMove,
  serverNow,
  trackPresence,
  watchGame,
} from '../online/firebase.ts'
import Board from '../screen/Board.tsx'
import { Hud, MessageScreen, StatusLine } from '../screen/Hud.tsx'
import { ResultBanner, ScreenChip, ScreenOverlay } from '../screen/Overlay.tsx'
import Sprite from '../screen/Sprite.tsx'

function Message({ title, children }: { title: string; children?: ReactNode }) {
  const navigate = useNavigate()
  const home = () => navigate('/')
  return (
    <Device
      title="Online game"
      ledLabel="LINK"
      pad={{
        a: home,
        b: home,
        start: home,
        labels: { a: 'MENU', start: 'MENU' },
      }}
    >
      <MessageScreen title={title}>{children}</MessageScreen>
    </Device>
  )
}

async function shareLink(onCopied: () => void) {
  const url = location.href
  try {
    if (navigator.share)
      await navigator.share({ title: 'Super Tic-Tac-Toe', url })
    else {
      await navigator.clipboard.writeText(url)
      onCopied()
    }
  } catch {
    // share sheet dismissed or clipboard blocked
  }
}

export default function OnlineGame() {
  const navigate = useNavigate()
  const id = useParams().id ?? ''
  const validId = isGameId(id)
  const [uid, setUid] = useState<string>()
  const [game, setGame] = useState<Game | null>() // undefined = loading
  const [denied, setDenied] = useState(false)
  const [idle, setIdle] = useState(false)
  const [copied, setCopied] = useState(false)
  const [overlay, setOverlay] = useState<
    'pause' | 'resign' | 'settings' | 'about' | 'help' | null
  >(null)
  const [rawCursor, setCursor] = useState(40)
  const [showCursor, setShowCursor] = useState(false)
  const [hiddenFor, setHiddenFor] = useState<string | null>(null)

  const s = game ? onlineState(game) : null
  const seat = game && uid ? seatOf(game, uid) : null
  const opponent = seat && game ? game.players[other(seat)] : undefined
  const opponentLeftAt = opponent ? game?.presence?.[opponent] : undefined
  const opponentAway =
    typeof opponentLeftAt === 'number' ? opponentLeftAt : null
  const hostOnline = game?.presence?.[game.players.X] === true
  const inPlay = !!seat && !!game?.players.O && !s?.winner && !idle

  useEffect(() => {
    if (idle) return
    connect()
    return disconnect
  }, [idle])

  useEffect(() => {
    if (validId) getUid().then(setUid)
  }, [validId])

  useEffect(() => {
    if (!validId || !uid) return
    return watchGame(id, setGame, () => setDenied(true))
  }, [id, validId, uid])

  // Losing the seat race to another guest makes the game unreadable: "full".
  const canJoin =
    !!uid && !!game && seat === null && !game.players.O && hostOnline && !idle
  useEffect(() => {
    if (canJoin) joinGame(id).catch(() => {})
  }, [canJoin, id])

  useEffect(() => {
    if (seat && uid && !idle) return trackPresence(id, uid)
  }, [seat, id, uid, idle])

  // Opponent gone for FORFEIT_AFTER: claim the win (the rules verify the time).
  useEffect(() => {
    if (!inPlay || opponentAway === null || !seat) return
    let timer: ReturnType<typeof setTimeout>
    const claim = () =>
      forfeit(id, other(seat)).catch(() => (timer = setTimeout(claim, 5000)))
    timer = setTimeout(
      claim,
      Math.max(0, opponentAway + FORFEIT_AFTER - serverNow()) + 1000,
    )
    return () => clearTimeout(timer)
  }, [inPlay, opponentAway, seat, id])

  const activity = `${game?.moves}|${game?.forfeit}|${game?.players.O}`
  useEffect(() => {
    if (idle) return
    const t = setTimeout(() => setIdle(true), IDLE_TIMEOUT)
    return () => clearTimeout(t)
  }, [activity, idle])

  const close = () => setOverlay(null)
  const menus = useGameMenus(setOverlay)
  const home = () => navigate('/')
  const share = () => shareLink(() => setCopied(true))

  const pauseEntries: MenuEntry[] = [
    { label: 'resume', onSelect: close },
    {
      label: copied ? 'link copied!' : 'share link',
      hint: 'SEND THIS GAME TO SOMEONE',
      onSelect: share,
    },
    {
      label: 'resign',
      hint: 'ENDS THE GAME · P2 WINS',
      disabled: !inPlay,
      onSelect: () => setOverlay('resign'),
    },
    {
      label: 'settings',
      hint: 'SOUND AND VIBRATION',
      onSelect: menus.openSettings,
    },
    { label: 'how to play', onSelect: () => setOverlay('help') },
    {
      label: 'main menu',
      hint: inPlay ? `P2 WINS IF YOU'RE GONE ${FORFEIT_AFTER / 1000}S` : '',
      onSelect: home,
    },
  ]
  const resignEntries: MenuEntry[] = [
    { label: 'no, keep playing', onSelect: close },
    {
      label: 'yes, resign',
      onSelect: () => {
        close()
        if (seat) forfeit(id, seat).catch(() => {})
      },
    },
  ]
  const pause = useMenu(pauseEntries, close)
  const resign = useMenu(resignEntries, () => setOverlay('pause'))
  useGameSounds(s, (game?.moves.length ?? 0) / 2, seat, { resetSound: true })
  const [startHint, dismissStartHint] = useOnceHint(
    'sttt:hint:start',
    8000,
    !!game?.players.O && !!seat,
  )

  if (!validId) return <Message title="GAME NOT FOUND" />
  if (denied)
    return (
      <Message title="GAME FULL">ONLY ITS TWO PLAYERS CAN OPEN IT.</Message>
    )
  if (game === undefined || !uid || !s) return <Message title="LOADING…" />
  if (game === null)
    return <Message title="GAME NOT FOUND">THE LINK MAY BE WRONG.</Message>

  if (!game.players.O) {
    if (!seat)
      return (
        <Message title={hostOnline ? 'JOINING…' : 'HOST IS AWAY'}>
          {!hostOnline && "YOU'LL JOIN WHEN THEY'RE BACK."}
        </Message>
      )
    return (
      <Device
        title="Online game"
        ledLabel="LINK"
        led={idle ? 'off' : 'on'}
        pad={{
          a: idle ? () => setIdle(false) : share,
          b: home,
          start: home,
          labels: {
            a: idle ? 'WAKE' : copied ? 'COPIED' : 'SHARE',
            b: 'LEAVE',
            start: 'MENU',
          },
        }}
      >
        <div className="land:gap-3 flex h-full flex-col items-center justify-center-safe gap-6 px-2 text-center">
          <div className="flex gap-3" aria-hidden="true">
            <Sprite p="X" className="text-lcd-3 size-9" />
            <Sprite p="O" className="animate-blink text-lcd-2 size-9" />
          </div>
          <p className="text-xs leading-relaxed">
            {idle ? 'SLEEP MODE' : 'WAITING FOR PLAYER 2'}
          </p>
          <p className="text-lcd-2 text-[8px] leading-loose">
            {idle
              ? `NO ACTIVITY FOR ${IDLE_TIMEOUT / 60_000} MIN. PRESS A TO KEEP WAITING.`
              : copied
                ? 'LINK COPIED. PASTE IT TO A FRIEND.'
                : 'PRESS A TO SHARE THE LINK. YOU ARE X.'}
          </p>
        </div>
      </Device>
    )
  }

  const byForfeit = !!game.forfeit && s.winner === other(game.forfeit)
  const loserLeft =
    byForfeit &&
    typeof game.presence?.[game.players[game.forfeit!]!] === 'number'
  const canRematch = !!seat && !!s.winner && !idle && opponentAway === null
  const round = `${game.first}|${game.moves}|${game.forfeit}`
  const bannerShown = !!s.winner && !idle && hiddenFor !== round
  const cursor = followPlay(s, rawCursor)
  const myTurn = inPlay && s.turn === seat

  const result =
    s.winner === 'draw'
      ? 'DRAW GAME'
      : s.winner === seat
        ? 'YOU WIN!'
        : byForfeit && !loserLeft
          ? 'YOU RESIGNED'
          : 'YOU LOSE'
  const resultHint = byForfeit
    ? loserLeft
      ? 'P2 LEFT THE GAME'
      : s.winner === seat
        ? 'P2 RESIGNED'
        : ''
    : ''

  let status
  if (idle) status = 'sleep mode · A to wake'
  else if (s.winner)
    status = canRematch ? 'game over · A for rematch' : 'game over'
  else if (!myTurn)
    status = (
      <>
        p2 thinking<span className="animate-blink">…</span>
      </>
    )
  else status = s.activeBoard === null ? 'your move · any board' : 'your move'

  const go = (dir: Dir) => () => {
    setShowCursor(true)
    setCursor(moveWithin(cursor, dir, s.winner ? null : s.activeBoard))
  }
  const place = (i: number) => {
    const board = Math.floor(i / 9)
    if (myTurn && canPlay(s, board, i % 9)) {
      haptic.place()
      sendMove(id, game, board, i % 9).catch(() => {})
    } else blocked()
  }
  function pressA() {
    if (idle) return setIdle(false)
    if (s!.winner) {
      if (canRematch) rematch(id, game!, s!.winner).catch(() => {})
      return
    }
    if (!showCursor) return setShowCursor(true)
    place(cursor)
  }

  const pads: Record<
    'game' | 'pause' | 'resign' | 'settings' | 'about' | 'help',
    Pad
  > = {
    game: {
      up: go('up'),
      down: go('down'),
      left: go('left'),
      right: go('right'),
      a: pressA,
      b: s.winner ? () => setHiddenFor(bannerShown ? round : null) : undefined,
      start: () => {
        sfx.select()
        dismissStartHint()
        pause.setSel(0)
        setOverlay('pause')
      },
      select: menus.openHelp,
      labels: {
        a: idle ? 'WAKE' : s.winner ? 'REMATCH' : 'PLACE',
        b: s.winner ? (bannerShown ? 'BOARD' : 'RESULT') : undefined,
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
    resign: {
      ...resign.pad,
      start: menus.closeOverlay,
      labels: { a: 'OK', b: 'BACK', start: 'RESUME' },
    },
    ...menus.pads,
  }

  const opp = seat ? other(seat) : 'O'

  return (
    <Device
      title="Online game"
      ledLabel="LINK"
      led={idle ? 'off' : inPlay && opponentAway !== null ? 'blink' : 'on'}
      pad={pads[overlay ?? 'game']}
      glow={startHint && !overlay ? 'start' : undefined}
    >
      <Hud
        items={[
          [`YOU ${seat ?? ''}`, game.score[seat ?? 'X']],
          [`P2 ${opp}`, game.score[opp]],
          ['DRAW', game.score.draw],
        ]}
      />
      <div className="relative">
        <Board
          state={s}
          locked={!myTurn}
          last={decodeMoves(game.moves).at(-1)}
          cursor={cursor}
          showCursor={showCursor && myTurn}
          onCursor={setCursor}
          onBlocked={blocked}
          onPlay={(b, c) => {
            setShowCursor(false)
            place(b * 9 + c)
          }}
        />
        {bannerShown && (
          <ResultBanner
            winner={s.winner!}
            title={result}
            hint={[
              resultHint,
              canRematch ? 'A: REMATCH · B: SEE BOARD' : 'B: SEE BOARD',
            ]
              .filter(Boolean)
              .join(' · ')}
            onDismiss={() => setHiddenFor(round)}
          />
        )}
        {inPlay && opponentAway !== null && !overlay ? (
          <ScreenChip>
            P2 LOST SIGNAL · YOU WIN IN {FORFEIT_AFTER / 1000}S IF THEY
            DON&apos;T RETURN
          </ScreenChip>
        ) : (
          startHint &&
          !bannerShown &&
          !overlay && <ScreenChip blink>PRESS START FOR MENU</ScreenChip>
        )}
      </div>
      <StatusLine
        icon={
          !s.winner &&
          !idle && <Sprite p={s.turn} className="size-3.5 shrink-0" />
        }
      >
        {status}
      </StatusLine>

      {overlay === 'pause' && (
        <ScreenOverlay title="PAUSED">
          <Menu label="Pause menu" entries={pauseEntries} {...pause} />
          <p className="text-lcd-2 text-center text-[7px]">
            THE GAME KEEPS RUNNING ONLINE
          </p>
        </ScreenOverlay>
      )}
      {overlay === 'resign' && (
        <ScreenOverlay title="RESIGN?">
          <Menu label="Confirm resign" entries={resignEntries} {...resign} />
        </ScreenOverlay>
      )}
      {menus.render(overlay)}
    </Device>
  )
}
