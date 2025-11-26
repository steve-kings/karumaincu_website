'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function HomeClient({ events }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentValueSlide, setCurrentValueSlide] = useState(0)
  const [currentMinistrySlide, setCurrentMinistrySlide] = useState(0)

  // Image URLs configuration
  const imageUrls = {
    hero: {
      slide1: "/hero-1.jpg",
      slide2: "/hero-2.jpg",
      slide3: "/hero-3.jpg",
      slide4: "/hero-4.jpg"
    },
    coreValues: {
      accountability: "/hero-1.jpg",
      discipline: "/hero-2.jpg",
      excellence: "/hero-3.jpg",
      integrity: "/hero-4.jpg",
      stewardship: "/hero-1.jpg",
      unity: "/hero-2.jpg"
    },
    ministries: {
      prayer: "/hero-1.jpg",
      music: "/hero-2.jpg",
      creativeArts: "/hero-3.jpg",
      media: "/IMG_5527.JPG",
      bibleStudy: "/biblestudy1.jpg",
      evangelism: "/evagelism.jpg",
      fellowship: "/fellowship.jpg",
      hospitality: "/imgbg.jpg"
    }
  }

  // Hero Slides Data
  const heroSlides = [
    {
      id: 1,
      title: "Welcome to Karatina University Christian Union",
      subtitle: "Committed to serve the Lord",
      description: "To be agents of change in and out of campus as Christ's ambassadors during our generation",
      image: imageUrls.hero.slide1,
      cta1: "JOIN US",
      cta2: "LEARN MORE"
    },
    {
      id: 2,
      title: "Discipleship & Growth",
      subtitle: "Deepening spiritual life through Bible study and fellowship",
      description: "To deepen and strengthen the spiritual life of our members by the study of the Bible, by prayer and by Christian fellowship",
      image: imageUrls.hero.slide2,
      cta1: "JOIN BIBLE STUDY",
      cta2: "VIEW PROGRAMS"
    },
    {
      id: 3,
      title: "Evangelism & Mission",
      subtitle: "Witnessing Christ and leading others to faith",
      description: "To witness the Lord Jesus as God incarnate and seek to lead others to a personal faith in Him",
      image: imageUrls.hero.slide3,
      cta1: "GET INVOLVED",
      cta2: "VIEW MINISTRIES"
    },
    {
      id: 4,
      title: "Unity in Christ",
      subtitle: "Building bridges across cultures and backgrounds",
      description: "Fostering unity among students from diverse backgrounds through the love of Christ",
      image: imageUrls.hero.slide4,
      cta1: "JOIN FELLOWSHIP",
      cta2: "DISCOVER MORE"
    }
  ]

  // Core Values data
  const coreValues = [
    {
      name: "Accountability",
      icon: "fas fa-balance-scale",
      image: imageUrls.coreValues.accountability,
      description: "Taking responsibility for our actions and being answerable to God and our community"
    },
    {
      name: "Discipline",
      icon: "fas fa-bullseye",
      image: imageUrls.coreValues.discipline,
      description: "Maintaining self-control and dedication in our spiritual walk and daily lives"
    },
    {
      name: "Excellence",
      icon: "fas fa-star",
      image: imageUrls.coreValues.excellence,
      description: "Striving for the highest standards in everything we do for God's glory"
    },
    {
      name: "Integrity",
      icon: "fas fa-gem",
      image: imageUrls.coreValues.integrity,
      description: "Living with honesty, authenticity, and moral uprightness in all circumstances"
    },
    {
      name: "Stewardship",
      icon: "fas fa-handshake",
      image: imageUrls.coreValues.stewardship,
      description: "Responsibly managing the resources, talents, and opportunities God has given us"
    },
    {
      name: "Unity",
      icon: "fas fa-hands-helping",
      image: imageUrls.coreValues.unity,
      description: "Working together in harmony as one body in Christ, celebrating our diversity"
    }
  ]

  // Ministry data for carousel
  const ministries = [
    {
      title: "Prayer Ministry",
      description: "Interceding for our community and campus through powerful prayer sessions and spiritual warfare",
      icon: "fas fa-praying-hands",
      color: "from-purple-500 to-pink-500",
      image: imageUrls.ministries.prayer
    },
    {
      title: "Music Ministry",
      description: "Praise & Worship, Choir, and Technical support bringing glory to God through music",
      icon: "fas fa-music",
      color: "from-blue-500 to-cyan-500",
      image: imageUrls.ministries.music
    },
    {
      title: "Creative Arts",
      description: "Art, Poetry, Theatre, and Dance expressing faith through creative talents",
      icon: "fas fa-palette",
      color: "from-green-500 to-teal-500",
      image: imageUrls.ministries.creativeArts
    },
    {
      title: "Media Ministry",
      description: "ICT, Editorial, and Magazine production spreading the gospel through digital platforms",
      icon: "fas fa-camera",
      color: "from-orange-500 to-red-500",
      image: imageUrls.ministries.media
    },
    {
      title: "Bible Study & Discipleship",
      description: "Bible Study, BEST P, and Nurture Classes for spiritual growth and maturity",
      icon: "fas fa-book-open",
      color: "from-indigo-500 to-purple-500",
      image: imageUrls.ministries.bibleStudy
    },
    {
      title: "Missions & Evangelism",
      description: "Campus Evangelism Team (CET) reaching souls for Christ on campus and beyond",
      icon: "fas fa-bullhorn",
      color: "from-yellow-500 to-orange-500",
      image: imageUrls.ministries.evangelism
    },
    {
      title: "Fellowship Groups",
      description: "Gents, Ladies, and Year Fellowships building strong Christian relationships",
      icon: "fas fa-users",
      color: "from-pink-500 to-rose-500",
      image: imageUrls.ministries.fellowship
    },
    {
      title: "Hospitality Ministry",
      description: "Catering and Ushering Departments serving with love and excellence",
      icon: "fas fa-hands-helping",
      color: "from-emerald-500 to-green-500",
      image: imageUrls.ministries.hospitality
    }
  ]

  // Auto-slide for hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  // Auto-slide for core values
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentValueSlide((prev) => (prev + 1) % coreValues.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [coreValues.length])

  // Auto-slide for ministries
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMinistrySlide((prev) => (prev + 1) % ministries.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [ministries.length])

  const formatEventDate = (eventDate) => {
    const start = new Date(eventDate)
    const options = { month: 'short', day: 'numeric', year: 'numeric' }
    return start.toLocaleDateString('en-US', options)
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-black/75" />
            
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center max-w-4xl mx-auto px-4">
                <h1 className="font-heading font-bold text-5xl md:text-7xl mb-6 text-white drop-shadow-2xl">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-4 font-medium text-white drop-shadow-xl">
                  {slide.subtitle}
                </p>
                <p className="text-lg mb-8 max-w-2xl mx-auto leading-relaxed text-white drop-shadow-lg">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/register"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                  >
                    {slide.cta1}
                  </Link>
                  <Link
                    href="/about"
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                  >
                    {slide.cta2}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Ministries Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl text-gray-800 mb-4">
              Our Ministries & Committees
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the various ways you can serve and grow in your faith journey with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ministries.slice(0, 3).map((ministry, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${ministry.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl text-gray-800 mb-3 text-center">
                    {ministry.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm text-center">
                    {ministry.description}
                  </p>
                  <div className="text-center">
                    <Link
                      href="/about"
                      className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/about"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all inline-block"
            >
              View More Ministries
            </Link>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl text-gray-800 mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-gray-600">
              Join us for these exciting upcoming events and activities
            </p>
          </div>

          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url(${event.featured_image || '/hero-1.jpg'})` 
                      }}
                    />
                    {event.category && (
                      <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {event.category}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-xl text-gray-800 mb-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-gray-500 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatEventDate(event.event_date)}</span>
                    </div>
                    {event.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    <Link
                      href="/events"
                      className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50 text-gray-400" />
              <p className="text-lg text-gray-500">No upcoming events at the moment.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/events"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all inline-block"
            >
              VIEW ALL EVENTS
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6">
            New Executive Committee Members
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Meet our newly elected leadership team committed to serving our community
          </p>
          <Link
            href="/leadership"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all inline-block"
          >
            MEET THE TEAM
          </Link>
        </div>
      </section>
    </div>
  )
}
