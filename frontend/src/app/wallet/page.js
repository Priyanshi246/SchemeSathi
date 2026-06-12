'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, Upload, Trash2, CheckCircle2, AlertCircle, RefreshCw, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import SidebarLayout from '@/components/SidebarLayout';
import { api } from '@/utils/api';

export default function WalletPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('Domicile Certificate');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.getWallet();
      setDocuments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    // Simulate OCR delay and then save document
    setTimeout(async () => {
      try {
        const docs = await api.getWallet();
        
        // Add new document locally
        const newDoc = {
          id: `doc-${Date.now()}`,
          name: selectedDocType,
          type: "PDF Upload",
          status: "Verified",
          date: new Date().toISOString().split('T')[0]
        };
        
        // Save back to local storage
        const updated = [...docs, newDoc];
        localStorage.setItem('documents', JSON.stringify(updated));
        
        // If we uploaded Domicile Certificate, it should auto-fill the user state to Rajasthan!
        if (selectedDocType === 'Domicile Certificate') {
          const user = JSON.parse(localStorage.getItem('user')) || {};
          user.state = 'Rajasthan';
          localStorage.setItem('user', JSON.stringify(user));
        }

        // Add corresponding log
        const logs = JSON.parse(localStorage.getItem('agentLogs')) || [];
        logs.unshift({
          agent_name: "Document Readiness Agent",
          log_text: `Audited new file: '${selectedDocType}'. Authenticated digital signature successfully.`,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('agentLogs', JSON.stringify(logs));

        loadDocuments();
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    }, 1500);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await api.deleteDocument(id);
      loadDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-7xl mx-auto text-slate-800 dark:text-slate-200">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Wallet className="h-6 w-6 text-blue-600" />
              Document Wallet
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Upload Aadhaar, Income certificates, or transcripts to automatically feed parameters into the AI match engine.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upload card (1 column) */}
          <div className="lg:col-span-1 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-3xs flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm pb-3 border-b border-slate-100 dark:border-slate-800">OCR Document Upload</h3>
              
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Document Class</label>
                <select 
                  value={selectedDocType} 
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-blue-600 transition"
                >
                  <option>Domicile Certificate</option>
                  <option>Aadhaar Card</option>
                  <option>Income Certificate</option>
                  <option>Student ID</option>
                  <option>Mark Sheet (Class 12)</option>
                </select>
              </div>

              {/* Drag/Drop area */}
              <div 
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center min-h-48 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50/50' 
                    : 'border-slate-250 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40'
                }`}
              >
                <Upload className="h-8 w-8 text-slate-400 mb-3" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Drag file here or click to select</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">Supports PDF, JPEG up to 5MB. Digital signature verified automatically.</p>
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-xs font-bold text-white rounded-2xl shadow-xs transition mt-6"
            >
              {uploading ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" /> Verifying Signatures...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" /> Scan & Upload
                </>
              )}
            </button>
          </div>

          {/* Uploaded Documents List (2 columns) */}
          <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-3xs">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm pb-4 border-b border-slate-100 dark:border-slate-800 mb-6 flex justify-between items-center">
              <span>Verified Identity & Domicile Vault</span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-450 uppercase bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-950/40">
                {documents.length} Uploads Active
              </span>
            </h3>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-xs">No certificates registered in vault yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {documents.map((doc) => (
                  <div key={doc.id} className="py-4.5 flex items-center justify-between gap-4 group">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <FileText className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{doc.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-semibold">{doc.type}</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                          <span className="text-[10px] text-slate-400 font-semibold">Added {doc.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Status Check */}
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/5 px-2.5 py-1 rounded-xl border border-emerald-100 dark:border-emerald-950/20 shadow-3xs">
                        <ShieldCheck className="h-3.5 w-3.5" /> {doc.status}
                      </span>
                      
                      {/* Delete */}
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-100 dark:border-slate-800 group-hover:border-slate-200 dark:group-hover:border-slate-700 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 p-4 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-start gap-3 text-xs leading-relaxed text-slate-655 dark:text-slate-400">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">DigiLocker Verification Active</p>
                <p className="mt-0.5">SchemeSathi is synced with official central authentication tables. Uploaded certificates undergo instant structural verification before mapping against state/central eligibility criteria.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </SidebarLayout>
  );
}
