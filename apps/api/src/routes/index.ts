import { Router } from 'express'
import { authRouter } from '../modules/auth/auth.routes.js'
import { usersRouter } from '../modules/users/users.routes.js'
import { pagesRouter } from '../modules/pages/pages.routes.js'
import { sectionsRouter } from '../modules/sections/sections.routes.js'
import { mediaRouter } from '../modules/media/media.routes.js'
import { publishingRouter } from '../modules/publishing/publishing.routes.js'

export const apiV1Router = Router()

// Health check
apiV1Router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'DocMe CMS Backend API',
    version: '1.0.0',
  })
})

// Submodule routes
apiV1Router.use('/auth', authRouter)
apiV1Router.use('/users', usersRouter)
apiV1Router.use('/pages', pagesRouter)
apiV1Router.use('/sections', sectionsRouter)
apiV1Router.use('/media', mediaRouter)
apiV1Router.use('/publishing', publishingRouter)
