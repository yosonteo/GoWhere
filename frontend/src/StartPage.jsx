import { MapPin, ArrowRight } from 'lucide-react'

export default function StartPage({ onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-gradient-custom p-4 rounded-2xl">
            <MapPin className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-custom bg-clip-text text-transparent">
            GoWhere
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-2xl text-gray-700 mb-12">
          Discover your perfect route in Singapore
        </p>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="bg-gradient-custom text-white px-12 py-5 rounded-xl font-semibold text-xl hover:opacity-90 transition transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
        >
          Get Started
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
