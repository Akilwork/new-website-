import express, { Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { config } from './config/index.js'
import { apiV1Router } from './routes/index.js'
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js'

export function createApp(): Express {
  const app = express()

  // Security & Utility Middlewares
  app.use(helmet())
  app.use(
    cors({
      origin: [
        config.clientUrl,
        config.cmsUrl,
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
      ],
      credentials: true,
    })
  )
  app.use(morgan(config.env === 'production' ? 'combined' : 'dev'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())

  // Session-based authentication
  app.use(
    session({
      name: 'docme_sid',
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      },
    })
  )

  // API v1 Routing
  app.use(config.apiPrefix, apiV1Router)

  // Root welcome
  app.get('/', (_req, res) => {
    res.json({
      name: 'DocMe CMS API',
      documentation: '/docs/cms-api.md',
      endpoints: `${config.apiPrefix}/health`,
    })
  })

  // Error Handling
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
