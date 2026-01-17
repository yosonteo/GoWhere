import { useState } from 'react'
import { MapPin, Clock, Sparkles, Coffee, Heart, UtensilsCrossed, TrendingUp, Star, Navigation, ArrowRight, ThumbsUp, Bookmark, ChevronLeft } from 'lucide-react'
import StartPage from './StartPage'

export default function App() {
  const [showStartPage, setShowStartPage] = useState(true)
  const [selectedVibe, setSelectedVibe] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [selectedStops, setSelectedStops] = useState(3)
  const [location, setLocation] = useState('')
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)

  const vibes = [
    { id: 'chill', label: 'Chill', icon: Coffee, color: 'bg-blue-400', desc: 'Relaxed cafes & parks' },
    { id: 'date', label: 'Date', icon: Heart, color: 'bg-pink-400', desc: 'Romantic spots' },
    { id: 'foodcrawl', label: 'Food Crawl', icon: UtensilsCrossed, color: 'bg-orange-400', desc: 'Best eats in town' },
    { id: 'trending', label: 'Trending', icon: TrendingUp, color: 'bg-purple-400', desc: 'Viral on socials' }
  ]

  // Popular Singapore locations for autocomplete
  const popularLocations = [
    'Orchard Road',
    'Marina Bay Sands',
    'Clarke Quay',
    'Chinatown',
    'Little India',
    'Bugis',
    'Sentosa',
    'Raffles Place',
    'Tiong Bahru',
    'Kampong Glam',
    'Haji Lane',
    'Dhoby Ghaut',
    'Somerset',
    'Tanjong Pagar',
    'Holland Village',
    'East Coast Park',
    'Changi Airport',
    'Jewel Changi',
    'VivoCity',
    'Gardens by the Bay'
  ]

  // Filter locations based on input
  const filteredLocations = location
    ? popularLocations.filter(loc =>
        loc.toLowerCase().includes(location.toLowerCase())
      )
    : popularLocations

  const mockRoute = [
    {
      name: "Tiong Bahru Bakery",
      type: "Cafe",
      rating: 4.5,
      reviews: 1243,
      address: "56 Eng Hoon Street",
      time: "9:00 AM",
      duration: "45 min",
      why: "Perfect morning spot with artisanal pastries and specialty coffee. Aesthetic vibes for that Instagram shot.",
      image: "🥐",
      likes: 2341,
      saves: 567
    },
    {
      name: "Haji Lane Street Art",
      type: "Activity",
      rating: 4.7,
      reviews: 856,
      address: "Haji Lane, Kampong Glam",
      time: "10:30 AM",
      duration: "30 min",
      why: "Colorful murals and boutique shops. Walking distance with great photo opportunities.",
      image: "🎨",
      likes: 3421,
      saves: 892
    },
    {
      name: "Arab Street Cafe",
      type: "Cafe",
      rating: 4.4,
      reviews: 672,
      address: "42 Arab Street",
      time: "11:30 AM",
      duration: "1 hour",
      why: "Trendy Middle Eastern fusion cafe. Perfect ambiance for chilling and planning your next stop.",
      image: "☕",
      likes: 1876,
      saves: 445
    }
  ]

  const handleGenerateRoute = () => {
    setShowResults(true)
  }

  const handleStart = () => {
    setShowStartPage(false)
  }

  if (showStartPage) {
    return <StartPage onStart={handleStart} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-custom p-2 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-custom bg-clip-text text-transparent">
                GoWhere
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-custom-orange transition">My Routes</button>
              <button className="bg-gradient-custom text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showResults ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                What's Your Vibe Today?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Tell us your mood, location, and time. We'll plan the perfect route with the best spots in Singapore.
              </p>
            </div>

            {/* Vibe Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                Choose Your Vibe
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {vibes.map((vibe) => {
                  const Icon = vibe.icon
                  return (
                    <button
                      key={vibe.id}
                      onClick={() => setSelectedVibe(vibe.id)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        selectedVibe === vibe.id
                          ? 'border-custom-yellow bg-yellow-50 shadow-lg scale-105'
                          : 'border-gray-200 bg-white hover:border-yellow-200 hover:shadow-md'
                      }`}
                    >
                      <div className={`${vibe.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{vibe.label}</h4>
                      <p className="text-sm text-gray-600">{vibe.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Input Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Starting Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onFocus={() => setShowLocationSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                    placeholder="e.g., Orchard Road, Clarke Quay"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-yellow focus:border-transparent outline-none"
                  />

                  {/* Location Suggestions Dropdown */}
                  {showLocationSuggestions && filteredLocations.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredLocations.slice(0, 8).map((loc, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setLocation(loc)
                            setShowLocationSuggestions(false)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-yellow-50 transition flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{loc}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time Available
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-yellow focus:border-transparent outline-none">
                    <option>2-3 hours</option>
                    <option>3-4 hours</option>
                    <option>4-5 hours</option>
                    <option>Half day</option>
                    <option>Full day</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Stops
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={selectedStops}
                  onChange={(e) => setSelectedStops(Number(e.target.value))}
                  placeholder="e.g., 5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-yellow focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 3-10 stops for best experience</p>
              </div>

              <button
                onClick={handleGenerateRoute}
                disabled={!selectedVibe}
                className="w-full bg-gradient-custom text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate My Route
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/60 backdrop-blur rounded-xl p-6">
                <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-custom-orange" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Smart Routing</h3>
                <p className="text-gray-600 text-sm">Optimized walking routes between stops. No backtracking, all vibes.</p>
              </div>
              <div className="bg-white/60 backdrop-blur rounded-xl p-6">
                <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Viral Spots</h3>
                <p className="text-gray-600 text-sm">Trending places from TikTok, Instagram, and real reviews.</p>
              </div>
              <div className="bg-white/60 backdrop-blur rounded-xl p-6">
                <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">AI Recommendations</h3>
                <p className="text-gray-600 text-sm">AI explains why each spot matches your vibe perfectly.</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Results View */}
            <div className="mb-6">
              <button
                onClick={() => setShowResults(false)}
                className="mb-4 flex items-center gap-2 text-custom-orange hover:text-custom-orange font-medium transition"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Search
              </button>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Chill Route</h2>
                  <p className="text-gray-600">3 stops • 2.5 hours • 1.2 km total walk</p>
                </div>
                <button
                  onClick={() => setShowResults(false)}
                  className="px-6 py-3 border-2 border-custom-yellow text-custom-orange rounded-lg font-semibold hover:bg-yellow-50 transition"
                >
                  New Route
                </button>
              </div>
            </div>

            {/* Route Cards */}
            <div className="space-y-6">
              {mockRoute.map((stop, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Stop Number */}
                      <div className="bg-gradient-custom text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {index + 1}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{stop.name}</h3>
                            <p className="text-sm text-gray-500">{stop.type} • {stop.address}</p>
                          </div>
                          <div className="text-6xl">{stop.image}</div>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold text-gray-900">{stop.rating}</span>
                            <span className="text-sm text-gray-500">({stop.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {stop.time} • {stop.duration}
                          </div>
                        </div>

                        {/* AI Explanation */}
                        <div className="bg-yellow-50 border-l-4 border-custom-yellow p-4 rounded-r-lg mb-4">
                          <p className="text-sm text-gray-700 flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-custom-orange flex-shrink-0 mt-0.5" />
                            <span><strong>Why this spot:</strong> {stop.why}</span>
                          </p>
                        </div>

                        {/* Social Stats */}
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {stop.likes.toLocaleString()} likes
                          </div>
                          <div className="flex items-center gap-1">
                            <Bookmark className="w-4 h-4" />
                            {stop.saves} saves
                          </div>
                          <button className="text-custom-orange font-medium hover:text-custom-orange flex items-center gap-1">
                            <Navigation className="w-4 h-4" />
                            Get Directions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Walking to Next Stop */}
                  {index < mockRoute.length - 1 && (
                    <div className="bg-gray-50 px-6 py-3 flex items-center justify-center gap-2 text-sm text-gray-600 border-t">
                      <ArrowRight className="w-4 h-4" />
                      8 min walk to next stop (600m)
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <button className="flex-1 bg-gradient-custom text-white py-4 rounded-lg font-semibold hover:opacity-90 transition">
                Save Route
              </button>
              <button className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition">
                Share with Friends
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}