'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function AboutClient() {
  const [currentMinistrySlide, setCurrentMinistrySlide] = useState(0)

  // Ministry data with images for slider
  const ministries = [
    {
      title: "Prayer Ministry",
      icon: "fas fa-praying-hands",
      color: "from-purple-500 to-indigo-600",
      description: "Intercession and spiritual warfare for our community through powerful prayer sessions and dedicated intercession",
      image: "/fellowship-2.jpg"
    },
    {
      title: "Missions & Evangelism",
      icon: "fas fa-bullhorn",
      color: "from-blue-500 to-cyan-600",
      description: "Reaching souls for Christ on campus and beyond through the Campus Evangelism Team and outreach programs",
      image: "/hero-2.jpg"
    },
    {
      title: "Music Ministry",
      icon: "fas fa-music",
      color: "from-emerald-500 to-teal-600",
      description: "Worship, praise, and technical support for services bringing glory to God through music and sound",
      image: "/hero-3.jpg"
    },
    {
      title: "Creative Arts",
      icon: "fas fa-palette",
      color: "from-orange-500 to-red-600",
      description: "Art, poetry, theatre, and creative expression showcasing God's creativity through diverse artistic talents",
      image: "/hero-4.jpg"
    },
    {
      title: "Media Ministry",
      icon: "fas fa-camera",
      color: "from-pink-500 to-rose-600",
      description: "Digital content, ICT, and editorial services spreading the gospel through modern technology platforms",
      image: "/IMG_5527.JPG"
    },
    {
      title: "Bible Study & Discipleship",
      icon: "fas fa-book-open",
      color: "from-violet-500 to-purple-600",
      description: "Discipleship, nurture classes, and Bible study groups for spiritual growth and biblical understanding",
      image: "/biblestudy1.jpg"
    },
    {
      title: "Hospitality Ministry",
      icon: "fas fa-hands-helping",
      color: "from-green-500 to-emerald-600",
      description: "Catering, ushering, and welcoming services creating a warm and inviting atmosphere for all",
      image: "/imgbg.jpg"
    },
    {
      title: "Fellowship Groups",
      icon: "fas fa-users",
      color: "from-amber-500 to-yellow-600",
      description: "Gents, ladies, and year-based fellowship groups building strong Christian relationships and community",
      image: "/hero-4.jpg"
    }
  ]

  // Auto-slide functionality for ministries
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMinistrySlide((prev) => (prev + 1) % ministries.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [ministries.length])

  return (
    <>
      {/* Ministry Image Slider */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400/10 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-400/5 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-indigo-400/10 rounded-full blur-xl animate-bounce"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6 text-white drop-shadow-2xl">
              Our Ministries
            </h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed text-white/95 drop-shadow-lg">
              Discover your calling and serve God through diverse ministry opportunities designed to nurture your gifts and passion
            </p>
          </div>

          {/* Ministry Slider */}
          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden rounded-3xl">
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
                    <div className="absolute inset-0 bg-black/70" />
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

            {/* Navigation Arrows */}
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

            {/* Slide Indicators */}
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

          {/* Ministry Grid - Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-16 max-w-6xl mx-auto">
            {ministries.map((ministry, index) => (
              <button
                key={index}
                onClick={() => setCurrentMinistrySlide(index)}
                className={`text-center p-4 rounded-xl transition-all duration-300 ${
                  index === currentMinistrySlide
                    ? 'bg-white/25 border-2 border-white/50 scale-105'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                }`}
              >
                <div className="mb-2">
                  <i className={`${ministry.icon} text-2xl text-white drop-shadow-lg`}></i>
                </div>
                <h4 className="font-semibold text-xs text-white drop-shadow-md">{ministry.title}</h4>
              </button>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-xl mb-8 text-white/95 drop-shadow-md max-w-2xl mx-auto leading-relaxed">
              Find your place in God's kingdom and discover your calling through our ministries
            </p>

            <Link
              href="/register"
              className="relative inline-block bg-purple-600 hover:bg-purple-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 group"
            >
              <span className="relative z-10 flex items-center">
                <i className="fas fa-user-plus mr-3 group-hover:animate-bounce"></i>
                JOIN A MINISTRY
                <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform duration-300"></i>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
