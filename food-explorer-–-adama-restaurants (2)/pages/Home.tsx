
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowRight, UtensilsCrossed, Info } from 'lucide-react';
import { MOCK_RESTAURANTS, MOCK_DISHES } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/seed/adama-gourmet/1920/1080" 
            alt="Adama Fine Dining" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gourmet-charcoal via-gourmet-charcoal/40 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none tracking-tight">
              Savor the <span className="text-gourmet-amber italic">Exquisite</span> <br/>
              Taste of Adama
            </h1>
            <p className="text-lg md:text-xl text-gourmet-cream/80 mb-12 leading-relaxed max-w-xl serif italic font-light">
              Embark on a curated journey through the city's most prestigious culinary destinations, where tradition meets contemporary elegance.
            </p>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gourmet-amber hover:bg-gourmet-gold text-gourmet-charcoal px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-2xl amber-glow flex items-center gap-3 group"
              >
                Reserve Your Table
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white border border-white/20 px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all">
                Discover More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gourmet-charcoal py-16 border-y border-gourmet-amber/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gourmet-amber to-transparent"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-gourmet-amber to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'Curated Venues', value: '50+' },
            { label: 'Monthly Gastronomes', value: '12k+' },
            { label: 'Culinary Guides', value: '150+' },
            { label: 'Authentic Flavors', value: '100%' },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-4xl font-black text-gourmet-amber mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-500">{stat.value}</div>
              <div className="text-gourmet-cream/40 text-[10px] font-black uppercase tracking-[0.3em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Restaurants */}
      <section id="restaurants" className="py-32 bg-gourmet-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-20">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black text-gourmet-charcoal mb-6 leading-none">Featured Establishments</h2>
              <p className="text-gourmet-charcoal/60 serif italic text-lg opacity-80">A hand-picked selection of the most distinguished dining destinations in the heart of the region.</p>
            </div>
            <button className="hidden md:flex items-center gap-3 text-gourmet-amber font-black uppercase tracking-widest text-sm hover:translate-x-2 transition-transform">
              View Collection <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {MOCK_RESTAURANTS.map((res) => (
              <div key={res.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gourmet-amber/5">
                <div className="relative h-72 overflow-hidden">
                  <img src={res.image} alt={res.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute top-6 right-6 bg-gourmet-charcoal/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-xl border border-white/10">
                    <Star className="w-4 h-4 text-gourmet-amber fill-gourmet-amber" />
                    <span className="text-sm font-black text-white">{res.rating}</span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-gourmet-amber text-[10px] mb-4 font-black uppercase tracking-[0.2em]">
                    <MapPin className="w-3.5 h-3.5" />
                    {res.location}
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-gourmet-charcoal serif leading-tight">{res.name}</h3>
                  <p className="text-gourmet-charcoal/60 text-sm leading-relaxed mb-6 italic opacity-70">
                    {res.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {res.specialties.slice(0, 2).map((s, i) => (
                      <span key={i} className="text-[9px] bg-gourmet-charcoal text-gourmet-amber px-3 py-1 rounded-full font-black uppercase tracking-widest">
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
      <section className="py-32 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gourmet-amber/5 -skew-x-12 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-gourmet-charcoal">Signature Creations</h2>
            <p className="text-gourmet-charcoal/50 max-w-2xl mx-auto serif italic text-lg">A celebration of Adama's rich culinary heritage, reimagined for the modern palate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {MOCK_DISHES.map((dish) => (
              <div key={dish.id} className="relative group">
                <div className="aspect-square rounded-full overflow-hidden mb-10 border-[12px] border-gourmet-cream shadow-2xl group-hover:border-gourmet-amber/20 transition-all duration-700 relative">
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2" />
                  <div className="absolute inset-0 bg-gourmet-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="text-center">
                  <span className="text-gourmet-amber font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">{dish.restaurantName}</span>
                  <h3 className="text-3xl font-black mt-2 mb-4 serif text-gourmet-charcoal leading-tight">{dish.name}</h3>
                  <p className="text-gourmet-charcoal/60 text-sm mb-6 italic opacity-70 px-4">"{dish.description}"</p>
                  <div className="text-2xl font-black text-gourmet-amber tracking-tighter">{dish.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-32 bg-gourmet-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="gradient-bg rounded-[4rem] p-16 md:p-28 text-white relative overflow-hidden flex flex-col items-center text-center shadow-3xl amber-glow">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gourmet-amber/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gourmet-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-white/10 text-gourmet-amber">
                <UtensilsCrossed className="w-4 h-4" />
                Culinary Consultation
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-10 leading-none serif tracking-tight">Your Next Culinary Masterpiece Awaits</h2>
              <p className="text-xl text-gourmet-cream/60 mb-14 serif italic font-light">
                Our AI-driven concierge, <span className="text-gourmet-amber">"The Epicurean,"</span> possesses intimate knowledge of the city's finest tables. Seek guidance on pairings, ambiance, or hidden gems.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
                  className="bg-gourmet-amber text-gourmet-charcoal px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-gourmet-gold transition-all shadow-xl amber-glow"
                >
                  Consult the AI
                </button>
                <button className="bg-white/5 text-white border border-white/20 px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                  Private Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gourmet-charcoal text-gourmet-cream/40 py-24 mt-auto border-t border-gourmet-amber/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-8 text-white">
              <div className="bg-gourmet-amber/10 p-2 rounded-lg border border-gourmet-amber/20">
                <UtensilsCrossed className="text-gourmet-amber w-6 h-6" />
              </div>
              <span className="text-3xl font-black serif tracking-tight">Food <span className="text-gourmet-amber">Explorer</span></span>
            </div>
            <p className="max-w-md leading-relaxed serif italic text-lg opacity-60">
              Curating exceptional culinary experiences by bridging the gap between time-honored traditions and modern gastronomic innovation in Adama.
            </p>
          </div>
          <div>
            <h4 className="text-gourmet-amber font-black mb-8 uppercase tracking-[0.3em] text-[10px]">The Collection</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><Link to="/" className="hover:text-gourmet-amber transition-colors">Portfolios</Link></li>
              <li><Link to="/admin" className="hover:text-gourmet-amber transition-colors">Maitre d' Panel</Link></li>
              <li><a href="#" className="hover:text-gourmet-amber transition-colors">Gastronomy Blog</a></li>
              <li><a href="#" className="hover:text-gourmet-amber transition-colors">Become a Partner</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gourmet-amber font-black mb-8 uppercase tracking-[0.3em] text-[10px]">Social Circle</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-gourmet-amber transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-gourmet-amber transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-gourmet-amber transition-colors">Twitter (X)</a></li>
              <li><a href="#" className="hover:text-gourmet-amber transition-colors">Concierge Support</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-24 pt-12 border-t border-white/5 text-[10px] uppercase tracking-[0.2em] font-black text-center flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
          <p>© 2024 Food Explorer – Adama Gastronomy. Reserved with Excellence.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-gourmet-amber transition-colors">Privacy Charter</a>
            <a href="#" className="hover:text-gourmet-amber transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
