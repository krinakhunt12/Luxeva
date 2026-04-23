import React, { useState } from 'react';
import { useContact } from '../features/contact/hooks/useContact';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { showError, showSuccess } from '../utils/toastService';

export default function Contact() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    subject: 'General Inquiry', 
    message: '' 
  });
  
  const { mutate, isPending } = useContact();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Robust validation
    if (!form.name.trim()) {
      showError('Please enter your full name');
      return;
    }
    if (!form.email.trim()) {
      showError('Please enter your email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showError('Please enter a valid email address');
      return;
    }
    if (!form.message.trim()) {
      showError('Please enter your message');
      return;
    }
    
    mutate(form, {
      onSuccess: () => {
        setForm({ 
          name: '', 
          email: '', 
          phone: '', 
          subject: 'General Inquiry', 
          message: '' 
        });
      }
    });
  };

  return (
    <div className="pt-32 pb-20 bg-bg">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold">Contact Us</span>
              <h1 className="text-6xl font-light tracking-tighter uppercase leading-[0.8]">Get in <br /> <span className="italic font-serif">Touch</span></h1>
              <p className="text-muted text-lg leading-relaxed max-w-md">Whether you have a question about sizing, shipping, or just want to say hello, we'd love to hear from you.</p>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4">Customer Care</h4>
                <p className="text-sm text-muted">support@luxeva.com</p>
                <p className="text-sm text-muted">+91 98765 43210</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-accent p-12 shadow-sm">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <Input 
                name="name" 
                label="Full Name" 
                value={form.name} 
                onChange={handleChange} 
                required 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input 
                  name="email" 
                  label="Email Address" 
                  type="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                />
                <Input 
                  name="phone" 
                  label="Phone Number" 
                  type="tel" 
                  value={form.phone} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-[10px] uppercase tracking-widest font-bold">Subject</label>
                <select 
                  id="subject" 
                  name="subject" 
                  value={form.subject} 
                  onChange={handleChange} 
                  className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors"
                >
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Returns & Exchanges</option>
                  <option>Wholesale</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Message</label>
                <textarea 
                  name="message" 
                  value={form.message} 
                  onChange={handleChange} 
                  rows={6} 
                  required
                  className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors resize-none"
                ></textarea>
              </div>

              <Button type="submit" disabled={isPending}>{isPending ? 'Sending...' : 'Send Message'}</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
