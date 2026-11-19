import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { initialSectionsData, SectionItem } from '@/lib/sectionsData'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const getWebFilePath = () => {
  if (process.cwd().endsWith('cms') || process.cwd().endsWith('web')) {
    return path.resolve(process.cwd(), '../web/public/data/sections.json')
  }
  return path.resolve(process.cwd(), 'apps/web/public/data/sections.json')
}

const getLocalFilePath = () => {
  if (process.cwd().endsWith('cms')) {
    return path.resolve(process.cwd(), 'public/data/sections.json')
  }
  return path.resolve(process.cwd(), 'apps/cms/public/data/sections.json')
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function GET() {
  try {
    let rawContent: string | null = null
    try {
      const webPath = getWebFilePath()
      rawContent = await fs.readFile(webPath, 'utf-8')
    } catch {
      const localPath = getLocalFilePath()
      rawContent = await fs.readFile(localPath, 'utf-8')
    }

    if (rawContent) {
      const savedSections: SectionItem[] = JSON.parse(rawContent)
      if (Array.isArray(savedSections) && savedSections.length > 0) {
        const merged = initialSectionsData.map((init) => {
          const found = savedSections.find((s) => s.id === init.id)
          return found ? { ...init, ...found } : init
        })
        const custom = savedSections.filter(
          (s) => !initialSectionsData.some((init) => init.id === s.id)
        )
        return NextResponse.json([...merged, ...custom], { headers: corsHeaders })
      }
    }
    return NextResponse.json(initialSectionsData, { headers: corsHeaders })
  } catch {
    return NextResponse.json(initialSectionsData, { headers: corsHeaders })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const webPath = getWebFilePath()
    const localPath = getLocalFilePath()
    let currentSections: SectionItem[] = initialSectionsData

    try {
      const content = await fs.readFile(webPath, 'utf-8')
      currentSections = JSON.parse(content)
    } catch {
      try {
        const content = await fs.readFile(localPath, 'utf-8')
        currentSections = JSON.parse(content)
      } catch {
        currentSections = initialSectionsData
      }
    }

    let updatedList: SectionItem[]

    if (Array.isArray(body)) {
      updatedList = body
    } else {
      const itemToUpdate = body.updated || body
      const exists = currentSections.some((s) => s.id === itemToUpdate.id)
      if (exists) {
        updatedList = currentSections.map((s) =>
          s.id === itemToUpdate.id ? { ...s, ...itemToUpdate } : s
        )
      } else {
        updatedList = [itemToUpdate, ...currentSections]
      }
    }

    const jsonString = JSON.stringify(updatedList, null, 2)

    // Write to web public data
    try {
      await fs.mkdir(path.dirname(webPath), { recursive: true })
      await fs.writeFile(webPath, jsonString, 'utf-8')
    } catch (e) {
      console.error('Failed to write web sections.json:', e)
    }

    // Write to cms local public data
    try {
      await fs.mkdir(path.dirname(localPath), { recursive: true })
      await fs.writeFile(localPath, jsonString, 'utf-8')
    } catch (e) {
      console.error('Failed to write cms sections.json:', e)
    }

    return NextResponse.json(
      { success: true, sections: updatedList },
      { headers: corsHeaders }
    )
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to save section' },
      { status: 500, headers: corsHeaders }
    )
  }
}
