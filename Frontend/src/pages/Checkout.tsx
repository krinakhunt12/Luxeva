import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useCreateOrder } from '../features/orders/hooks/useOrders';
import { showSuccess, showError } from '../utils/toastService';
import { getPriceDetails } from '../utils/productUtils';

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
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [paymentBank, setPaymentBank] = useState<string>('');
  const [giftCode, setGiftCode] = useState('');
  const [giftLoading, setGiftLoading] = useState(false);
  const [giftDeducted, setGiftDeducted] = useState(0);
  const [appliedGiftCard, setAppliedGiftCard] = useState<any | null>(null);

  const handleValidateCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    try {
      const cartPayload = { items: cart.map(item => ({ productId: item.id, price: item.price, quantity: item.quantity })), total: cartTotal };
      const res = await (await import('../features/offers/api/offerApi')).validateOffer(couponCode, cartPayload, { paymentMethod, paymentBank });
      if (res && res.valid) {
        setDiscount(res.discount || 0);
        setAppliedOffer(res.offer || null);
        showSuccess('Coupon applied successfully');
      } else {
        setDiscount(0);
        setAppliedOffer(null);
        showError(res?.message || 'Coupon invalid');
      }
    } catch (err: any) {
      setDiscount(0);
      setAppliedOffer(null);
      showError(err?.message || 'Coupon validation failed');
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
        showSuccess('Gift card balance applied');
      } else {
        showError(res?.message || 'Gift card invalid');
        setGiftDeducted(0);
        setAppliedGiftCard(null);
      }
    } catch (err: any) {
      showError(err?.message || 'Redeem failed');
      setGiftDeducted(0);
      setAppliedGiftCard(null);
    } finally {
      setGiftLoading(false);
    }
  };

  // calculate full breakdown
  const { offers: allOffers } = useShop();
  const originalSubtotal = cart.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.quantity, 0);
  const totalProductDiscount = originalSubtotal - cartTotal;
  
  // Dynamic Bank Offer Calculation
  const bankOffers = allOffers.filter((o: any) => o.bank && o.status === 'active');
  const matchedBankOffer = paymentBank ? bankOffers.find((o: any) => String(o.bank).toLowerCase() === paymentBank.toLowerCase()) : null;
  const bankDiscount = matchedBankOffer ? Math.round((cartTotal - discount) * ((matchedBankOffer.percentage || matchedBankOffer.amount || 0) / 100)) : 0;

  const finalTotal = Math.max(0, cartTotal - discount - bankDiscount - giftDeducted);

  // auto-apply coupon if set from promo banner
  React.useEffect(() => {
    const pending = localStorage.getItem('luxeva_pending_coupon');
    if (pending) {
      setCouponCode(pending);
      // attempt to validate once cart is available
      (async () => {
        try {
          const cartPayload = { items: cart.map(item => ({ productId: item.id, price: item.price, quantity: item.quantity })), total: cartTotal };
          const res = await (await import('../features/offers/api/offerApi')).validateOffer(pending, cartPayload, { paymentMethod, paymentBank });
          if (res && res.valid) {
            setDiscount(res.discount || 0);
            setAppliedOffer(res.offer || null);
            showSuccess(`Coupon ${pending} applied`);
          }
        } catch (e) {}
        try { localStorage.removeItem('luxeva_pending_coupon'); } catch (e) {}
      })();
    }
  }, [cart]);

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
                  total: finalTotal,
                  saveAddress: false,
                  appliedOffer: appliedOffer || bankDiscount > 0 ? { 
                    id: appliedOffer?._id || appliedOffer?.id || 'bank-offer', 
                    code: appliedOffer?.code || `BANK_${paymentBank.toUpperCase()}`, 
                    title: appliedOffer?.title || `${paymentBank.toUpperCase()} Bank Discount`, 
                    discount: discount + bankDiscount 
                  } : null,
                  appliedGiftCard: appliedGiftCard ? { code: appliedGiftCard.code, deducted: appliedGiftCard.deducted || giftDeducted } : null,
                  paymentMethod: paymentMethod,
                  paymentBank: paymentBank
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
                <label className="text-[10px] uppercase tracking-widest text-muted font-bold">Payment Method & Bank Offers</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="border border-accent p-3 text-xs uppercase tracking-widest font-bold">
                    <option value="card">Debit/Credit Card</option>
                    <option value="netbanking">Netbanking</option>
                    <option value="upi">UPI / Scanner</option>
                    <option value="wallet">Digital Wallet</option>
                  </select>
                  <input value={paymentBank} onChange={(e) => setPaymentBank(e.target.value)} placeholder="Enter Bank Name (e.g. HDFC)" className="border border-accent p-3 text-xs uppercase tracking-widest font-bold" />
                </div>
                {bankOffers.length > 0 && (
                  <div className="mt-4 p-4 bg-accent/30 border border-accent">
                    <p className="text-[10px] uppercase tracking-[0.1em] font-bold mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gold rounded-full" /> Applicable Bank Offers
                    </p>
                    <div className="space-y-2">
                      {bankOffers.map((o: any) => (
                        <div key={o._id} className="flex justify-between items-center text-[10px] uppercase tracking-wide">
                          <span className="text-muted font-bold">{o.bank} Offer: {o.percentage || o.amount}% Instant Discount</span>
                          {String(paymentBank).toLowerCase() === String(o.bank).toLowerCase() ? (
                            <span className="text-green-600 font-bold">Applied</span>
                          ) : (
                            <span className="text-gold">Enter {o.bank} to apply</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
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

            <div className="pt-6 border-t border-accent mt-6 space-y-3">
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <span className="text-muted">Original Price</span>
                <span>₹{originalSubtotal.toLocaleString()}</span>
              </div>
              {totalProductDiscount > 0 && (
                <div className="flex justify-between text-xs uppercase tracking-widest text-gold font-bold">
                  <span>Product Discount</span>
                  <span>- ₹{totalProductDiscount.toLocaleString()}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-xs uppercase tracking-widest text-green-600 font-bold">
                  <span>Coupon ({appliedOffer?.code})</span>
                  <span>- ₹{discount.toLocaleString()}</span>
                </div>
              )}
              {bankDiscount > 0 && (
                <div className="flex justify-between text-xs uppercase tracking-widest text-blue-600 font-bold">
                  <span>Bank Offer ({paymentBank.toUpperCase()})</span>
                  <span>- ₹{bankDiscount.toLocaleString()}</span>
                </div>
              )}
              {giftDeducted > 0 && (
                <div className="flex justify-between text-xs uppercase tracking-widest text-muted">
                  <span>Gift Card</span>
                  <span>- ₹{giftDeducted.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-4 border-t border-accent flex justify-between text-sm uppercase tracking-[0.2em] font-bold">
                <span>Final Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
