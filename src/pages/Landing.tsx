import { Link } from 'react-router'

export default function Landing() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Landing</h1>
      <p>Coming soon</p>
      <Link to="/game" className="underline">
        Go to game
      </Link>
    </main>
  )
}
