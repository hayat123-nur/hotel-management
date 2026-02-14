
import React from 'react';
import { Star, MapPin, UtensilsCrossed, Clock, MessageSquare, User, Settings, Heart } from 'lucide-react';
import { MOCK_RESTAURANTS } from '../constants';

const UserDashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const firstName = user.name?.split(' ')[0] || 'Gourmet';

  const favorites = MOCK_RESTAURANTS.slice(0, 2);

  return (
    <div className="min-h-screen bg-gourmet-cream overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gourmet-amber/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>
      
      <main className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Header Section */}
        <header className="mb-20 animate-in fade-in slide-in-from-left-10 duration-1000">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <div className="flex items-center gap-3 text-gourmet-amber text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                <span className="w-8 h-px bg-gourmet-amber/30"></span>
                Welcome Back
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-gourmet-charcoal serif leading-none tracking-tight italic">
                Saluations, <span className="text-gourmet-amber">{firstName}</span>
              </h1>
              <p className="mt-6 text-gourmet-charcoal/50 serif italic text-xl max-w-xl leading-relaxed">
                Your curated gastronomic journey continues. We've prepared new recommendations based on your refined palate.
              </p>
            </div>
            
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
              className="group bg-gourmet-charcoal text-gourmet-amber px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-gourmet-clay transition-all shadow-2xl amber-glow flex items-center gap-4"
            >
              <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Consult Private Concierge
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-16">
            <section>
              <div className="flex justify-between items-end mb-10">
                <h2 className="text-3xl font-black text-gourmet-charcoal serif italic">Your Preferred Tables</h2>
                <button className="text-[10px] font-black uppercase tracking-widest text-gourmet-amber hover:text-gourmet-gold transition-colors">View All Portfolio</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {favorites.map((res) => (
                  <div key={res.id} className="glass-card rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-700 border border-gourmet-amber/10">
                    <div className="h-64 relative overflow-hidden">
                      <img src={res.image} alt={res.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.3] group-hover:grayscale-0" />
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/90 backdrop-blur-md text-gourmet-charcoal px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-gourmet-amber/20">
                          Recommended
                        </span>
                      </div>
                      <button className="absolute bottom-6 right-6 bg-gourmet-charcoal/80 backdrop-blur-md p-3 rounded-2xl text-gourmet-amber border border-white/10 hover:bg-gourmet-amber hover:text-gourmet-charcoal transition-all shadow-xl">
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-2 text-gourmet-amber text-[9px] font-black uppercase tracking-widest mb-3">
                        <MapPin className="w-3 h-3" />
                        {res.location}
                      </div>
                      <h3 className="text-2xl font-black text-gourmet-charcoal serif mb-4 italic leading-tight">{res.name}</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-gourmet-amber fill-gourmet-amber" />
                          <span className="text-xs font-black text-gourmet-charcoal">{res.rating}</span>
                        </div>
                        <span className="text-gourmet-charcoal/20 text-xs">|</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gourmet-charcoal/40 italic">Signature Dining</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="gradient-bg rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl amber-glow">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gourmet-amber/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="bg-gourmet-amber/20 p-6 rounded-[2rem] border border-gourmet-amber/30">
                  <UtensilsCrossed className="w-10 h-10 text-gourmet-amber" />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-2 serif italic">Culinary Insider Program</h3>
                  <p className="text-gourmet-cream/50 serif italic text-lg leading-relaxed">
                    Gain exclusive access to secret menus and priority reservations at Adama's most coveted establishments.
                  </p>
                </div>
                <button className="md:ml-auto whitespace-nowrap bg-gourmet-amber text-gourmet-charcoal px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gourmet-gold transition-all shadow-xl amber-glow">
                  Join Elite
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-12">
            <section className="glass-card rounded-[3rem] p-10 border border-gourmet-amber/10 shadow-xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 rounded-[1.5rem] bg-gourmet-charcoal flex items-center justify-center text-gourmet-amber shadow-2xl amber-glow border border-gourmet-amber/20">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-gourmet-charcoal serif leading-tight italic">{user.name}</h4>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gourmet-amber">Connoisseur Member</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: Clock, label: 'Journal Residencies', value: '4 Visits' },
                  { icon: Heart, label: 'Curated Portals', value: '12 Saved' },
                  { icon: Star, label: 'Critique Status', value: '7 Reviews' },
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center p-5 rounded-2xl bg-white/50 border border-gourmet-amber/5 hover:border-gourmet-amber/20 transition-all group">
                    <div className="flex items-center gap-4">
                      <stat.icon className="w-4 h-4 text-gourmet-charcoal/40 group-hover:text-gourmet-amber transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gourmet-charcoal/60">{stat.label}</span>
                    </div>
                    <span className="text-xs font-black text-gourmet-charcoal">{stat.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-card rounded-[3rem] p-10 border border-gourmet-amber/10 shadow-xl">
              <h4 className="text-lg font-black text-gourmet-charcoal serif mb-8 italic">Journal Preferences</h4>
              <div className="space-y-6">
                <div className="space-y-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gourmet-charcoal/40 block">Preferred Ambiance</span>
                  <div className="flex flex-wrap gap-2">
                    {['Rooftop', 'Intimate', 'Lakeside', 'Contemporary'].map((tag) => (
                      <span key={tag} className="px-4 py-2 rounded-full border border-gourmet-charcoal/10 text-[9px] font-black uppercase tracking-widest text-gourmet-charcoal/60 hover:bg-gourmet-charcoal hover:text-gourmet-amber transition-all cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="w-full flex items-center justify-center gap-3 bg-white border border-gourmet-amber/20 px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gourmet-charcoal hover:bg-gourmet-amber hover:text-gourmet-charcoal transition-all group">
                  <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  Refine Preferences
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
