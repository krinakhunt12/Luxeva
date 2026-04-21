import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Instagram } from 'lucide-react';

const locations = [
  { 
    city: "Mumbai", 
    name: "Flagship Atelier", 
    address: "123 Minimalist Way, Design District, MH 400001",
    hours: "11:00 AM — 08:00 PM",
    phone: "+91 22 4567 8901",
    services: ["Personal Styling", "Made-to-Measure", "Heritage Archive"],
    image: "https://images.unsplash.com/photo-1582037928869-676554628ec3?q=80&w=800&auto=format&fit=crop"
  },
  { 
    city: "New Delhi", 
    name: "Capital Emporium", 
    address: "Square 45, DLF Phase V, DL 110001",
    hours: "10:30 AM — 09:00 PM",
    phone: "+91 11 2345 6789",
    services: ["Styling Lounge", "Alteration Studio", "Click & Collect"],
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop"
  }
];

export default function StoreLocations() {
  return (
    <div className="pt-40 pb-24 bg-bg">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-20"
        >
          <div className="text-center space-y-6">
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold inline-block mb-2">Our Boutiques</span>
            <h1 className="text-6xl md:text-8xl font-light uppercase tracking-tighter leading-none">Visit Our <br /> <span className="italic font-serif normal-case tracking-normal">Spaces</span></h1>
            <p className="text-muted text-sm md:text-base font-light italic max-w-xl mx-auto">
              Luxury is tactile. Discover our collections in environments designed for reflection and discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            {locations.map((loc, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="space-y-10 group"
              >
                <div className="aspect-[16/9] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-[1.5s] rounded-sm relative shadow-2xl">
                   <div className="absolute inset-0 border border-primary/10 pointer-events-none z-10" />
                   <img src={loc.image} alt={loc.name} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
                </div>

                <div className="space-y-8 px-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <span className="text-[10px] uppercase tracking-[0.4em] font-black text-gold block">{loc.city}</span>
                       <h3 className="text-3xl font-light uppercase tracking-widest text-primary">{loc.name}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 py-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-muted">
                        <MapPin size={14} className="text-gold" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Address</span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed font-light">{loc.address}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-muted">
                        <Phone size={14} className="text-gold" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Inquiries</span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed font-light">{loc.phone}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 py-4 border-y border-accent">
                    {loc.services.map(s => (
                      <span key={s} className="px-3 py-1 bg-white border border-accent text-[8px] uppercase tracking-[0.2em] font-bold text-muted transition-colors hover:border-gold hover:text-gold">{s}</span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-6">
                       <button className="text-[10px] uppercase tracking-[0.3em] font-black border-b-2 border-primary pb-2 hover:text-gold hover:border-gold transition-all">Directions</button>
                       <button className="text-[10px] uppercase tracking-[0.3em] font-black border-b-2 border-primary pb-2 hover:text-gold hover:border-gold transition-all">Book Visit</button>
                    </div>
                    <button className="p-2 border border-accent rounded-full hover:bg-gold hover:text-white transition-colors duration-500">
                      <Instagram size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Global Search Meta section */}
          <div className="bg-primary p-20 text-center text-white space-y-8 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
             <div className="relative z-10 space-y-6">
                <h2 className="text-3xl md:text-5xl font-light uppercase tracking-tighter italic font-serif">Global Stockists</h2>
                <p className="text-muted text-xs uppercase tracking-[0.3em] font-light max-w-xl mx-auto">Available in London, Paris, Tokyo through selected digital and physical department stores.</p>
                <div className="pt-6">
                  <button className="bg-gold text-primary px-12 py-5 text-[10px] uppercase tracking-widest font-black hover:bg-white transition-all">Full Stockist List</button>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
