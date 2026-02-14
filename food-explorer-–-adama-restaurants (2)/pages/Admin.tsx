
import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, Edit3, FileText, Database, Settings, ShieldCheck, Search, Image as ImageIcon, MapPin, Utensils, Loader2, LogOut } from 'lucide-react';
import { getDocuments, uploadDocument, deleteDocument } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'restaurants' | 'settings'>('knowledge');
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('foodToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('foodToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Check if user is admin/staff
  useEffect(() => {
    if (!token || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const fetchDocs = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await getDocuments(token);
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Fetch docs error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'knowledge') {
      fetchDocs();
    }
  }, [activeTab]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'resource');

    try {
      const res = await uploadDocument(formData, token, true);
      if (res.success) {
        fetchDocs();
      } else {
        alert(res.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this document?')) return;

    try {
      const res = await deleteDocument(id, token);
      if (res.success) {
        fetchDocs();
      } else {
        alert(res.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gourmet-cream flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-gourmet-charcoal border-r border-gourmet-amber/10 hidden lg:flex flex-col relative z-20">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-from),transparent_70%)] from-gourmet-amber/20"></div>
        </div>
        
        <div className="p-10 flex items-center gap-4 relative">
          <div className="bg-gourmet-amber/10 p-2.5 rounded-2xl border border-gourmet-amber/20 amber-glow">
            <ShieldCheck className="text-gourmet-amber w-7 h-7" />
          </div>
          <div>
            <span className="block font-black text-xl text-white serif tracking-tight">Admin</span>
            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-gourmet-amber"></span>
          </div>
        </div>

        {/* <nav className="flex-1 p-6 space-y-3 relative">
          {[
            { id: 'knowledge', icon: Database, label: 'Knowledge Base' },
            { id: 'restaurants', icon: Utensils, label: 'Restaurant Registry' },
            { id: 'settings', icon: Settings, label: 'System Elegance' },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 border ${
                activeTab === tab.id 
                  ? 'bg-gourmet-amber text-gourmet-charcoal border-gourmet-amber shadow-2xl amber-glow scale-[1.02]' 
                  : 'text-gourmet-cream/50 border-transparent hover:bg-white/5 hover:text-gourmet-cream hover:border-white/10'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-gourmet-charcoal' : 'text-gourmet-amber'}`} />
              {tab.label}
            </button>
          ))}
          
          <div className="pt-8 pb-4 px-6 border-t border-white/5 mt-8">
             <span className="text-[9px] font-black uppercase text-gourmet-amber/40 tracking-[0.4em]">Operations</span>
          </div>
          <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gourmet-cream/30 hover:text-gourmet-cream transition-all group">
            <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Universal Search
          </button>
        </nav> */}

        <div className="p-8 border-t border-white/5 bg-black/20 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gourmet-amber/10 border border-gourmet-amber/30 flex items-center justify-center shadow-inner group">
              <span className="text-gourmet-amber font-black text-lg group-hover:scale-110 transition-transform">{user.name?.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-black text-white serif italic">{user.name}</p>
                
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400 border border-red-400/20 hover:bg-red-400/10 hover:border-red-400/40 transition-all duration-300 group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gourmet-amber/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto p-12 relative z-10">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div className="animate-in fade-in slide-in-from-left-10 duration-700">
              <h1 className="text-5xl font-black text-gourmet-charcoal tracking-tight serif mb-3 italic">
                {activeTab === 'knowledge' ? 'Admin Dashboard' : activeTab === 'restaurants' ? 'Curated Registry' : 'System Configuration'}
              </h1>
              <p className="text-gourmet-charcoal/50 serif italic text-lg leading-relaxed">Defining the core essence of the Adama hospitality experience.</p>
            </div>
            
            <div className="flex gap-4">
               {/* Activity indicators reserved for future system metrics */}
            </div>
          </header>

          {activeTab === 'knowledge' ? (
            <div className="space-y-12">
              {/* Refined Upload Area */}
              <div className="gradient-bg rounded-[3rem] p-1 shadow-2xl amber-glow animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100">
                <div className="bg-gourmet-cream/5 backdrop-blur-3xl rounded-[2.9rem] p-16 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-gourmet-amber/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative z-10">
                    <div className="bg-gourmet-amber w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl amber-glow group-hover:scale-110 transition-transform duration-700 group-hover:rotate-6">
                      {isUploading ? (
                        <Loader2 className="text-gourmet-charcoal w-10 h-10 animate-spin" />
                      ) : (
                        <Upload className="text-gourmet-charcoal w-10 h-10" />
                      )}
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4 serif italic">Import New Hotel Information</h3>
                    <p className="text-gourmet-cream/50 text-base serif italic max-w-md mx-auto mb-12">
                      Upload PDF or TXT brochures, policy documents, or amenity lists to evolve the AI's understanding.
                    </p>
                    <input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} accept=".pdf,.txt" />
                    <label 
                      htmlFor="file-upload" 
                      className={`inline-flex items-center gap-3 cursor-pointer bg-gourmet-amber text-gourmet-charcoal px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-gourmet-gold shadow-2xl amber-glow ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {isUploading ? 'Processing Essence...' : 'Select Document'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Enhanced Documents Table */}
              <div className="glass-card rounded-[3rem] overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
                <div className="p-10 border-b border-gourmet-amber/5 flex justify-between items-center bg-white/40">
                  <div className="flex items-center gap-4">
                    <div className="bg-gourmet-charcoal p-2 rounded-xl">
                      <FileText className="text-gourmet-amber w-5 h-5" />
                    </div>
                    <h3 className="font-black text-xl text-gourmet-charcoal serif">Recent Archives</h3>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gourmet-charcoal/40 bg-gourmet-charcoal/5 px-4 py-2 rounded-full border border-gourmet-charcoal/5">
                    {documents.length} Records Found
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gourmet-charcoal/5 text-[9px] uppercase font-black text-gourmet-charcoal/60 tracking-[0.3em]">
                      <tr>
                        <th className="px-10 py-6">Identity</th>
                        <th className="px-10 py-6">Genre</th>
                        <th className="px-10 py-6">Inscribed On</th>
                        <th className="px-10 py-6 text-right">Maitre d' Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gourmet-charcoal/5">
                      {isLoading ? (
                        <tr>
                          <td colSpan={4} className="px-10 py-24 text-center">
                            <Loader2 className="w-12 h-12 animate-spin text-gourmet-amber mx-auto" />
                          </td>
                        </tr>
                      ) : documents.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-10 py-24 text-center">
                            <p className="text-gourmet-charcoal/40 serif italic text-xl">The archive is currently empty...</p>
                          </td>
                        </tr>
                      ) : documents.map((doc) => (
                        <tr key={doc._id} className="hover:bg-white/60 transition-all duration-300 group">
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-5">
                              <div className="bg-gourmet-cream border border-gourmet-amber/20 p-3 rounded-2xl text-gourmet-amber shadow-sm group-hover:scale-110 transition-transform">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="block text-base font-black text-gourmet-charcoal tracking-tight leading-tight mb-1">{doc.title}</span>
                                <span className="text-[10px] text-gourmet-charcoal/40 font-black uppercase tracking-widest">Digital Asset</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                             <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-gourmet-charcoal text-gourmet-amber border border-gourmet-amber/20">
                              {doc.category}
                             </span>
                          </td>
                          <td className="px-10 py-8 text-sm text-gourmet-charcoal/50 font-medium serif italic">
                            {new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-10 py-8 text-right">
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleDeleteDoc(doc._id)}
                                className="p-3 bg-red-50 hover:bg-red-500 rounded-2xl text-red-500 hover:text-white transition-all shadow-sm hover:shadow-red-500/20"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'restaurants' ? (
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 text-center py-40 glass-card rounded-[4rem] amber-glow">
              <Utensils className="w-24 h-24 text-gourmet-amber/20 mx-auto mb-8 animate-bounce transition-all duration-3000" />
              <h3 className="text-4xl font-black text-gourmet-charcoal mb-4 serif italic">Restaurant Registry</h3>
              <p className="text-gourmet-charcoal/40 serif italic text-xl max-w-lg mx-auto">This section of the archive is perfectly preserved in its current state. Dynamic modifications will be enabled in the next chapter.</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 text-center py-40 glass-card rounded-[4rem] amber-glow">
              <Settings className="w-24 h-24 text-gourmet-amber/20 mx-auto mb-8 animate-spin-slow" />
              <h3 className="text-4xl font-black text-gourmet-charcoal mb-4 serif italic">System Elegance</h3>
              <p className="text-gourmet-charcoal/40 serif italic text-xl max-w-lg mx-auto">Fine-tuning the gastronomic engine parameters. Coming soon.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
