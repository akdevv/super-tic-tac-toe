# Super Tic-Tac-Toe

Nine tic-tac-toe boards in one. Play locally on one screen, or online with a friend via a share link.

Stack: Vite + React + TypeScript + Tailwind, Firebase Realtime Database for online play, hosted on Vercel. No backend server.

## Project structure

```
src/
  main.tsx              entry + routes
  pages/                one component per route: Landing, Game (local/bot), OnlineGame
  components/           shared UI (Board)
  game/                 pure game logic, no React or Firebase
    engine.ts           rules: newGame, canPlay, play, replay
    bot.ts              MCTS bot; bot.worker.ts runs it off the main thread
    localGame.ts        local/bot game reducer + saving to browser storage
  online/
    core.ts             pure online helpers: game ids, stored game shape, state
    firebase.ts         Firebase connection, auth, reads/writes
tests/
  unit/                 mirrors src/, runs with `pnpm test`
  rules/                database.rules.json tests, need the emulator
database.rules.json     Firebase security rules (turns, seats, forfeits)
old-code/               previous Next.js/Express version, reference only
```

Anything in `game/` and `online/core.ts` stays free of browser and Firebase APIs so it runs in Node tests directly.

## Development

```sh
pnpm install
pnpm emulators   # local Firebase (auth + database), needs Java 21+
pnpm dev         # in a second terminal
```

With no Firebase config in `.env.local`, dev mode talks to the local emulator, so no Firebase account is needed. To play online against yourself, open the invite link in an incognito window.

If your default Java is older than 21 (macOS + Homebrew):

```sh
JAVA_HOME=$(/usr/libexec/java_home -v 26) pnpm emulators
```

| Script            | What it does                                             |
| ----------------- | -------------------------------------------------------- |
| `pnpm test`       | Game rules tests                                         |
| `pnpm test:rules` | Database security rules tests (emulator must be running) |
| `pnpm lint`       | ESLint                                                   |
| `pnpm format`     | Prettier                                                 |
| `pnpm build`      | Type-check and production build                          |

## Firebase setup (one time, for production)

1. Go to https://console.firebase.google.com and **create a project**. Google Analytics is not needed.
2. **Realtime Database:** Build → Realtime Database → Create database. Pick a location close to your players and start in **locked mode**. The real rules get deployed in step 6.
3. **Anonymous sign-in:** Build → Authentication → Get started → Sign-in method → **Anonymous** → Enable.
4. **Web app config:** Project settings (gear icon) → General → Your apps → add a **Web** app (no hosting needed). Copy the config values.
5. **Env file:** copy `.env.example` to `.env.local` and fill it in:

   | Variable                     | From the config |
   | ---------------------------- | --------------- |
   | `VITE_FIREBASE_API_KEY`      | `apiKey`        |
   | `VITE_FIREBASE_AUTH_DOMAIN`  | `authDomain`    |
   | `VITE_FIREBASE_DATABASE_URL` | `databaseURL`   |
   | `VITE_FIREBASE_PROJECT_ID`   | `projectId`     |
   | `VITE_FIREBASE_APP_ID`       | `appId`         |

   If `databaseURL` is missing from the config, copy it from the top of the Realtime Database page.

6. **Deploy the security rules** (`database.rules.json`):

   ```sh
   pnpm dlx firebase-tools login
   pnpm dlx firebase-tools deploy --only database --project <your-project-id>
   ```

   Run step 6 again whenever `database.rules.json` changes.

Once `.env.local` is filled in, `pnpm dev` uses the real project instead of the emulator. These web config values are public by design; the security rules are what protect the data.

## Deploy to Vercel

1. Import the repo on https://vercel.com. It detects Vite automatically (build: `pnpm build`, output: `dist`).
2. Settings → Environment Variables: add the same five `VITE_FIREBASE_*` values.
3. Deploy. `vercel.json` routes every path to the app, so invite links like `/game/abc123` work on reload.

If online games fail on the deployed site with an auth error, add your Vercel domain under Firebase → Authentication → Settings → Authorized domains.
