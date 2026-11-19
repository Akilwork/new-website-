import { createApp } from './app.js'
import { config } from './config/index.js'

const app = createApp()

const server = app.listen(config.port, () => {
  console.log(`🚀 DocMe CMS API Server running at http://localhost:${config.port}`)
  console.log(`📡 API Version 1 prefix: ${config.apiPrefix}`)
  console.log(`🩺 Health check: http://localhost:${config.port}${config.apiPrefix}/health`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})
