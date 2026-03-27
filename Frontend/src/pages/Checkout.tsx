import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const Checkout: React.FC = () => {
  const { cart, cartTotal } = useShop();

  return (
    <div className="pt-40 pb-20 bg-bg min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-light tracking-tighter uppercase mb-12 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 bg-white border border-accent p-8 space-y-6">
            <h2 className="text-sm uppercase tracking-[0.2em] font-bold">Shipping Address</h2>
            <p className="text-xs text-muted">You currently have {cart.length} item(s) in your cart.</p>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Full name" className="border border-accent p-3" />
                <input placeholder="Email address" className="border border-accent p-3" />
              </div>
              <input placeholder="Address line 1" className="w-full border border-accent p-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="City" className="border border-accent p-3" />
                <input placeholder="Postal code" className="border border-accent p-3" />
              </div>

              <h3 className="text-sm uppercase tracking-[0.2em] font-bold pt-6">Payment</h3>
              <p className="text-xs text-muted">This is a demo checkout — integrate your payment gateway here.</p>

              <div className="pt-6 flex gap-4">
                <button type="submit" className="bg-primary text-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors">
                  Place Order
                </button>
                <Link to="/cart" className="border border-primary px-6 py-3 text-[10px] uppercase tracking-widest font-bold">
                  Back to Cart
                </Link>
              </div>
            </form>
          </div>

          <aside className="bg-white border border-accent p-8">
            <h4 className="text-sm uppercase tracking-[0.2em] font-bold mb-6">Order Summary</h4>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex justify-between text-xs">
                  <span className="text-muted">{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-accent mt-6 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
