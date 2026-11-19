import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400, headers: corsHeaders })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Clean filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${Date.now()}-${safeName}`

    // Robust monorepo root detection
    const normCwd = process.cwd().replace(/\\/g, '/')
    const isUnderApps = normCwd.endsWith('/cms') || normCwd.endsWith('/web') || normCwd.endsWith('/api')
    const monorepoRoot = isUnderApps
      ? path.resolve(process.cwd(), '../..')
      : path.resolve(process.cwd())

    // Target upload directories in both CMS and Web
    const cmsUploadsDir = path.resolve(monorepoRoot, 'apps/cms/public/uploads')
    const webUploadsDir = path.resolve(monorepoRoot, 'apps/web/public/uploads')

    await fs.mkdir(cmsUploadsDir, { recursive: true }).catch(() => {})
    await fs.mkdir(webUploadsDir, { recursive: true }).catch(() => {})

    const cmsPath = path.join(cmsUploadsDir, filename)
    const webPath = path.join(webUploadsDir, filename)

    // Write to both CMS and Web public folders simultaneously
    await Promise.allSettled([
      fs.writeFile(cmsPath, buffer),
      fs.writeFile(webPath, buffer),
    ])

    const publicUrl = `/uploads/${filename}`

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to upload file' },
      { status: 500, headers: corsHeaders }
    )
  }
}
