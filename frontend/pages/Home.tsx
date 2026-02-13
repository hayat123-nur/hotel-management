
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowRight, UtensilsCrossed, Info } from 'lucide-react';
import { MOCK_RESTAURANTS, MOCK_DISHES } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/seed/adama-food/1920/1080" 
            alt="Adama Food" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-2xl animate-in fade-in slide-in-from-left-10 duration-700">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Discover the Best <span className="text-indigo-400">Restaurants</span> in Adama
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed">
              Explore local favorites and hidden gems with our AI-powered culinary assistant. From traditional Kitfo to modern lakview dining.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2 group">
                Explore Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-all">
                Our Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Restaurants', value: '50+' },
            { label: 'Monthly Visitors', value: '10k+' },
            { label: 'Food Guides', value: '120+' },
            { label: 'Local Flavors', value: '100%' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Restaurants */}
      <section id="restaurants" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Restaurants</h2>
              <p className="text-gray-600 max-w-lg">Hand-picked selection of the most loved dining destinations in the heart of Oromia.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-indigo-600 font-semibold hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {MOCK_RESTAURANTS.map((res) => (
              <div key={res.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
                <div className="relative h-56 overflow-hidden">
                  <img src={res.image} alt={res.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold">{res.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{res.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-3 font-medium uppercase tracking-tight">
                    <MapPin className="w-3 h-3" />
                    {res.location}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {res.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {res.specialties.slice(0, 2).map((s, i) => (
                      <span key={i} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Dishes */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Signature Dishes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Taste the unique flavors that define Adama's rich culinary heritage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {MOCK_DISHES.map((dish) => (
              <div key={dish.id} className="relative group">
                <div className="aspect-square rounded-full overflow-hidden mb-6 border-8 border-gray-50 shadow-inner group-hover:border-indigo-50 transition-all duration-500">
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                </div>
                <div className="text-center">
                  <span className="text-indigo-600 font-bold text-sm uppercase tracking-[0.2em]">{dish.restaurantName}</span>
                  <h3 className="text-2xl font-bold mt-2 mb-3">{dish.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 italic">"{dish.description}"</p>
                  <div className="text-xl font-black text-gray-900">{dish.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="gradient-bg rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-8">
                <UtensilsCrossed className="w-4 h-4" />
                Planning a dinner?
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Your Next Favorite Meal is Just a Chat Away</h2>
              <p className="text-xl text-indigo-100 mb-12">
                Our AI assistant "Adama Foodie" knows every corner of the city. Ask about opening hours, vegetarian options, or the best place for a romantic date.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl">
                  Get Started
                </button>
                <button className="bg-indigo-500/30 text-white border border-white/20 px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-500/50 transition-all">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6 text-white">
              <UtensilsCrossed className="text-indigo-500 w-8 h-8" />
              <span className="text-2xl font-bold">Food Explorer</span>
            </div>
            <p className="max-w-md leading-relaxed">
              Empowering food lovers to explore the rich and diverse culinary landscape of Adama. We bridge the gap between tradition and technology.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Platform</h4>
            <ul className="space-y-4 text-sm">
              {/* Fix: Added Link component import from react-router-dom */}
              <li><Link to="/" className="hover:text-indigo-400">Home</Link></li>
              <li><Link to="/admin" className="hover:text-indigo-400">Admin Panel</Link></li>
              <li><a href="#" className="hover:text-indigo-400">Knowledge Base</a></li>
              <li><a href="#" className="hover:text-indigo-400">Partner with Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Connect</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-indigo-400">Instagram</a></li>
              <li><a href="#" className="hover:text-indigo-400">Facebook</a></li>
              <li><a href="#" className="hover:text-indigo-400">Twitter</a></li>
              <li><a href="#" className="hover:text-indigo-400">Contact Support</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 text-xs text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2024 Food Explorer – Adama Restaurants. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
