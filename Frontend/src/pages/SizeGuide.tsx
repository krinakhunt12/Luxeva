import React from 'react';
import { motion } from 'motion/react';
import { Ruler, Scissors, User } from 'lucide-react';

export default function SizeGuide() {
  return (
    <div className="pt-40 pb-24 bg-bg">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-20"
        >
          <div className="text-center space-y-6">
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold inline-block mb-2">Precision Fit</span>
            <h1 className="text-6xl md:text-8xl font-light uppercase tracking-tighter leading-none">Size <br /> <span className="italic font-serif normal-case tracking-normal">Guide</span></h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="md:col-span-1 space-y-12">
              <section className="space-y-6">
                <div className="flex items-center gap-4 text-gold">
                  <Ruler size={20} />
                  <h3 className="text-[10px] uppercase tracking-widest font-black text-primary">How to measure</h3>
                </div>
                <div className="space-y-8">
                  {[
                    { title: "Bust", desc: "Measure around the fullest part of your chest, keeping the tape level across the back." },
                    { title: "Waist", desc: "Measure the narrowest point of your natural waistline, usually just above the navel." },
                    { title: "Hip", desc: "Standing with feet together, measure around the fullest part of your hips." }
                  ].map(item => (
                    <div key={item.title} className="space-y-2">
                       <h4 className="text-[10px] uppercase tracking-widest font-bold text-primary">{item.title}</h4>
                       <p className="text-xs text-muted leading-relaxed font-light">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="p-8 border border-accent bg-white space-y-4">
                <div className="flex items-center gap-3 text-gold">
                  <Scissors size={16} />
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-primary">Atelier Tip</h4>
                </div>
                <p className="text-[10px] text-muted italic leading-loose">
                  Our silhouettes are designed for an elegant, fluid fit. If you find yourself between two sizes, we recommend selecting the larger size for a true Luxeva drape.
                </p>
              </div>
            </div>

            <main className="md:col-span-2 space-y-12">
              <div className="bg-white border border-accent overflow-hidden shadow-sm">
                <div className="p-8 border-b border-accent bg-bg/50">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-primary">Conversion Metrics (cm)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs uppercase tracking-widest">
                    <thead className="bg-bg/20 text-muted border-b border-accent">
                      <tr>
                        <th className="px-8 py-6 font-bold">Label</th>
                        <th className="px-8 py-6 font-bold text-center">Bust</th>
                        <th className="px-8 py-6 font-bold text-center">Waist</th>
                        <th className="px-8 py-6 font-bold text-center">Hip</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-accent/50 font-light">
                      {[
                        { s: "XS", b: "80-84", w: "60-64", h: "86-90" },
                        { s: "S", b: "85-89", w: "65-69", h: "91-95" },
                        { s: "M", b: "90-94", w: "70-74", h: "96-100" },
                        { s: "L", b: "95-99", w: "75-79", h: "101-105" },
                        { s: "XL", b: "100-104", w: "80-84", h: "106-110" }
                      ].map(row => (
                        <tr key={row.s} className="hover:bg-bg transition-colors duration-300">
                          <td className="px-8 py-6 font-bold text-primary">{row.s}</td>
                          <td className="px-8 py-6 text-center text-muted">{row.b}</td>
                          <td className="px-8 py-6 text-center text-muted">{row.w}</td>
                          <td className="px-8 py-6 text-center text-muted">{row.h}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-4 items-start p-10 bg-primary text-white">
                <User size={20} className="text-gold shrink-0 mt-1" />
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-gold">Personal Fit Consultation</h4>
                  <p className="text-xs font-light text-gray-400 leading-relaxed">
                    Unsure of your size? Our master tailors are available for digital fit consultations via video call. Book your session through our Concierge team.
                  </p>
                </div>
              </div>
            </main>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
