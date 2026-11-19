import { PrismaClient, RoleType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding DocMe CMS database...')

  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: RoleType.ADMIN },
    update: {},
    create: {
      name: RoleType.ADMIN,
      description: 'Full administrative access to pages, sections, media, users, and audit logs',
    },
  })

  const contentManagerRole = await prisma.role.upsert({
    where: { name: RoleType.CONTENT_MANAGER },
    update: {},
    create: {
      name: RoleType.CONTENT_MANAGER,
      description: 'Manage website pages, edit section content, upload media, and submit drafts',
    },
  })

  console.log(`✅ Roles seeded: ${adminRole.name}, ${contentManagerRole.name}`)

  // Initial seed for public website pages
  const homePage = await prisma.page.upsert({
    where: { slug: '/' },
    update: {},
    create: {
      slug: '/',
      title: 'Home',
      description: 'DocMe Corporate Homepage',
      isPublished: true,
      sections: {
        create: [
          {
            key: 'hero',
            name: 'Hero Section',
            type: 'HERO_BANNER',
            order: 1,
            content: {
              headline: 'Empowering Education with Intelligent ERP Systems',
              subheadline: 'Next-generation campus operations and school management platforms',
            },
          },
          {
            key: 'stats',
            name: 'About Stats Section',
            type: 'METRICS_GRID',
            order: 2,
            content: {
              stats: [
                { value: 2950, suffix: '+', label: 'Active Member' },
                { value: 25, suffix: '+', label: 'Years of Experience' },
                { value: 2, suffix: '', label: 'Branch Location' },
              ],
            },
          },
        ],
      },
    },
  })

  console.log(`✅ Default page seeded: ${homePage.title} (${homePage.slug})`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
