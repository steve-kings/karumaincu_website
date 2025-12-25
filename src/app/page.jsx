import HomeClient from './HomeClient'

// Server-side metadata for SEO
export const metadata = {
  title: 'KarUCU Main Campus - Karatina University Christian Union',
  description: 'Welcome to Karatina University Christian Union Main Campus. Join our vibrant Christian community for worship, Bible study, fellowship, and spiritual growth. Committed to serving the Lord and transforming campus life through Christ.',
  keywords: 'Karatina University, Christian Union, KarUCU, Campus Ministry, Student Fellowship, Bible Study, Worship, Prayer, Kenya',
  openGraph: {
    title: 'KarUCU Main Campus - Karatina University Christian Union',
    description: 'Join our vibrant Christian community for worship, Bible study, fellowship, and spiritual growth.',
    url: 'https://karumaincu.org',
    siteName: 'KarUCU Main Campus',
    images: [
      {
        url: 'https://karumaincu.org/logo.png',
        width: 1200,
        height: 630,
        alt: 'KarUCU Main Campus',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KarUCU Main Campus - Karatina University Christian Union',
    description: 'Join our vibrant Christian community for worship, Bible study, fellowship, and spiritual growth.',
    images: ['https://karumaincu.org/logo.png'],
  },
  alternates: {
    canonical: 'https://karumaincu.org',
  },
}

// Server Component wrapper for SEO
export default function HomePage() {
  return (
    <>
      {/* Hidden SEO content for crawlers */}
      <div className="sr-only">
        <h1>KarUCU Main Campus - Karatina University Christian Union</h1>
        <p>Welcome to Karatina University Christian Union Main Campus. We are committed to serving the Lord and transforming campus life through Christ.</p>
        <h2>Our Mission</h2>
        <p>To evangelize, disciple, and nurture university students in Christian faith, while promoting academic excellence, moral integrity, and service to God and humanity.</p>
        <h2>Our Ministries</h2>
        <ul>
          <li>Prayer Ministry - Interceding for our community and campus</li>
          <li>Music Ministry - Praise, Worship, and Choir</li>
          <li>Bible Study - Deepening spiritual life through Scripture</li>
          <li>Evangelism - Witnessing Christ on campus and beyond</li>
          <li>Fellowship Groups - Building Christian relationships</li>
        </ul>
        <h2>Join Us</h2>
        <p>Whether you're a new student or have been at Karatina University for a while, you're welcome to join our fellowship.</p>
      </div>
      
      {/* Client-side interactive content */}
      <HomeClient />
    </>
  )
}
