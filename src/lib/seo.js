// SEO Configuration and Utilities

export const siteConfig = {
  name: 'KarUCU Main Campus',
  title: 'Karatina University Christian Union',
  description: 'Join KarUCU Main Campus - Experience vibrant worship, Bible study, fellowship, and spiritual growth. Committed to serving the Lord and transforming campus life through Christ.',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002',
  ogImage: '/logo.png',
  links: {
    twitter: 'https://twitter.com/karucumain',
    facebook: 'https://facebook.com/karucumain',
    instagram: 'https://instagram.com/karucumain',
    youtube: 'https://www.youtube.com/@karucumain',
  },
}

export const generateMetadata = ({
  title,
  description,
  image = siteConfig.ogImage,
  url = '',
  type = 'website',
  keywords = [],
  noIndex = false,
}) => {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} - ${siteConfig.title}`
  const fullUrl = `${siteConfig.url}${url}`
  const fullDescription = description || siteConfig.description

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: [
      'Karatina University',
      'Christian Union',
      'KarUCU',
      'Campus Ministry',
      ...keywords
    ],
    openGraph: {
      type,
      url: fullUrl,
      title: fullTitle,
      description: fullDescription,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [image],
      creator: '@karucumain',
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
    },
  }
}

// Page-specific metadata configurations
export const pageMetadata = {
  home: {
    title: 'Home',
    description: 'Welcome to KarUCU Main Campus - Karatina University Christian Union. Join us for worship, Bible study, fellowship, and spiritual growth. Committed to serving the Lord on campus.',
    keywords: ['home', 'welcome', 'about us', 'campus ministry'],
  },
  about: {
    title: 'About Us',
    description: 'Learn about KarUCU Main Campus - our mission, vision, values, and commitment to serving the Lord at Karatina University. Discover our history and leadership.',
    keywords: ['about', 'mission', 'vision', 'values', 'leadership', 'history'],
  },
  events: {
    title: 'Events',
    description: 'Discover upcoming events at KarUCU Main Campus - conferences, retreats, worship nights, Bible studies, and fellowship gatherings. Join us for life-changing experiences.',
    keywords: ['events', 'conferences', 'retreats', 'worship nights', 'gatherings'],
  },
  sermons: {
    title: 'Sermons',
    description: 'Watch and listen to powerful sermons from KarUCU Main Campus. Biblical teaching, inspiring messages, and spiritual guidance for students and young adults.',
    keywords: ['sermons', 'preaching', 'messages', 'teaching', 'biblical'],
  },
  blog: {
    title: 'Blog',
    description: 'Read inspiring testimonies, faith stories, and spiritual insights from KarUCU Main Campus members. Share your journey and be encouraged by others.',
    keywords: ['blog', 'testimonies', 'stories', 'faith', 'inspiration'],
  },
  prayer: {
    title: 'Prayer Requests',
    description: 'Submit your prayer requests and pray for others at KarUCU Main Campus. Join our community in intercession and experience the power of united prayer.',
    keywords: ['prayer', 'intercession', 'prayer requests', 'spiritual support'],
  },
  bibleStudy: {
    title: 'Bible Study',
    description: 'Join KarUCU Main Campus Bible study groups. Grow in God\'s Word through interactive sessions, discussions, and fellowship with other believers.',
    keywords: ['bible study', 'scripture', 'discipleship', 'small groups'],
  },
  contact: {
    title: 'Contact Us',
    description: 'Get in touch with KarUCU Main Campus. Find our location, contact information, and connect with our leadership team. We\'d love to hear from you!',
    keywords: ['contact', 'location', 'reach us', 'get in touch'],
  },
  give: {
    title: 'Give',
    description: 'Support KarUCU Main Campus ministry through your generous giving. Help us reach more students with the Gospel and fund impactful events and programs.',
    keywords: ['giving', 'donate', 'support', 'contribute', 'offering'],
  },
  login: {
    title: 'Member Login',
    description: 'Login to your KarUCU Main Campus member account. Access your dashboard, prayer journal, Bible study materials, and connect with the community.',
    keywords: ['login', 'member area', 'sign in', 'account'],
    noIndex: true,
  },
  register: {
    title: 'Join Us',
    description: 'Register to become a member of KarUCU Main Campus. Join our vibrant Christian community at Karatina University and grow in your faith journey.',
    keywords: ['register', 'join', 'sign up', 'membership', 'become a member'],
  },
}

// JSON-LD Schema for structured data
export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  alternateName: 'KarUCU',
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  description: siteConfig.description,
  sameAs: [
    siteConfig.links.facebook,
    siteConfig.links.twitter,
    siteConfig.links.instagram,
    siteConfig.links.youtube,
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'General Inquiries',
    areaServed: 'KE',
    availableLanguage: ['English', 'Swahili'],
  },
})

export const generateEventSchema = (event) => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: event.title,
  description: event.description,
  startDate: event.start_date,
  endDate: event.end_date,
  location: {
    '@type': 'Place',
    name: event.location,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Karatina',
      addressCountry: 'KE',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
})

export const generateArticleSchema = (article) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.excerpt,
  image: article.featured_image,
  datePublished: article.published_at,
  dateModified: article.updated_at,
  author: {
    '@type': 'Person',
    name: article.author_name,
  },
  publisher: {
    '@type': 'Organization',
    name: siteConfig.name,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/logo.png`,
    },
  },
})
