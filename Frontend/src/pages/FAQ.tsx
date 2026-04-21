import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, MessageSquare } from 'lucide-react';

const faqData = [
  {
    category: "Orders & Fulfillment",
    questions: [
      { q: "How do I track my Luxeva package?", a: "Once dispatched, you will receive an SMS and email with a unique tracking link from our premium logistics partner." },
      { q: "Can I redirect a package in transit?", a: "To ensure absolute security, address changes are not permitted once the package has physically left our warehouse." },
      { q: "What if my item arrives with a defect?", a: "Contact our quality team within 48 hours for immediate replacement under our 'Pristine Guarantee'." }
    ]
  },
  {
    category: "Product & Experience",
    questions: [
      { q: "Are your materials sustainable?", a: "Yes. 90% of our textiles are GOTS certified organic or recycled from luxury post-consumer waste." },
      { q: "How do I ensure the perfect fit?", a: "Each product page features exact garment measurements. You can also book a virtual styling session via our contact page." },
      { q: "Do you offer bespoke tailoring?", a: "We offer complimentary hems and sleeves shortening for our 'Signature' range at our flagship boutiques." }
    ]
  },
  {
    category: "Payments & Security",
    questions: [
      { q: "Which payment methods are accepted?", a: "We accept all major global credit cards, UPI, and bank transfers through our secure PCI-DSS encrypted gateways." },
      { q: "Is international billing available?", a: "Yes, we support multi-currency billing and international payment methods via our global checkout partner." }
    ]
  }
];

export default function FAQ() {
  return (
    <div className="pt-40 pb-24 bg-bg">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-20"
        >
          <div className="text-center space-y-6">
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold inline-block mb-2">Knowledge Base</span>
            <h1 className="text-6xl md:text-8xl font-light uppercase tracking-tighter leading-none">Common <br /> <span className="italic font-serif normal-case tracking-normal">Inquiries</span></h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <aside className="lg:col-span-4 space-y-8">
              <div className="bg-primary text-white p-12 border border-accent relative overflow-hidden group">
                <HelpCircle size={120} className="absolute -bottom-10 -right-10 text-white/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10 space-y-6">
                  <h3 className="text-xl font-light uppercase tracking-tighter text-gold">Still Have <br /> Questions?</h3>
                  <p className="text-xs font-light text-gray-400 leading-relaxed shadow-sm">
                    Our concierge team is available 24/7 to assist with your journey.
                  </p>
                  <button className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-black text-white border-b border-white/20 pb-2 hover:text-gold hover:border-gold transition-all">
                    <MessageSquare size={14} />
                    Live Chat
                  </button>
                </div>
              </div>

              <div className="p-10 border border-accent bg-white flex flex-col items-center text-center space-y-4">
                 <h4 className="text-[10px] uppercase tracking-widest font-black text-primary">Need a Human?</h4>
                 <p className="text-xs text-muted font-light leading-relaxed font-serif italic">
                   "We pride ourselves on personal connections."
                 </p>
                 <a href="mailto:support@luxeva.com" className="text-xs uppercase tracking-widest font-bold border-b border-primary pb-1 pt-4">Email Us</a>
              </div>
            </aside>

            <main className="lg:col-span-8 space-y-24">
              {faqData.map((section, idx) => (
                <section key={idx} className="space-y-12">
                   <h3 className="text-primary text-xs uppercase tracking-[0.4em] font-black border-b border-accent pb-4 flex items-center justify-between">
                     {section.category}
                     <span className="text-gold font-serif italic normal-case tracking-normal">{String(idx + 1).padStart(2, '0')}</span>
                   </h3>
                   <div className="space-y-12">
                     {section.questions.map((item, i) => (
                       <div key={i} className="group space-y-3">
                         <h4 className="text-lg font-light text-primary group-hover:text-gold transition-colors duration-300">
                           {item.q}
                         </h4>
                         <p className="text-muted text-sm font-light leading-loose max-w-2xl">
                           {item.a}
                         </p>
                       </div>
                     ))}
                   </div>
                </section>
              ))}
            </main>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
