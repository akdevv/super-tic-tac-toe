import { useState } from 'react'
import { useNavigate } from 'react-router'
import Device, { type Pad } from '../components/Device.tsx'
import { LogoLockup } from '../components/Logo.tsx'
import { Menu, Slot } from '../components/Menu.tsx'
import { useSettingsMenu } from '../hooks/useSettingsMenu.tsx'
import { useAboutMenu } from '../hooks/useAboutMenu.ts'
import About from '../components/About.tsx'
import { useMenu, type MenuEntry } from '../hooks/useMenu.ts'
import Rules from '../components/Rules.tsx'
import { useRules } from '../hooks/useRules.ts'
import { LEVELS, type Level } from '../game/bot.ts'
import { other, type Player } from '../game/engine.ts'

const LEVEL_NAMES = Object.keys(LEVELS) as Level[]

type Screen = 'main' | 'cpu' | 'settings' | 'about' | 'rules'

export default function Landing() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState<Screen>('main')
  const [level, setLevel] = useState<Level>('medium')
  const [side, setSide] = useState<Player>('X')
  const [online, setOnline] = useState<'idle' | 'connecting' | 'error'>('idle')

  async function playOnline() {
    setOnline('connecting')
    try {
      const { createGame } = await import('../online/firebase.ts')
      navigate(`/game/${await createGame()}`)
    } catch (e) {
      console.error(e)
      setOnline('error')
    }
  }

  const cycleLevel = (step: number) =>
    setLevel(
      LEVEL_NAMES[
        (LEVEL_NAMES.indexOf(level) + step + LEVEL_NAMES.length) %
          LEVEL_NAMES.length
      ],
    )
  const flipSide = () => setSide(other(side))
  const startCpu = () => navigate(`/game?bot=${level}&me=${side}`)
  const back = () => setScreen('main')

  const mainEntries: MenuEntry[] = [
    {
      label: '2 players',
      hint: 'PASS AND PLAY ON ONE SCREEN',
      onSelect: () => navigate('/game'),
    },
    {
      label: 'vs CPU',
      hint: 'PLAY AGAINST THE COMPUTER',
      onSelect: () => setScreen('cpu'),
    },
    {
      label: online === 'connecting' ? 'connecting…' : 'online',
      hint:
        online === 'error'
          ? 'NO SIGNAL. TRY AGAIN.'
          : 'INVITE A FRIEND WITH A LINK',
      disabled: online === 'connecting',
      onSelect: playOnline,
    },
    {
      label: 'settings',
      hint: 'SOUND AND VIBRATION',
      onSelect: () => setScreen('settings'),
    },
    {
      label: 'how to play',
      hint: 'THE RULES IN 30 SECONDS',
      onSelect: () => setScreen('rules'),
    },
  ]
  const cpuEntries: MenuEntry[] = [
    {
      label: (
        <>
          level&nbsp;&nbsp;‹<Slot chars={6}>{level}</Slot>›
        </>
      ),
      hint: '◀ ▶ TO CHANGE',
      onSelect: () => cycleLevel(1),
      onLeft: () => cycleLevel(-1),
      onRight: () => cycleLevel(1),
    },
    {
      label: (
        <>
          play as&nbsp;&nbsp;‹<Slot chars={3}>{side}</Slot>›
        </>
      ),
      hint: 'X MOVES FIRST',
      onSelect: flipSide,
      onLeft: flipSide,
      onRight: flipSide,
    },
    {
      label: 'start',
      hint: `${level.toUpperCase()} CPU · YOU ARE ${side}`,
      onSelect: startCpu,
    },
    { label: 'back', onSelect: back },
  ]

  const main = useMenu(mainEntries)
  const rules = useRules(back)
  const cpu = useMenu(cpuEntries, back)
  const about = useAboutMenu(() => setScreen('settings'))
  const settings = useSettingsMenu(back, () => {
    about.setSel(0)
    setScreen('about')
  })

  const pads: Record<Screen, Pad> = {
    main: {
      ...main.pad,
      start: main.pad.a,
      select: () => setScreen('rules'),
      labels: { a: 'OK', start: 'START', select: 'HELP' },
    },
    cpu: {
      ...cpu.pad,
      start: startCpu,
      select: () => setScreen('rules'),
      labels: { a: 'OK', b: 'BACK', start: 'PLAY', select: 'HELP' },
    },
    settings: {
      ...settings.pad,
      start: back,
      select: () => setScreen('rules'),
      labels: { a: 'OK', b: 'BACK', start: 'MENU', select: 'HELP' },
    },
    about: {
      ...about.pad,
      start: back,
      labels: { a: 'OK', b: 'BACK', start: 'MENU' },
    },
    rules: rules.pad,
  }

  return (
    <Device pad={pads[screen]}>
      {screen === 'about' ? (
        <About {...about} />
      ) : screen === 'rules' ? (
        <Rules page={rules.page} setPage={rules.setPage} onDone={rules.done} />
      ) : (
        <div className="land:gap-3 flex h-full flex-col justify-center-safe gap-4 sm:gap-5 @max-[18rem]:gap-2.5">
          <LogoLockup />
          {screen === 'main' && (
            <Menu label="Main menu" entries={mainEntries} {...main} />
          )}
          {screen === 'cpu' && (
            <Menu label="Play vs CPU" entries={cpuEntries} {...cpu} />
          )}
          {screen === 'settings' && <Menu label="Settings" {...settings} />}
        </div>
      )}
    </Device>
  )
}
