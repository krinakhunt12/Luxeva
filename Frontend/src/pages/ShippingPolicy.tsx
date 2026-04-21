import React from 'react';
import { motion } from 'motion/react';
import { Truck, Globe, ShieldCheck } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <div className="pt-40 pb-24 bg-bg">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-20"
        >
          <div className="text-center space-y-6">
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold inline-block mb-2">Service Excellence</span>
            <h1 className="text-6xl md:text-8xl font-light uppercase tracking-tighter leading-none">Shipping <br /> <span className="italic font-serif normal-case tracking-normal">Logistics</span></h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-y border-accent py-16">
            <div className="space-y-4 text-center">
              <div className="inline-block p-4 bg-white rounded-full border border-accent mb-2">
                <Truck size={24} className="text-gold" />
              </div>
              <h3 className="text-xs uppercase tracking-widest font-black">Secure Handling</h3>
              <p className="text-xs text-muted leading-relaxed font-light">Meticulously wrapped in sustainable signature packaging for a pristine arrival.</p>
            </div>
            <div className="space-y-4 text-center">
              <div className="inline-block p-4 bg-white rounded-full border border-accent mb-2">
                <Globe size={24} className="text-gold" />
              </div>
              <h3 className="text-xs uppercase tracking-widest font-black">Global Reach</h3>
              <p className="text-xs text-muted leading-relaxed font-light">White-glove delivery across 40+ countries with full transit insurance.</p>
            </div>
            <div className="space-y-4 text-center">
              <div className="inline-block p-4 bg-white rounded-full border border-accent mb-2">
                <ShieldCheck size={24} className="text-gold" />
              </div>
              <h3 className="text-xs uppercase tracking-widest font-black">Live Tracking</h3>
              <p className="text-xs text-muted leading-relaxed font-light">Real-time status updates from our premium logistics partners at every stage.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <section className="space-y-6 text-muted font-light leading-loose text-sm">
                <h2 className="text-primary text-xl uppercase tracking-tighter font-light">Domestic Pacing (India)</h2>
                <p>We leverage a private courier network to ensure your orders reach you with speed and security.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs uppercase tracking-widest">
                    <thead className="border-b border-accent">
                      <tr>
                        <th className="py-4 font-bold text-primary">Priority</th>
                        <th className="py-4 font-bold text-primary text-right">Timeframe</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-accent/50">
                      <tr><td className="py-4">Standard (Gratis over ₹2000)</td><td className="py-4 text-right">5–7 Days</td></tr>
                      <tr><td className="py-4">Express (Major Metros)</td><td className="py-4 text-right">2–3 Days</td></tr>
                      <tr><td className="py-4">Mumbai Boutique Pickup</td><td className="py-4 text-right">Instant</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-6 text-muted font-light leading-loose text-sm">
                <h2 className="text-primary text-xl uppercase tracking-tighter font-light">International Reach</h2>
                <p>Luxeva ships worldwide via DHL Express. Shipping rates are calculated at checkout based on weight and destination.</p>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <span className="font-bold text-primary">SE Asia:</span>
                    <span>7–10 Business Days</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-bold text-primary">Rest of World:</span>
                    <span>10–14 Business Days</span>
                  </li>
                </ul>
              </section>
            </div>

            <aside className="space-y-12">
              <div className="bg-white p-12 border border-accent space-y-6 shadow-sm">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gold">Customs & Duties</h3>
                <p className="text-xs text-muted leading-loose font-light">
                  For orders outside India, import duties, customs fees, and local taxes are determined by your destination country and are the sole responsibility of the customer. These charges must be paid for the courier to release the package.
                </p>
                <div className="h-[1px] bg-accent w-full" />
                <p className="text-[10px] text-muted italic">Failure to pay duties resulting in a return will incur a restocking fee and deduction of original shipping costs from the refund.</p>
              </div>

              <div className="space-y-6">
                <h3 className="text-primary text-xs uppercase tracking-widest font-black">Unsuccessful Delivery</h3>
                <p className="text-xs text-muted leading-relaxed font-light">
                  Our couriers will attempt delivery exactly three times. If you are unavailable, the package will be held at the local hub for 48 hours for collection. Unclaimed parcels returned to our atelier will be handled as per our Return Policy.
                </p>
              </div>
            </aside>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
