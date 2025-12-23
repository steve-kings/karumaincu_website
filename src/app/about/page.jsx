import Link from 'next/link'
import AboutClient from './AboutClient'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/fellowship.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

        <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center text-white">
          <h1
            className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl mb-6 text-white drop-shadow-2xl"
            style={{
              textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0px 0px 20px rgba(0,0,0,0.7)'
            }}
          >
            About KarUCU
          </h1>
          <p
            className="text-xl md:text-2xl mb-6 text-white drop-shadow-xl font-semibold"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0px 0px 15px rgba(0,0,0,0.6)'
            }}
          >
            Karatina University Christian Union - Main Campus
          </p>
          <p
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-white drop-shadow-lg font-medium"
            style={{
              textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0px 0px 10px rgba(0,0,0,0.5)'
            }}
          >
            For over a decade, we have been a beacon of faith at Karatina University,
            uniting students in Christ and fostering spiritual growth alongside academic excellence.
          </p>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="animate-bounce bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
              <i className="fas fa-chevron-down text-2xl text-white drop-shadow-lg"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-eye text-white"></i>
                </div>
                <h2 className="font-heading font-bold text-xl md:text-2xl text-purple-800">Our Vision</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To be a vibrant Christian community at Karatina University that transforms lives,
                builds godly character, and produces Christian leaders who will impact society
                for the glory of God.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-teal-500">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-bullseye text-white"></i>
                </div>
                <h2 className="font-heading font-bold text-xl md:text-2xl text-teal-800">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To evangelize, disciple, and nurture university students in Christian faith,
                while promoting academic excellence, moral integrity, and service to God and humanity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Union Objectives */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-800 mb-3">
              Our Objectives
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The official objectives that guide our union as outlined in our constitution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Discipleship",
                description: "To deepen and strengthen the spiritual life of its members by the study of the Bible, by prayer and by Christian fellowship.",
                icon: "fas fa-seedling",
                color: "purple"
              },
              {
                title: "Evangelism",
                description: "To witness the Lord Jesus as God incarnate and seek to lead others to a personal faith in Him.",
                icon: "fas fa-bullhorn",
                color: "teal"
              },
              {
                title: "Mission",
                description: "To sensitize members into mission work in every area of life according to their calling, gifting, and training.",
                icon: "fas fa-globe",
                color: "emerald"
              },
              {
                title: "Personal Development",
                description: "To enhance holistic growth of Union members in their gifting and calling through training to develop them into leaders of impact and positive influence.",
                icon: "fas fa-user-graduate",
                color: "amber"
              },
              {
                title: "Leadership Development",
                description: "To cultivate responsible and engaged leaders within the Union, we strive to encourage active participation in member-led initiatives and ownership of collective responsibilities.",
                icon: "fas fa-crown",
                color: "purple"
              }
            ].map((objective, index) => {
              const colorClasses = {
                purple: "from-purple-500 to-purple-600",
                teal: "from-teal-500 to-teal-600",
                emerald: "from-emerald-500 to-emerald-600",
                amber: "from-amber-500 to-amber-600"
              }

              return (
                <div
                  key={index}
                  className="bg-gray-50 p-5 rounded-xl hover:shadow-md transition-shadow duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[objective.color]} rounded-lg flex items-center justify-center mb-4`}>
                    <i className={`${objective.icon} text-white text-lg`}></i>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-gray-800 mb-3">
                    {objective.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {objective.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Ministry Slider - Client Component */}
      <AboutClient />

      {/* Core Values */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-gray-800 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The fundamental principles that shape our character and guide our actions as followers of Christ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Accountability",
                description: "Taking responsibility for our actions and being answerable to God and our community",
                icon: "fas fa-balance-scale",
                color: "from-purple-500 to-indigo-600"
              },
              {
                title: "Discipline",
                description: "Maintaining self-control and dedication in our spiritual walk and daily lives",
                icon: "fas fa-bullseye",
                color: "from-blue-500 to-cyan-600"
              },
              {
                title: "Excellence",
                description: "Striving for the highest standards in everything we do for God's glory",
                icon: "fas fa-star",
                color: "from-emerald-500 to-teal-600"
              },
              {
                title: "Integrity",
                description: "Living with honesty, authenticity, and moral uprightness in all circumstances",
                icon: "fas fa-gem",
                color: "from-orange-500 to-red-600"
              },
              {
                title: "Stewardship",
                description: "Responsibly managing the resources, talents, and opportunities God has given us",
                icon: "fas fa-handshake",
                color: "from-pink-500 to-rose-600"
              },
              {
                title: "Unity",
                description: "Working together in harmony as one body in Christ, celebrating our diversity",
                icon: "fas fa-hands-helping",
                color: "from-violet-500 to-purple-600"
              }
            ].map((value, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>

                <div className="relative mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                  <div className={`relative w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${value.icon} text-2xl text-white`}></i>
                  </div>
                </div>

                <h3 className="font-heading font-bold text-2xl text-gray-800 mb-4 group-hover:text-gray-900 transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {value.description}
                </p>

                <div className={`absolute top-4 right-4 w-8 h-8 bg-gradient-to-br ${value.color} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-purple-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">
              Our Impact
            </h2>
            <p className="text-lg opacity-90">
              God has blessed our ministry with incredible growth and transformation
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "500+", label: "Active Members", icon: "fas fa-users" },
              { number: "15+", label: "Years of Ministry", icon: "fas fa-calendar" },
              { number: "1000+", label: "Lives Touched", icon: "fas fa-heart" },
              { number: "50+", label: "Community Projects", icon: "fas fa-hands-helping" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <i className={`${stat.icon} text-3xl mb-3 opacity-80`}></i>
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-800 mb-4">
            Join Our Community
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Whether you're a new student or have been at Karatina University for a while,
            you're welcome to join our fellowship.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              JOIN US TODAY
            </Link>
            <Link
              href="/events"
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              VIEW EVENTS
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
