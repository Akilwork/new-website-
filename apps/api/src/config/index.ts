import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3002',
  cmsUrl: process.env.CMS_URL || 'http://localhost:3003',
  sessionSecret: process.env.SESSION_SECRET || 'docme-dev-session-secret-change-in-production',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/docme_cms?schema=public',
  apiPrefix: '/api/v1',
}
