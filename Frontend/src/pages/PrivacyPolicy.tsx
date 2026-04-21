import React from 'react';
import { motion } from 'motion/react';
import { Shield, Eye, Lock } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-40 pb-24 bg-bg">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="space-y-20 font-light"
        >
          <header className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-light uppercase tracking-tighter leading-none text-primary">Data <br /> <span className="italic font-serif normal-case tracking-normal">Custody</span></h1>
            <p className="text-muted leading-loose text-lg max-w-2xl font-light">
              At Luxeva, your digital identity is treated with the same reverence as our physical garments. We act as stewards, not owners, of your personal narrative.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-y border-accent py-16 text-center">
            <div className="space-y-4">
              <Eye size={24} className="text-gold mx-auto" />
              <h4 className="text-[10px] uppercase tracking-widest font-black">Transparency</h4>
              <p className="text-xs text-muted leading-relaxed font-light">Zero hidden tracking. Every data point we collect is visible to you.</p>
            </div>
            <div className="space-y-4">
              <Lock size={24} className="text-gold mx-auto" />
              <h4 className="text-[10px] uppercase tracking-widest font-black">Zero Trading</h4>
              <p className="text-xs text-muted leading-relaxed font-light">We never barter your details. Your data stays within the Luxeva ecosystem.</p>
            </div>
            <div className="space-y-4">
              <Shield size={24} className="text-gold mx-auto" />
              <h4 className="text-[10px] uppercase tracking-widest font-black">Erasure Rights</h4>
              <p className="text-xs text-muted leading-relaxed font-light">Total digital autonomy. Delete your profile and records at any time.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 leading-loose text-muted">
             <aside className="lg:col-span-4 space-y-8">
                <div className="bg-white p-12 border border-accent">
                   <h5 className="text-[10px] uppercase tracking-[0.2em] font-black text-primary mb-6">Quick Contacts</h5>
                   <div className="space-y-6">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted mb-1 font-bold">DPO Officer</p>
                        <p className="text-xs text-primary font-bold">dpo@luxeva.com</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted mb-1 font-bold">Privacy Hotline</p>
                        <p className="text-xs text-primary font-bold">+91 22 PRIVACY</p>
                      </div>
                   </div>
                </div>
             </aside>

             <main className="lg:col-span-8 space-y-12 text-sm">
                {[
                  { 
                    title: "Information Stewardship", 
                    content: "We collect essential data—name, email, shipping coordinates, and biometric sizing (if utilized)—to curate a seamless shopping journey. This data is housed on encrypted, SOC2-compliant servers with strict access controls."
                  },
                  { 
                    title: "Cookies & Sessions", 
                    content: "We utilize 'essential cookies' strictly to maintain your session, keep items in your cart, and remember your regional preferences. We do not use third-party behavioral tracking pixels or social media harvest tools."
                  },
                  { 
                    title: "Financial Security", 
                    content: "Financial data is never stored on Luxeva servers. Payments are processed through industry leaders (Stripe, Razorpay) featuring bank-grade 256-bit encryption. We only receive a transaction confirmation token."
                  },
                  { 
                    title: "Your Governance", 
                    content: "You reserve the absolute right to access, rectify, or demand the permanent erasure of your personal data. Our compliance team handles such requests within 72 business hours."
                  }
                ].map((section, idx) => (
                  <section key={idx} className="space-y-4">
                    <h3 className="text-primary text-[10px] uppercase tracking-[0.3em] font-black">{idx + 1}. {section.title}</h3>
                    <p className="font-light">{section.content}</p>
                  </section>
                ))}
             </main>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
