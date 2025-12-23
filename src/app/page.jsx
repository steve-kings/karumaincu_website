'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentValueSlide, setCurrentValueSlide] = useState(0)
  const [currentMinistrySlide, setCurrentMinistrySlide] = useState(0)

  const imageUrls = {
    hero: {
      slide1: "/fellowship.jpg",
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
      prayer: "/fellowship-2.jpg",
      music: "/hero-2.jpg",
      creativeArts: "/hero-3.jpg",
      media: "/IMG_5527.JPG",
      bibleStudy: "/biblestudy1.jpg",
      evangelism: "/evagelism.jpg",
      fellowship: "/fellowship.jpg",
      hospitality: "/imgbg.jpg"
    }
  }

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMinistrySlide((prev) => (prev + 1) % ministries.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [ministries.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-black/75" />
            
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center max-w-4xl mx-auto px-4">
                <h1 className="font-heading font-bold text-5xl md:text-7xl mb-6 text-white drop-shadow-2xl"
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-4 font-medium text-white drop-shadow-xl"
                   style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                  {slide.subtitle}
                </p>
                <p className="text-lg mb-8 max-w-2xl mx-auto leading-relaxed text-white drop-shadow-lg"
                   style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/register"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:shadow-lg"
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
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Ministries Section */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl text-gray-800 dark:text-white mb-4">
              Our Ministries & Committees
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the various ways you can serve and grow in your faith journey with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {[
              {
                title: "Prayer Ministry",
                description: "KarUCU is an interdenominational, non profit making and non political organization dedicated to intercession and spiritual warfare",
                image: imageUrls.ministries.prayer,
                link: "/prayer"
              },
              {
                title: "Music & Worship",
                description: "Explore our musical content, worship sessions, choir performances and technical support ministry",
                image: imageUrls.ministries.music,
                link: "/media"
              },
              {
                title: "Bible Study Groups",
                description: "Join us in the Spirit on all occasions with all kinds of Bible study sessions, discipleship and nurture classes",
                image: imageUrls.ministries.bibleStudy,
                link: "/about"
              }
            ].map((card, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl text-gray-800 dark:text-white mb-3 text-center">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-sm text-center">
                    {card.description}
                  </p>
                  <div className="text-center">
                    <Link
                      href={card.link}
                      className="inline-flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold text-sm transition-colors"
                    >
                      Read More <i className="fas fa-arrow-right ml-2"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/about"
              className="inline-flex items-center bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <i className="fas fa-plus mr-2"></i>
              View More Ministries
            </Link>
          </div>
        </div>
      </section>

      {/* Ministry Carousel */}
      <section className="py-20 bg-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400/10 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-400/5 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200 drop-shadow-2xl mb-6">
              Join a Christ-centered Community
            </h2>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/95 drop-shadow-lg leading-relaxed">
              Discover your unique gifts and divine calling through our vibrant ministry opportunities
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden rounded-2xl">
              {ministries.map((ministry, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ease-in-out ${
                    index === currentMinistrySlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'
                  }`}
                >
                  <div className="relative h-96 md:h-80">
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${ministry.image})` }}
                    />
                    <div className="absolute inset-0 bg-black/75" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${ministry.color} opacity-20`}></div>

                    <div className="relative z-10 h-full flex items-center justify-center p-8">
                      <div className="text-center max-w-4xl">
                        <div className="relative mb-8">
                          <div className={`absolute inset-0 bg-gradient-to-r ${ministry.color} rounded-full blur-2xl opacity-60`}></div>
                          <div className="relative w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                            <i className={`${ministry.icon} text-4xl text-white drop-shadow-2xl`}></i>
                          </div>
                        </div>

                        <h3 className="font-heading font-bold text-4xl md:text-5xl mb-6 text-white drop-shadow-2xl">
                          {ministry.title}
                        </h3>
                        <p className="text-xl md:text-2xl text-white/95 drop-shadow-lg leading-relaxed max-w-3xl mx-auto">
                          {ministry.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentMinistrySlide((prev) => (prev - 1 + ministries.length) % ministries.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all z-20 backdrop-blur-sm border border-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentMinistrySlide((prev) => (prev + 1) % ministries.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all z-20 backdrop-blur-sm border border-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="flex justify-center mt-8 space-x-3">
              {ministries.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMinistrySlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 ${
                    index === currentMinistrySlide ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <Link
              href="/about"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 group"
            >
              <span className="flex items-center">
                EXPLORE ALL MINISTRIES
                <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform duration-300"></i>
              </span>
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
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:shadow-lg inline-block"
          >
            MEET THE TEAM
          </Link>
        </div>
      </section>
    </div>
  )
}
