import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, History, Gift } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="pt-40 pb-24 bg-bg">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-20 font-light"
        >
          <header className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-light uppercase tracking-tighter leading-none text-primary">Refund <br /> <span className="italic font-serif normal-case tracking-normal">Framework</span></h1>
            <p className="text-muted leading-loose text-lg max-w-2xl font-light">
              Luxury is defined by total peace of mind. Our refund protocol is designed for speed, clarity, and absolute fairness.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-y border-accent py-16">
            <div className="space-y-5">
              <CreditCard size={28} className="text-gold mx-auto" strokeWidth={1} />
              <h4 className="text-[10px] uppercase tracking-widest font-black text-primary">Swift Credit</h4>
              <p className="text-xs text-muted leading-relaxed">Funds are reversed to the original payment source within 5 business days of approval.</p>
            </div>
            <div className="space-y-5">
              <History size={28} className="text-gold mx-auto" strokeWidth={1} />
              <h4 className="text-[10px] uppercase tracking-widest font-black text-primary">Fair Audit</h4>
              <p className="text-xs text-muted leading-relaxed">Item inspections are conducted within 48 hours of arrival at our Mumbai atelier.</p>
            </div>
            <div className="space-y-5">
              <Gift size={28} className="text-gold mx-auto" strokeWidth={1} />
              <h4 className="text-[10px] uppercase tracking-widest font-black text-primary">Credit Plus</h4>
              <p className="text-xs text-muted leading-relaxed">Opt for store credit and receive 110% of your order value toward your next purchase.</p>
            </div>
          </div>

          <main className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 leading-loose text-muted">
              <section className="space-y-6">
                 <h2 className="text-primary text-xl uppercase tracking-tighter font-light">Approval Logic</h2>
                 <p className="text-sm font-light">Once a returned item is received, it undergoes a meticulous 12-point quality inspection by our master artisans. We look for pristine condition—free of wear, scents, or alterations.</p>
              </section>
              <section className="space-y-6">
                 <h2 className="text-primary text-xl uppercase tracking-tighter font-light">Reverse Flow</h2>
                 <p className="text-sm font-light">Upon approval, a notification will be dispatched. The reversal time varies by bank, but typically reflects in your statement within 5–7 business days.</p>
              </section>
            </div>

            <div className="p-12 border border-gold/20 bg-gold/5 space-y-6">
               <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-gold">The Digital Gift Card</h3>
               <p className="text-xs italic leading-loose text-muted">
                 "Should you choose to remain within the Luxeva world, we offer a 'Loyalty Reversal'. Receive 110% of your item's value as a digital gift card that never expires. This credit is issued instantly upon the conclusion of our quality audit."
               </p>
            </div>

            <section className="space-y-8 font-light text-muted leading-loose text-sm pt-8">
                <h3 className="text-primary text-sm uppercase tracking-widest font-black">Partial Shipping Refunds</h3>
                <p>Original shipping charges are non-refundable. For domestic exchanges resulting from our internal error (incorrect piece, manufacturing defect), Luxeva covers all reverse logistics and redelivery costs.</p>
            </section>
          </main>
        </motion.div>
      </div>
    </div>
  );
}
