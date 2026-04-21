import React from 'react';
import { motion } from 'motion/react';
import { RefreshCcw, Mail, Package, CheckCircle } from 'lucide-react';

export default function ReturnsPolicy() {
  return (
    <div className="pt-40 pb-24 bg-bg">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-20"
        >
          <div className="text-center space-y-6">
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold inline-block mb-2">Concierge Care</span>
            <h1 className="text-6xl md:text-8xl font-light uppercase tracking-tighter leading-none">Returns <br /> & <span className="italic font-serif normal-case tracking-normal">Exchanges</span></h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <aside className="lg:col-span-4 space-y-8">
              <div className="bg-white p-10 border border-accent shadow-sm space-y-8">
                <h4 className="text-[10px] uppercase tracking-widest font-black text-primary">At a Glance</h4>
                <div className="space-y-6">
                  {[
                    { label: "Return Window", value: "14 Days" },
                    { label: "Restocking Fee", value: "None" },
                    { label: "Audit Period", value: "48 Hours" },
                    { label: "Refund Speed", value: "5-7 Days" }
                  ].map(stat => (
                    <div key={stat.label} className="flex justify-between items-end border-b border-accent pb-2">
                      <span className="text-[10px] uppercase tracking-widest text-muted">{stat.label}</span>
                      <span className="text-sm font-bold text-primary">{stat.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted leading-relaxed italic pt-4">
                  "Our garments are designed to last decades. If your selection isn't perfect, we facilitate a seamless transition."
                </p>
              </div>

              <div className="p-10 border border-gold/10 bg-gold/5 flex gap-4">
                <Mail size={16} className="text-gold shrink-0" />
                <div className="space-y-2">
                  <h5 className="text-[10px] uppercase tracking-widest font-bold text-gold">Need Help?</h5>
                  <p className="text-xs font-light text-muted">concierge@luxeva.com</p>
                </div>
              </div>
            </aside>

            <main className="lg:col-span-8 space-y-16">
              <section className="space-y-8">
                <h3 className="text-primary text-xl uppercase tracking-tighter font-light">The Exchange Protocol</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: <Mail />, title: "Contact", desc: "Notify our atelier team for a Return Authorization (RA) number." },
                    { icon: <Package />, title: "Secure", desc: "Pack in original Luxeva box with all security tags intact." },
                    { icon: <CheckCircle />, title: "Audit", desc: "Our quality team verifies the piece before credit issuance." }
                  ].map((item, i) => (
                    <div key={i} className="space-y-4">
                      <div className="text-gold">{item.icon}</div>
                      <h4 className="text-[10px] uppercase tracking-widest font-black">{item.title}</h4>
                      <p className="text-[11px] font-light text-muted leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="h-[1px] bg-accent w-full" />

              <section className="space-y-8 font-light text-muted leading-relaxed text-sm">
                <h3 className="text-primary text-xl uppercase tracking-tighter font-light text-primary">Condition Requirements</h3>
                <p>To maintain our standards of hygiene and quality, all returns must meet the following criteria:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                  <li className="flex gap-3 items-center text-xs"><RefreshCcw size={12} className="text-gold" /> Unworn and unwashed state</li>
                  <li className="flex gap-3 items-center text-xs"><RefreshCcw size={12} className="text-gold" /> Original security tags attached</li>
                  <li className="flex gap-3 items-center text-xs"><RefreshCcw size={12} className="text-gold" /> Free of scents, makeup, or oils</li>
                  <li className="flex gap-3 items-center text-xs"><RefreshCcw size={12} className="text-gold" /> All original branded packaging</li>
                </ul>
              </section>

              <div className="p-10 bg-primary text-white space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-gold">The 'Final Sale' Exception</h4>
                <p className="text-xs font-light leading-loose text-gray-400">
                  Custom-tailored silhouettes, personalized monograms, and delicate evening-wear marked as 'Final Sale' are ineligible for return unless a genuine craft defect is verified by our master tailor.
                </p>
              </div>
            </main>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
