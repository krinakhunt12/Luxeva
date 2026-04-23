import React, { useState } from 'react';
import { useContacts, useDeleteContact, useResolveContact, ContactSubmission } from '../../contact/hooks/useContact';
import { Search, Eye, CheckCircle, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Skeleton from '../../../components/ui/Skeleton';

export default function InquiriesPage() {
  const { data: contacts = [], isLoading } = useContacts();
  const deleteContactMut = useDeleteContact();
  const resolveContactMut = useResolveContact();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingContact, setViewingContact] = useState<ContactSubmission | null>(null);

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-light uppercase tracking-widest">Contact Inquiries</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
          <input 
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-accent pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-white border border-accent overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-accent/30 border-b border-accent">
            <tr>
              <th className="p-4 text-[10px] uppercase tracking-widest font-bold">User</th>
              <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Subject</th>
              <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Date</th>
              <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Status</th>
              <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} className="p-4"><Skeleton className="h-10 w-full" /></td>
                </tr>
              ))
            ) : filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-20 text-center text-muted text-xs uppercase tracking-widest">
                  No inquiries found
                </td>
              </tr>
            ) : (
              filteredContacts.map((c) => (
                <tr key={c._id} className="hover:bg-accent/10 transition-colors">
                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium">{c.name}</p>
                      <p className="text-[10px] text-muted">{c.email}</p>
                      {c.phone && <p className="text-[10px] text-muted">{c.phone}</p>}
                    </div>
                  </td>
                  <td className="p-4 text-xs font-medium uppercase tracking-widest">{c.subject}</td>
                  <td className="p-4 text-xs text-muted">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-bold rounded-full ${c.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-gold/10 text-gold'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setViewingContact(c)}
                        className="p-2 text-muted hover:text-primary transition-colors"
                        title="View Message"
                      >
                        <Eye size={16} />
                      </button>
                      {c.status !== 'resolved' && (
                        <button 
                          onClick={() => resolveContactMut.mutate(c._id)}
                          className="p-2 text-muted hover:text-green-600 transition-colors"
                          title="Mark as Resolved"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          if (window.confirm('Delete this inquiry?')) {
                            deleteContactMut.mutate(c._id);
                          }
                        }}
                        className="p-2 text-muted hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inquiry Detail Modal */}
      <AnimatePresence>
        {viewingContact && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingContact(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white border border-accent w-full max-w-lg p-10 shadow-2xl"
            >
              <button 
                onClick={() => setViewingContact(null)}
                className="absolute top-6 right-6 text-muted hover:text-primary"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-light uppercase tracking-widest mb-8">
                Inquiry Detail
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">From</p>
                    <p className="text-sm font-medium">{viewingContact.name}</p>
                    <p className="text-xs text-muted">{viewingContact.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Date</p>
                    <p className="text-xs">{new Date(viewingContact.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {viewingContact.phone && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Phone</p>
                    <p className="text-xs">{viewingContact.phone}</p>
                  </div>
                )}

                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Subject</p>
                  <p className="text-sm font-medium uppercase tracking-widest">{viewingContact.subject}</p>
                </div>

                <div className="bg-bg p-6 border border-accent">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-4">Message</p>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{viewingContact.message}</p>
                </div>

                <div className="flex gap-4 pt-4">
                  {viewingContact.status !== 'resolved' && (
                    <button 
                      onClick={() => {
                        resolveContactMut.mutate(viewingContact._id);
                        setViewingContact(null);
                      }}
                      className="flex-1 bg-primary text-white py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors"
                    >
                      Mark as Resolved
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (window.confirm('Delete this inquiry?')) {
                        deleteContactMut.mutate(viewingContact._id);
                        setViewingContact(null);
                      }
                    }}
                    className="px-6 border border-accent text-muted hover:text-red-500 hover:border-red-500 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
