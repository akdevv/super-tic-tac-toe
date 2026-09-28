import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import '@fontsource/press-start-2p/latin-400.css'
import '@fontsource/saira/latin-600-italic.css'
import '@fontsource/saira/latin-800-italic.css'
import './index.css'
import Game from './pages/Game.tsx'
import Landing from './pages/Landing.tsx'
import NotFound from './pages/NotFound.tsx'

const OnlineGame = lazy(() => import('./pages/OnlineGame.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/game" element={<Game />} />
          <Route path="/game/:id" element={<OnlineGame />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
