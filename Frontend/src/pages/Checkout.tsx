import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useCreateOrder } from '../features/orders/hooks/useOrders';

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useShop();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address1, setAddress1] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [appliedOffer, setAppliedOffer] = useState<any | null>(null);
  const [giftCode, setGiftCode] = useState('');
  const [giftLoading, setGiftLoading] = useState(false);
  const [giftDeducted, setGiftDeducted] = useState(0);
  const [appliedGiftCard, setAppliedGiftCard] = useState<any | null>(null);

  const handleValidateCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    try {
      const cartPayload = { items: cart.map(item => ({ productId: item.id, price: item.price, quantity: item.quantity })), total: cartTotal };
      const res = await (await import('../features/offers/api/offerApi')).validateOffer(couponCode, cartPayload);
      if (res && res.valid) {
        setDiscount(res.discount || 0);
        setAppliedOffer(res.offer || null);
      } else {
        setDiscount(0);
        setAppliedOffer(null);
        alert(res?.message || 'Coupon invalid');
      }
    } catch (err: any) {
      setDiscount(0);
      setAppliedOffer(null);
      alert(err?.message || 'Coupon validation failed');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRedeemGift = async () => {
    if (!giftCode) return;
    setGiftLoading(true);
    try {
      const { redeemGiftCard } = await import('../features/giftcards/api/giftcardApi');
      const cartPayloadAmount = Math.max(0, cartTotal - discount);
      const res = await redeemGiftCard(giftCode.trim().toUpperCase(), cartPayloadAmount);
      if (res && res.ok) {
        setGiftDeducted(res.deducted || 0);
        setAppliedGiftCard({ code: giftCode.trim().toUpperCase(), deducted: res.deducted || 0 });
      } else {
        alert(res?.message || 'Gift card invalid');
        setGiftDeducted(0);
        setAppliedGiftCard(null);
      }
    } catch (err: any) {
      alert(err?.message || 'Redeem failed');
      setGiftDeducted(0);
      setAppliedGiftCard(null);
    } finally {
      setGiftLoading(false);
    }
  };

  return (
    <div className="pt-40 pb-20 bg-bg min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-light tracking-tighter uppercase mb-12 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 bg-white border border-accent p-8 space-y-6">
            <h2 className="text-sm uppercase tracking-[0.2em] font-bold">Shipping Address</h2>
            <p className="text-xs text-muted">You currently have {cart.length} item(s) in your cart.</p>

            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              // build payload
              const payload = {
                items: cart.map(item => ({ productId: item.id, name: item.name, price: item.price, quantity: item.quantity })),
                shippingAddress: { fullName, email, address1, city, postal },
                total: Math.max(0, cartTotal - discount - giftDeducted),
                saveAddress: false,
                appliedOffer: appliedOffer ? { id: appliedOffer._id || appliedOffer.id, code: appliedOffer.code, title: appliedOffer.title, discount: discount } : null,
                appliedGiftCard: appliedGiftCard ? { code: appliedGiftCard.code, deducted: appliedGiftCard.deducted || giftDeducted } : null
              };

              createOrder.mutate(payload, {
                onSuccess: (data) => {
                  // clear cart and show the empty cart page directly
                  clearCart();
                  navigate('/cart');
                },
                // notifications are handled by the mutation hook
              });
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="border border-accent p-3" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="border border-accent p-3" />
              </div>
              <input value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="Address line 1" className="w-full border border-accent p-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="border border-accent p-3" />
                <input value={postal} onChange={(e) => setPostal(e.target.value)} placeholder="Postal code" className="border border-accent p-3" />
              </div>

              <h3 className="text-sm uppercase tracking-[0.2em] font-bold pt-6">Payment</h3>
              <p className="text-xs text-muted">This is a demo checkout — integrate your payment gateway here.</p>

              <div className="mt-4">
                <label className="text-xs uppercase text-muted">Coupon Code</label>
                <div className="flex gap-2 mt-2">
                  <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter coupon code" className="border border-accent p-2 flex-1" />
                  <button type="button" onClick={handleValidateCoupon} disabled={couponLoading} className="bg-primary text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold">
                    {couponLoading ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {discount > 0 && (
                  <div className="text-sm text-green-600 mt-2">Discount applied: ₹{discount}</div>
                )}
              </div>

              <div className="mt-4">
                <label className="text-xs uppercase text-muted">Gift Card</label>
                <div className="flex gap-2 mt-2">
                  <input value={giftCode} onChange={(e) => setGiftCode(e.target.value)} placeholder="Enter gift card code" className="border border-accent p-2 flex-1" />
                  <button type="button" onClick={handleRedeemGift} disabled={giftLoading} className="bg-primary text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold">
                    {giftLoading ? 'Checking...' : 'Redeem'}
                  </button>
                </div>
                {giftDeducted > 0 && (
                  <div className="text-sm text-green-600 mt-2">Gift applied: ₹{giftDeducted}</div>
                )}
              </div>

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

            <div className="pt-6 border-t border-accent mt-6 space-y-2">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{cartTotal}</span></div>
              <div className="flex justify-between text-sm"><span>Discount</span><span>- ₹{discount}</span></div>
              <div className="flex justify-between text-sm"><span>Gift</span><span>- ₹{giftDeducted}</span></div>
              <div className="flex justify-between font-bold"><span>Total</span><span>₹{Math.max(0, cartTotal - discount - giftDeducted)}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
