export interface BlogPost {
  id: number
  title: string
  category: string
  readTime: string
  date: string
  author: string
  image: string
  description: string
  status: 'Published' | 'Draft'
  order: number
}

export const initialBlogsData: BlogPost[] = [
  {
    id: 1,
    title: 'Comprehensive Digital Solutions for Institutional Management',
    category: 'Blog',
    readTime: '20min read',
    date: 'November 30, 2023',
    author: 'DocMe Engineering',
    image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Comprehensive digital solutions designed to transform every aspect of institutional management and operational excellence.',
    status: 'Published',
    order: 1,
  },
  {
    id: 2,
    title: 'Modernizing Campus Operations: Automation & Real-Time Analytics',
    category: 'Blog',
    readTime: '15min read',
    date: 'November 24, 2023',
    author: 'DocMe Strategy',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'How modern educational institutions automate operations, enhance student tracking, and optimize resource distribution through connected digital platforms.',
    status: 'Published',
    order: 2,
  },
  {
    id: 3,
    title: 'The Future of Connected Enterprise Campus Ecosystems',
    category: 'Blog',
    readTime: '25min read',
    date: 'October 18, 2023',
    author: 'DocMe Leadership',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Unifying academics, administration, transport, finance, and parent communication into one secure, mission-critical cloud platform.',
    status: 'Published',
    order: 3,
  },
]
