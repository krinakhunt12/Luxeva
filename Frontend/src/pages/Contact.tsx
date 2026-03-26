import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const sendMessage = async (payload: any) => {
  const res = await fetch('http://localhost:4000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
};

export default function Contact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: '' });
  const mutation = useMutation({ mutationFn: sendMessage });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input name="firstName" label="First Name" value={form.firstName} onChange={handleChange} />
                <Input name="lastName" label="Last Name" value={form.lastName} onChange={handleChange} />
              </div>
              <Input name="email" label="Email Address" type="email" value={form.email} onChange={handleChange} />
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Subject</label>
                <select name="subject" value={form.subject} onChange={handleChange} className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors">
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Returns & Exchanges</option>
                  <option>Wholesale</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={6} className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
              </div>

              <Button type="submit" disabled={mutation.isLoading}>{mutation.isLoading ? 'Sending...' : 'Send Message'}</Button>

              {mutation.isError && <p className="text-red-600 text-sm">Failed to send message.</p>}
              {mutation.isSuccess && <p className="text-green-600 text-sm">Message sent. We'll reply shortly.</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
