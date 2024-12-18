-   for backend deployment: https://www.koyeb.com/
-   for frontend deployment: use vercel

# Backend Folder Structure

```
backend/
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.js
│   │   │   │   └── auth.validation.js
│   │   │   ├── game/
│   │   │   │   ├── game.controller.js
│   │   │   │   └── game.validation.js
│   │   │   └── user/
│   │   │       ├── user.controller.js
│   │   │       └── user.validation.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   ├── rateLimiter.middleware.js
│   │   │   └── validator.middleware.js
│   │   └── routes/
│   │       ├── auth.routes.js
│   │       ├── game.routes.js
│   │       ├── user.routes.js
│   │       └── index.js
│   ├── config/
│   │   ├── database.config.js
│   │   ├── redis.config.js
│   │   ├── socket.config.js
│   │   ├── mail.config.js
│   │   └── index.js
│   ├── database/
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   └── game.model.js
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── index.js
│   ├── game/
│   │   ├── services/
│   │   │   ├── matchmaking.service.js
│   │   │   ├── gameState.service.js
│   │   │   └── gameplay.service.js
│   │   ├── models/
│   │   │   └── gameState.model.js
│   │   ├── utils/
│   │   │   ├── gameLogic.utils.js
│   │   │   └── scoring.utils.js
│   │   └── constants/
│   │       └── game.constants.js
│   ├── socket/
│   │   ├── handlers/
│   │   │   ├── game.handler.js
│   │   │   ├── chat.handler.js
│   │   │   └── connection.handler.js
│   │   ├── middleware/
│   │   │   ├── auth.socket.js
│   │   │   └── rateLimiter.socket.js
│   │   ├── events/
│   │   │   ├── gameEvents.js
│   │   │   └── chatEvents.js
│   │   └── index.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── mail.service.js
│   │   └── cache.service.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── apiError.js
│   │   ├── asyncHandler.js
│   │   ├── validation.js
│   │   └── jwt.js
│   ├── cache/
│   │   ├── redis/
│   │   │   └── index.js
│   │   └── strategies/
│   │       └── redis.strategy.js
│   ├── loaders/
│   │   ├── express.js
│   │   ├── mongoose.js
│   │   ├── redis.js
│   │   ├── socket.js
│   │   └── index.js
│   ├── app.js
│   └── server.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── logs/
├── docs/
│   └── api/
├── scripts/
├── .env
├── .env.example
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── jest.config.js
├── package.json
└── README.md
```
