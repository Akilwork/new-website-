export interface ProgrammeItem {
  id: string
  slug: string
  aliases?: string[]
  levelBadge: string
  title: string
  duration: string
  weeks: string
  fee: string
  highlight: string
  summary: string
  topics: string[]
  modules: {
    number: string
    title: string
    description: string
    skills: string[]
  }[]
  capstone: {
    title: string
    description: string
  }
  roles: string[]
}

export const programmesData: ProgrammeItem[] = [
  {
    id: 'level-1',
    slug: 'full-stack-development-qa-it-operations',
    aliases: ['level-1', 'fullstack-qa'],
    levelBadge: 'LEVEL 1',
    title: 'Full-Stack Development, QA & IT Operations',
    duration: '6 months',
    weeks: '24 weeks',
    fee: '₹60,000',
    highlight: 'Comprehensive foundation to production deployment',
    summary:
      'Engineered for aspiring software engineers, college students, and freshers seeking industry-grade competence. Build end-to-end full-stack applications with modern Next.js, Node.js, automated QA testing, and resilient IT operations.',
    topics: [
      'Modern Frontend Architecture (React, Next.js, TypeScript)',
      'Backend & API Engineering (Node.js, Express, REST APIs)',
      'Database Modeling & Queries (PostgreSQL, MongoDB)',
      'Automated Quality Assurance & Testing Frameworks',
      'Git Workflows, Docker & Linux IT Operations',
    ],
    modules: [
      {
        number: '01',
        title: 'Modern Web Fundamentals & TypeScript',
        description:
          'Deep dive into modern JavaScript (ESNext), strict TypeScript typing, responsive layouts with HTML5 & modern CSS, and component design patterns.',
        skills: ['HTML5 & Semantic Web', 'TypeScript Strict Mode', 'Component Architecture', 'Tailwind CSS'],
      },
      {
        number: '02',
        title: 'Full-Stack React & Next.js Systems',
        description:
          'Learn to build high-performance web applications using Next.js App Router, React Server Components, state management, and real-time client interactions.',
        skills: ['Next.js 15 App Router', 'Server Components & Actions', 'State Modeling', 'Form Validation & UX'],
      },
      {
        number: '03',
        title: 'Scalable APIs & Database Engineering',
        description:
          'Master relational and NoSQL database modeling with PostgreSQL and MongoDB. Architect clean RESTful APIs, JWT authentication, and data validation.',
        skills: ['Node.js & Express', 'PostgreSQL & Prisma/Drizzle', 'MongoDB Aggregations', 'JWT & RBAC Security'],
      },
      {
        number: '04',
        title: 'QA Testing Automation & IT Operations',
        description:
          'Implement automated unit and end-to-end testing suits. Containerize applications using Docker and set up automated CI/CD deployment pipelines.',
        skills: ['Jest & Playwright Testing', 'Docker Containerization', 'GitHub Actions CI/CD', 'Linux & Server Ops'],
      },
    ],
    capstone: {
      title: 'DocMe Enterprise Student & Operations Portal',
      description:
        'A full-scale, multi-tenant academic and operations portal featuring authentication, grade records, automated fee invoices, database indexing, and automated testing suites.',
    },
    roles: [
      'Full-Stack Developer',
      'Frontend React Engineer',
      'Backend Node.js Developer',
      'QA & Automation Engineer',
      'Junior IT Operations Associate',
    ],
  },
  {
    id: 'level-2',
    slug: 'advanced-software-industry-professional',
    aliases: ['level-2', 'advanced-software'],
    levelBadge: 'LEVEL 2',
    title: 'Advanced Software & Industry Professional',
    duration: '6 months',
    weeks: '24 weeks',
    fee: '₹40,000',
    highlight: 'Enterprise architecture, cloud scalability & agile leadership',
    summary:
      'Tailored for learners and graduates who want to advance into high-scale software engineering. Master microservices, cloud infrastructure, system design, agile collaboration with Jira, and live enterprise capstone projects.',
    topics: [
      'Distributed Systems & Enterprise Architecture',
      'Cloud Infrastructure & Container Orchestration (AWS/Docker)',
      'System Design, Database Sharding & Caching (Redis/Postgres)',
      'Agile Sprint Management, Jira & Business Analysis',
      'Production Code Auditing & Performance Optimization',
    ],
    modules: [
      {
        number: '01',
        title: 'Enterprise Architecture & Microservices',
        description:
          'Learn how enterprise software scales across distributed teams. Study microservices boundaries, domain-driven design, and event-driven patterns.',
        skills: ['Microservices Patterns', 'Domain-Driven Design (DDD)', 'Event Streaming (Kafka/RabbitMQ)', 'API Gateways'],
      },
      {
        number: '02',
        title: 'Cloud Infrastructure & High-Availability Ops',
        description:
          'Deploy, monitor, and scale workloads on cloud environments with Docker, serverless patterns, and automated infrastructure.',
        skills: ['Cloud Architectures (AWS/GCP)', 'Container Orchestration', 'Reverse Proxies & Nginx', 'Observability & Logs'],
      },
      {
        number: '03',
        title: 'Database Optimization & Distributed Caching',
        description:
          'Handle high concurrency and huge volumes of data. Master PostgreSQL index optimization, Redis caching strategies, and data consistency models.',
        skills: ['PostgreSQL Advanced Indexing', 'Redis Caching & Pub/Sub', 'Database Partitioning', 'ACID Transactions'],
      },
      {
        number: '04',
        title: 'Industry Agile Delivery, Jira & Leadership',
        description:
          'Work inside simulated engineering sprints modeled on DocMe enterprise software teams. Use Jira for issue tracking, run sprint retrospectives, and lead code reviews.',
        skills: ['Jira Software & Sprints', 'Business Analysis Contracts', 'Peer Code Reviews', 'Technical Documentation'],
      },
    ],
    capstone: {
      title: 'High-Concurrency Distributed Billing & Analytics Engine',
      description:
        'An enterprise-grade financial transaction engine processing concurrent payment webhooks, generating ledger audits, and serving real-time analytics dashboards.',
    },
    roles: [
      'Software Engineer (SDE II)',
      'Enterprise Systems Consultant',
      'Cloud & DevOps Engineer',
      'Technical Business Analyst',
      'Associate Systems Architect',
    ],
  },
]

export function getProgrammeBySlug(slug: string): ProgrammeItem | undefined {
  const normalized = slug.toLowerCase().trim()
  return programmesData.find(
    (p) =>
      p.slug === normalized ||
      p.id === normalized ||
      p.aliases?.some((a) => a.toLowerCase() === normalized)
  )
}

