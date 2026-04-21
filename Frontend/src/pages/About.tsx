import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import Skeleton from '../components/ui/Skeleton';
import { apiFetch } from '../utils/apiClient';
import { Star, Shield, Clock, Heart } from 'lucide-react';

const fetchAbout = async () => {
  return apiFetch('/api/pages/about').catch(() => null);
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
} as const;

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.2 }
} as const;

export default function About() {
  const { data, isLoading } = useQuery({ queryKey: ['aboutPage'], queryFn: fetchAbout });

  if (isLoading) return (
    <div className="pt-40 container mx-auto px-6">
      <Skeleton className="h-20 w-3/4 mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );

  return (
    <div className="bg-bg overflow-hidden">
      {/* Hero Section */}
      <section className="pt-40 pb-24 border-b border-accent">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] font-bold text-gold inline-block mb-2">Our Heritage</span>
            <h1 className="text-6xl md:text-8xl font-light uppercase tracking-tighter leading-none text-primary">
              Etching <br />
              <span className="italic font-serif normal-case tracking-normal">Style</span> in <br />
              History
            </h1>
            <p className="text-muted text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-serif italic pt-6">
              Founded on the principles of quiet luxury and uncompromising craft, Luxeva is more than a brand—it is a study in the art of the essential.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              {...fadeInUp}
              className="relative aspect-[4/5] overflow-hidden group shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop"
                alt="Craftsmanship"
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 transition-opacity duration-700 group-hover:opacity-0" />
            </motion.div>

            <div className="space-y-10">
              <motion.div {...fadeInUp} className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-light tracking-tight uppercase">The Philosophy</h2>
                <div className="h-1 w-20 bg-gold" />
              </motion.div>

              <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }} className="prose prose-sm text-muted leading-loose space-y-6">
                <p>
                  At the heart of Luxeva lies a commitment to the enduring. In a world of fast-paced trends and fleeting moments, we choose to look back at the traditions that stood the test of time, and forward to a future of sustainable elegance.
                </p>
                <p>
                  Our design language is one of reduction. We take away the unnecessary until only the soul of the garment remains. Every stitch is intentional; every fabric is chosen for its ability to age with grace.
                </p>
                <p>
                  We don't just dress individuals; we curator legacies. Each piece in our collection is designed to be passed down—a physical fragment of a lived experience.
                </p>
              </motion.div>

              <motion.div
                variants={stagger}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-8 pt-6"
              >
                {[
                  { label: "Founded", value: "2018" },
                  { label: "Artisans", value: "50+" },
                  { label: "Countries", value: "12" },
                  { label: "Happiness", value: "100%" }
                ].map((stat, i) => (
                  <motion.div key={i} variants={fadeInUp} className="space-y-1">
                    <p className="text-2xl font-light text-primary">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-widest text-gold font-bold">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 border-t border-accent">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-24 space-y-4">
            <h2 className="text-3xl md:text-5xl font-light uppercase tracking-tight">Our Core Values</h2>
            <p className="text-muted text-xs uppercase tracking-[0.3em]">The pillars that sustain us</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          >
            {[
              { icon: <Clock size={24} />, title: "Timelessness", desc: "Designing for the decades, not just the seasons." },
              { icon: <Shield size={24} />, title: "Integrity", desc: "Transparency in every thread, from source to store." },
              { icon: <Star size={24} />, title: "Excellence", desc: "Meticulous attention to detail in every hand-finished seam." },
              { icon: <Heart size={24} />, title: "Soul", desc: "Garments crafted with passion by master artisans." }
            ].map((value, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-white p-10 border border-accent hover:border-gold transition-colors duration-500 group text-center"
              >
                <div className="inline-block p-4 bg-bg text-gold mb-6 group-hover:bg-gold group-hover:text-white transition-colors duration-500 rounded-full">
                  {value.icon}
                </div>
                <h3 className="text-sm uppercase tracking-[0.2em] font-bold mb-4">{value.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-32 bg-primary text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <motion.h2 {...fadeInUp} className="text-4xl md:text-6xl font-light uppercase leading-tight">
                Crafted by <br /> <span className="text-gold italic font-serif normal-case tracking-normal">Human Hands</span>
              </motion.h2>
              <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }} className="space-y-6 text-sm text-gray-400 font-light leading-loose max-w-xl">
                <p>
                  Every Luxeva piece begins as a conceptual whisper in our Mumbai atelier. We source our textiles from the finest mills across the globe—recycled silks from Kyoto, organic cottons from Giza, and sustainable linens from the banks of the Seine.
                </p>
                <p>
                  Our artisans carry decades of inherited knowledge, blending traditional techniques with modern innovation to create silhouettes that breathe and move with the human form.
                </p>
              </motion.div>
              <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.4 }} className="pt-8">
                <button className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-gold pb-2 hover:text-gold transition-all">
                  Watch the Process
                </button>
              </motion.div>
            </div>

            <motion.div
              style={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              className="relative order-1 lg:order-2"
            >
              <div className="aspect-square bg-accent/10 rounded-full absolute -top-10 -right-10 w-64 h-64 blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"
                alt="Process"
                className="relative z-10 w-full h-full object-cover rounded shadow-2xl border border-white/10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.div {...fadeInUp} className="space-y-8">
            <h2 className="text-3xl uppercase tracking-tighter font-light">Evolve Your Wardrobe</h2>
            <div className="flex justify-center gap-6">
              <button className="bg-primary text-white px-12 py-5 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors">
                Shop Collection
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
