export interface ClientLogoItem {
  id: string
  name: string
  logo: string
  website?: string
  category?: string
  status: 'Published' | 'Draft'
  order: number
}

export const initialClientLogos: ClientLogoItem[] = [
  {
    id: 'logo-1',
    name: 'Docme Partner',
    logo: '/assets/companies/image 711.png',
    website: 'https://docme.ae',
    category: 'Healthcare & Enterprise',
    status: 'Published',
    order: 1,
  },
  {
    id: 'logo-2',
    name: 'Techno Alliance',
    logo: '/assets/companies/1.png',
    website: 'https://technoalliance.ae',
    category: 'Technology',
    status: 'Published',
    order: 2,
  },
  {
    id: 'logo-3',
    name: 'NIMS Group',
    logo: '/assets/companies/2.png',
    website: 'https://nimsgroup.com',
    category: 'Education',
    status: 'Published',
    order: 3,
  },
  {
    id: 'logo-4',
    name: 'Imprint Education',
    logo: '/assets/companies/3.png',
    website: '',
    category: 'Academic Network',
    status: 'Published',
    order: 4,
  },
  {
    id: 'logo-5',
    name: 'Golden Cosmos',
    logo: '/assets/companies/4.png',
    website: '',
    category: 'Enterprise',
    status: 'Published',
    order: 5,
  },
  {
    id: 'logo-6',
    name: 'Emke Group',
    logo: '/assets/companies/5.png',
    website: '',
    category: 'Retail & Commercial',
    status: 'Published',
    order: 6,
  },
  {
    id: 'logo-7',
    name: 'EduCraft Solutions',
    logo: '/assets/companies/7.png',
    website: '',
    category: 'EdTech',
    status: 'Published',
    order: 7,
  },
  {
    id: 'logo-8',
    name: 'Uni Design',
    logo: '/assets/companies/8.png',
    website: '',
    category: 'Design & Media',
    status: 'Published',
    order: 8,
  },
  {
    id: 'logo-9',
    name: 'Seed Global',
    logo: '/assets/companies/9.png',
    website: '',
    category: 'Foundation',
    status: 'Published',
    order: 9,
  },
  {
    id: 'logo-10',
    name: 'Loyaltri Network',
    logo: '/assets/companies/10.png',
    website: '',
    category: 'Corporate',
    status: 'Published',
    order: 10,
  },
]

export const availablePresetLogos = [
  { name: 'Docme Partner (image 711.png)', path: '/assets/companies/image 711.png' },
  { name: 'Partner Logo 1 (1.png)', path: '/assets/companies/1.png' },
  { name: 'Partner Logo 2 (2.png)', path: '/assets/companies/2.png' },
  { name: 'Partner Logo 3 (3.png)', path: '/assets/companies/3.png' },
  { name: 'Partner Logo 4 (4.png)', path: '/assets/companies/4.png' },
  { name: 'Partner Logo 5 (5.png)', path: '/assets/companies/5.png' },
  { name: 'Partner Logo 7 (7.png)', path: '/assets/companies/7.png' },
  { name: 'Partner Logo 8 (8.png)', path: '/assets/companies/8.png' },
  { name: 'Partner Logo 9 (9.png)', path: '/assets/companies/9.png' },
  { name: 'Partner Logo 10 (10.png)', path: '/assets/companies/10.png' },
]
