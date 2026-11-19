export interface GalleryItem {
  id: number
  title: string
  location: string
  country: string
  image: string
  description: string
  status: 'Published' | 'Draft'
  order: number
}

export interface GallerySectionConfig {
  sectionTitle: string
  heading: string
  description: string
  badgeText: string
  status: 'Published' | 'Draft'
  lastModified: string
  pageSlug: string
}

export const initialGallerySectionConfig: GallerySectionConfig = {
  sectionTitle: 'About Page Visual Media Gallery',
  heading: 'Spaces Powered by DocMe',
  description: 'An iconic collection of destinations, campuses, and natural wonders rendered in high-resolution interactive lightboxes on the About page.',
  badgeText: 'Curated Destinations',
  status: 'Published',
  lastModified: '2026-10-16',
  pageSlug: '/about#gallery',
}

export const initialGalleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'Lions Binkert Trial',
    location: 'Vancouver BC',
    country: 'Canada',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85',
    description: 'An iconic alpine trek with breathtaking summit views overlooking British Columbia panoramic fjords and majestic peaks.',
    status: 'Published',
    order: 1,
  },
  {
    id: 2,
    title: 'Pragser Wildsee',
    location: 'Italy',
    country: 'Dolomites',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85',
    description: 'The emerald jewel of the Dolomites, surrounded by towering pine forests and traditional wooden rowboats reflecting crystal clear waters.',
    status: 'Published',
    order: 2,
  },
  {
    id: 3,
    title: 'Iguazu Falls',
    location: 'Argentina',
    country: 'South America',
    image: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1400&q=85',
    description: 'One of the wonders of the natural world, cascading thunderously through lush subtropical rainforests with perpetual rainbow mists.',
    status: 'Published',
    order: 3,
  },
  {
    id: 4,
    title: 'Multnomah Falls',
    location: 'Portland',
    country: 'Oregon, USA',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1400&q=85',
    description: 'A 620-foot roaring double-tier cascade framed by the historic stone Benson Bridge in the scenic Columbia River Gorge.',
    status: 'Published',
    order: 4,
  },
  {
    id: 5,
    title: 'Mount Fuji',
    location: 'Honshu',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1400&q=85',
    description: 'The revered sacred volcano of Japan, mirrored across mist-shrouded lakes and surrounded by tranquil autumn landscapes.',
    status: 'Published',
    order: 5,
  },
  {
    id: 6,
    title: 'Moraine Lake',
    location: 'Banff National Park',
    country: 'Canada',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85',
    description: 'Glacial-fed sapphire waters set against the dramatic amphitheatre of the Valley of the Ten Peaks in the Canadian Rockies.',
    status: 'Published',
    order: 6,
  },
  {
    id: 7,
    title: 'Lofoten Archipelago',
    location: 'Nordland',
    country: 'Norway',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1400&q=85',
    description: 'Dramatically steep peaks piercing the Norwegian Sea, dotted with crimson rorbuer fishermen huts and Arctic auroras.',
    status: 'Published',
    order: 7,
  },
  {
    id: 8,
    title: 'Hallstatt Lakeside',
    location: 'Salzkammergut',
    country: 'Austria',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1400&q=85',
    description: 'A storybook 16th-century Alpine hamlet nestled peacefully between sheer limestone cliffs and glassy lake waters.',
    status: 'Published',
    order: 8,
  },
]
