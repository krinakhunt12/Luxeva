import React from 'react';
import { motion } from 'motion/react';
import { Landmark, FileText, Gavel } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="pt-40 pb-24 bg-bg">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="space-y-20 font-light"
        >
          <header className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-light uppercase tracking-tighter leading-none text-primary">Terms of <br /> <span className="italic font-serif normal-case tracking-normal">Commerce</span></h1>
            <p className="text-muted leading-loose text-lg max-w-2xl font-light">
               The following stipulations govern the legal relationship between the collector and the Luxeva platform. Engagement denotes acceptance.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center py-12 border-y border-accent">
            {[
              { icon: <Landmark />, title: "Intellectual Assets" },
              { icon: <FileText />, title: "Contract Forms" },
              { icon: <Gavel />, title: "Jurisdiction" }
            ].map((item, i) => (
              <div key={i} className="space-y-3">
                 <div className="text-gold flex justify-center">{item.icon}</div>
                 <h4 className="text-[10px] uppercase tracking-widest font-black text-primary">{item.title}</h4>
              </div>
            ))}
          </div>

          <main className="grid grid-cols-1 lg:grid-cols-12 gap-20">
             <div className="lg:col-span-8 space-y-16 leading-loose text-muted text-sm">
                {[
                  { 
                    id: "I", 
                    title: "Creative Integrity & Assets", 
                    content: "All photographic imagery, textiles silhouettes, and brand narratives housed on Luxeva.com remain the exclusive intellectual capital of Luxeva Pvt. Ltd. Unauthorized commercial exploitation is strictly prohibited and subject to legal recourse."
                  },
                  { 
                    id: "II", 
                    title: "Order Authorization", 
                    content: "A digital receipt of purchase does not constitute a binding legal contract. Luxeva reserves the absolute right to decline orders due to stock discrepancies, pricing errors, or suspected illicit activity. In such events, a total reversal of funds is executed immediately."
                  },
                  { 
                    id: "III", 
                    title: "Ethical Procurement", 
                    content: "Our platform is designed for private collectors. We reserve the right to limit quantities or terminate access for entities identified as bulk resellers or automated bots."
                  },
                  { 
                    id: "IV", 
                    title: "Product Representation", 
                    content: "While we strive for chromatic accuracy, slight variations in color and texture may occur due to the organic nature of our textiles and differing digital displays."
                  },
                  { 
                    id: "V", 
                    title: "Legal Domain", 
                    content: "These terms are governed by the laws of India. Any disputes arising from usage are subject to the exclusive jurisdiction of the Courts of Mumbai."
                  }
                ].map(section => (
                  <section key={section.id} className="space-y-6">
                    <div className="flex items-center gap-4">
                       <span className="text-gold font-serif italic text-2xl">{section.id}</span>
                       <h3 className="text-primary text-[10px] uppercase tracking-[0.3em] font-black">{section.title}</h3>
                    </div>
                    <p className="font-light">{section.content}</p>
                  </section>
                ))}
             </div>

             <aside className="lg:col-span-4 space-y-8">
                <div className="bg-primary text-white p-10 border border-accent shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gold/5 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full" />
                  <div className="relative z-10 space-y-6">
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-gold">Latest Update</h4>
                    <p className="text-sm font-light leading-relaxed">Revision 4.2 <br /> Issued: April 2026</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-light">We advise a quarterly review of our commerce terms to remain informed of our operational standards.</p>
                  </div>
                </div>
             </aside>
          </main>

          <footer className="pt-20 border-t border-accent text-center">
             <p className="text-[10px] uppercase tracking-widest text-muted">© 2026 Luxeva Private Limited. All Rights Reserved.</p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
