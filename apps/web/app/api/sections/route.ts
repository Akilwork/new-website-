import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { initialSectionsData, SectionItem } from '@/lib/sectionsData'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const getFilePath = () => {
  if (process.cwd().endsWith('web')) {
    return path.resolve(process.cwd(), 'public/data/sections.json')
  }
  return path.resolve(process.cwd(), 'apps/web/public/data/sections.json')
}

const getCmsFilePath = () => {
  if (process.cwd().endsWith('web')) {
    return path.resolve(process.cwd(), '../cms/public/data/sections.json')
  }
  return path.resolve(process.cwd(), 'apps/cms/public/data/sections.json')
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function GET() {
  try {
    const filePath = getFilePath()
    const content = await fs.readFile(filePath, 'utf-8')
    const savedSections: SectionItem[] = JSON.parse(content)
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
    return NextResponse.json(initialSectionsData, { headers: corsHeaders })
  } catch {
    return NextResponse.json(initialSectionsData, { headers: corsHeaders })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const filePath = getFilePath()
    let currentSections: SectionItem[] = initialSectionsData

    try {
      const content = await fs.readFile(filePath, 'utf-8')
      currentSections = JSON.parse(content)
    } catch {
      currentSections = initialSectionsData
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

    // Save to web public data
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, jsonString, 'utf-8')
    } catch (e) {
      console.error('Failed to write web sections.json:', e)
    }

    // Also sync to cms public data if available
    try {
      const cmsPath = getCmsFilePath()
      await fs.mkdir(path.dirname(cmsPath), { recursive: true })
      await fs.writeFile(cmsPath, jsonString, 'utf-8')
    } catch {
      // ignore
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
