
import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, Edit3, FileText, Database, Settings, ShieldCheck, Search, Image as ImageIcon, MapPin, Utensils, Loader2 } from 'lucide-react';
import { getDocuments, uploadDocument, deleteDocument } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'restaurants'>('knowledge');
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('foodToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center gap-2">
          <ShieldCheck className="text-indigo-600 w-6 h-6" />
          <span className="font-bold text-lg tracking-tight">Admin Central</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('knowledge')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'knowledge' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Database className="w-4 h-4" />
            Knowledge Base
          </button>
          <button 
            onClick={() => setActiveTab('restaurants')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'restaurants' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Restaurants
          </button>
          <div className="pt-4 pb-2 px-4">
             <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Settings</span>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900">
            <Settings className="w-4 h-4" />
            Global Config
          </button>
        </nav>
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-bold">{user.name?.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">{user.name}</p>
              <p className="text-[10px] text-gray-500 uppercase">{user.role} Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {activeTab === 'knowledge' ? 'Knowledge Base' : 'Restaurant Directory'}
            </h1>
            <p className="text-gray-500 mt-1">Manage the core data powering the AI assistant.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input 
                type="text" 
                placeholder="Search everything..." 
                className="bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
               />
            </div>
          </div>
        </header>

        {activeTab === 'knowledge' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Upload Area */}
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center transition-all hover:border-indigo-300 hover:bg-indigo-50/30 group">
              <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                {isUploading ? (
                  <Loader2 className="text-indigo-600 w-8 h-8 animate-spin" />
                ) : (
                  <Upload className="text-indigo-600 w-8 h-8" />
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">Upload Knowledge Documents</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8">
                PDF or TXT files containing menu details, reviews, or restaurant descriptions. Max 10MB per file.
              </p>
              <input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} accept=".pdf,.txt" />
              <label htmlFor="file-upload" className={`cursor-pointer bg-white border border-gray-200 px-8 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {isUploading ? 'Uploading...' : 'Select File'}
              </label>
            </div>

            {/* Documents Table */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Recent Uploads</h3>
                <span className="text-xs text-gray-400 font-medium">{documents.length} Total Files</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Document Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Upload Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                        </td>
                      </tr>
                    ) : documents.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 text-sm">
                          No documents found. Upload a file to get started.
                        </td>
                      </tr>
                    ) : documents.map((doc) => (
                      <tr key={doc._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                              <FileText className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{doc.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-600">
                            {doc.category}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleDeleteDoc(doc._id)}
                              className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
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
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 text-center py-20">
            <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">Restaurant Directory Integration</h3>
            <p className="text-gray-500 text-sm">This module is currently read-only and uses static data.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
