import SermonsClient from './SermonsClient'

export const metadata = {
  title: 'Sermons | KarUCU Main Campus',
  description: 'Listen to inspiring sermons and messages from KarUCU Main Campus Christian Union',
}

export default function SermonsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 text-white">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/hero-3.jpg" 
            alt="Sermons Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-purple-900/80"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-heading font-bold text-5xl md:text-6xl mb-6">
              Sermons & Messages
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Listen to inspiring messages from God's Word
            </p>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed">
              Browse our collection of sermons, teachings, and messages delivered at KarUCU Main Campus. 
              Each message is designed to inspire, encourage, and strengthen your faith.
            </p>
          </div>
        </div>
      </section>

      {/* Sermons Content */}
      <SermonsClient />
    </div>
  )
}
