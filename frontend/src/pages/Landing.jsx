import { useNavigate } from 'react-router-dom'
import { Leaf, Camera, BarChart2, Zap, Users, Globe } from 'lucide-react'

const stats = [
  { value: '1.3B tons', label: 'of food wasted annually' },
  { value: '$1 Trillion', label: 'economic cost per year' },
  { value: '828M', label: 'people go hungry every day' },
  { value: '8-10%', label: 'of global greenhouse gas emissions' },
]

const steps = [
  { icon: Camera, title: 'Scan', desc: 'Point your camera at your fridge or shelf. Gemini Vision AI instantly identifies every food item, its quantity, and freshness.' },
  { icon: BarChart2, title: 'Predict', desc: 'Our Prediction Agent forecasts waste risk for each item — HIGH, MEDIUM, or LOW — before it expires.' },
  { icon: Zap, title: 'Act', desc: 'Get smart recommendations: dynamic discounts, AI-generated recipes using at-risk items, and donation matching with nearby food banks.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-2 text-green-600 font-bold text-xl">
          <Leaf size={24} /> ZeroWaste AI
        </div>
        <button
          onClick={() => navigate('/login')}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section className="text-center py-24 px-6 bg-gradient-to-b from-green-50 to-white">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
          <Leaf size={14} /> Sustainability & Social Impact
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          See your food.<br />
          <span className="text-green-600">Save your food.</span><br />
          Feed your community.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          ZeroWaste AI uses Google Gemini to identify food, predict waste, and
          take action — before it's too late.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-green-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition shadow-lg"
        >
          Start Reducing Waste →
        </button>
      </section>

      {/* Problem Stats */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-center text-3xl font-bold mb-12">The Problem is Enormous</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-extrabold text-green-400 mb-2">{s.value}</div>
                <div className="text-gray-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-center text-gray-500 mb-14">Three AI agents working together to eliminate food waste</p>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon size={28} className="text-green-600" />
                </div>
                <div className="text-xs font-bold text-green-600 mb-1">STEP {i + 1}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-600 text-white text-center px-6">
        <Globe size={40} className="mx-auto mb-4 opacity-80" />
        <h2 className="text-3xl font-bold mb-3">Join the Fight Against Food Waste</h2>
        <p className="text-green-100 mb-8 max-w-xl mx-auto">
          Every item saved is a meal for someone who needs it.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-white text-green-700 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-green-50 transition shadow"
        >
          Get Started Free
        </button>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm border-t">
        <div className="flex items-center justify-center gap-2 mb-1 text-green-600 font-semibold">
          <Leaf size={16} /> ZeroWaste AI
        </div>
        Powered by Google Gemini · Built for a sustainable future
      </footer>
    </div>
  )
}
