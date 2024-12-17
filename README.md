# Super Tic Tac Toe

```
super-tictactoe/
├── frontend/          # Next.js application
│   ├── app/
│   │   ├── page.tsx              # Landing page (/)
│   │   ├── layout.tsx            # Root layout
│   │   └── game/                 # Game routes
│   │       ├── layout.tsx        # Shared game layout (nav, settings button etc)
│   │       ├── page.tsx          # Offline game page (/game)
│   │       └── [gameId]/         # Dynamic route for online games
│   │           └── page.tsx      # Online game page (/game/abc123)
│   │
│   ├── components/
│   │   ├── landing/              # Landing page components
│   │   │   ├── Hero.tsx         # Main hero section with title and auth buttons
│   │   │   ├── Features.tsx     # Game features/rules section
│   │   │   ├── AuthModal.tsx    # Modal containing both login/register forms
│   │   │   └── Footer.tsx       # Landing page footer
│   │   │
│   │   ├── game/                # Core game components
│   │   │   ├── Board/           # Main game board components
│   │   │   │   ├── index.tsx    # Main board wrapper
│   │   │   │   ├── SubBoard.tsx # Individual 3x3 board
│   │   │   │   └── Cell.tsx     # Individual cell
│   │   │   ├── PlayerInfo.tsx   # Shows current player & symbols
│   │   │   └── GameStatus.tsx   # Game state, winner, etc.
│   │   │
│   │   ├── layout/              # Layout components
│   │   │   ├── GameNav.tsx      # Navigation for game pages
│   │   │   └── UserMenu.tsx     # User profile/logout dropdown
│   │   │
│   │   ├── modals/              # Game-related modals
│   │   │   ├── SettingsModal/   # Settings popup
│   │   │   │   ├── index.tsx
│   │   │   │   ├── Profile.tsx  # Profile section
│   │   │   │   └── HowToPlay.tsx # Rules section
│   │   │   └── ShareGameModal.tsx # For sharing game link
│   │   │
│   │   └── ui/                  # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       └── Icons.tsx
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useGame.ts          # Game state & logic
│   │   ├── useOnlineGame.ts    # Online game specific logic
│   │   └── useSocket.ts        # WebSocket connection
│   │
│   ├── lib/                    # Utility functions & configs
│   │   ├── auth.ts            # Auth0 configuration
│   │   ├── socket.ts          # WebSocket client setup
│   │   └── gameUtils.ts       # Game helper functions
│   │
│   └── types/                  # TypeScript type definitions
│       ├── game.ts            # Game-related types
│       └── socket.ts          # WebSocket event types
│
└── backend/                    # Backend application
    ├── src/
    │   ├── server.ts          # Main server file
    │   │
    │   ├── game/              # Game logic
    │   │   ├── Game.ts        # Game class with core logic
    │   │   ├── Board.ts       # Board state management
    │   │   └── utils.ts       # Game utility functions
    │   │
    │   ├── socket/            # WebSocket handling
    │   │   ├── handlers/      # WebSocket event handlers
    │   │   │   ├── game.ts    # Game-related events
    │   │   │   └── connection.ts # Connection events
    │   │   └── events.ts      # Event type definitions
    │   │
    │   ├── auth/              # Authentication
    │   │   └── auth0.ts       # Auth0 configuration
    │   │
    │   └── types/             # Shared TypeScript types
    │       └── index.ts
    │
    └── tests/                 # Backend tests
        ├── game.test.ts
        └── socket.test.ts
```
