import { useState } from "react";
import {
  MapPin,
  Wallet,
  CreditCard,
  Check,
  ChevronLeft,
  Receipt,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";
import QtyStepper from "./QtyStepper";
import {
  formatCurrency,
  formatOrderId,
  generateOrderId,
} from "../utils/orderUtils";
import OrderReceiptModal from "./OrderReceiptModal";

const DELIVERY_CHARGE = 150;
const TAX_RATE = 0.15;

function CheckoutPage({
  cart,
  products,
  onAdd,
  onRemove,
  goToMenu,
  onPlaceOrder,
  onGoToTracking,
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [payment, setPayment] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  const rawCartItems = Object.entries(cart).filter(([, val]) => {
    const q = typeof val === "number" ? val : val?.quantity || 0;
    return q > 0;
  });

  const normalizedCartItems = rawCartItems
    .map(([key, val]) => {
      const q = typeof val === "number" ? val : val?.quantity || 0;
      const prodId =
        typeof val === "object" && val?.productId
          ? val.productId
          : Number(key.split("_")[0]);
      const p = products.find((pr) => pr.id === prodId);
      if (!p) return null;

      const drink = typeof val === "object" ? val.drink : null;
      const foodPrice = Number(p.price || 0);
      const drinkPrice = drink ? Number(drink.price || 0) : 0;
      const unitPrice = foodPrice + drinkPrice;

      return {
        key,
        id: p.id,
        productId: p.id,
        title: p.title || p.name,
        price: unitPrice,
        food_price: foodPrice,
        quantity: Number(q),
        image: p.image || "",
        category: p.category || "Food",
        drink: drink ? (drink.name || drink.title) : null,
        drink_name: drink ? (drink.name || drink.title) : null,
        drink_price: drinkPrice,
      };
    })
    .filter(Boolean);

  const subtotal = normalizedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const grandTotal = subtotal + DELIVERY_CHARGE + tax;

  const canPlaceOrder = name.trim() && phone.trim() && address.trim() && normalizedCartItems.length > 0;

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");
    const newOrderId = generateOrderId();

    const orderPayload = {
      order_id: newOrderId,
      customer_name: name.trim(),
      mobile: phone.trim(),
      customer_phone: phone.trim(),
      customer_email: email.trim(),
      address: address.trim(),
      special_instructions: instructions.trim(),
      items: normalizedCartItems,
      subtotal: subtotal,
      delivery_fee: DELIVERY_CHARGE,
      tax: tax,
      discount: 0,
      total_amount: grandTotal,
      total: grandTotal,
      payment_method: payment,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    try {
      const confirmedOrder = await onPlaceOrder(orderPayload);
      if (confirmedOrder) {
        setPlacedOrder(confirmedOrder);

        // Celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#f97316", "#fbbf24", "#34d399", "#60a5fa"],
          });
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error("Checkout order placement error:", err);
      setErrorMessage(
        err.message || "Failed to place order. Please check your database connection or try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Empty cart view
  if (rawCartItems.length === 0 && !placedOrder) {
    return (
      <div className="px-5 md:px-10 py-24 text-center animate-fade-up">
        <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Your cart is empty</p>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">Add a few delicious dishes before heading to checkout.</p>
        <button
          onClick={goToMenu}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-full px-7 py-3.5 transition-colors shadow-lg shadow-orange-500/25"
        >
          Browse menu
        </button>
      </div>
    );
  }

  // Success Confirmation Screen with QR code & Digital Receipt Actions
  if (placedOrder) {
    const orderIdDisplay = formatOrderId(placedOrder);
    const trackingUrl = typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}?tracking=${encodeURIComponent(placedOrder.order_id || placedOrder.id)}`
      : "";

    return (
      <div className="px-4 py-12 sm:px-6 md:px-10 animate-fade-up">
        <div className="mx-auto max-w-2xl text-center">
          {/* Animated Success Badge */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500 text-white shadow-2xl shadow-orange-500/30 animate-bounce">
            <Check size={36} strokeWidth={3} />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
            <Sparkles size={13} /> Order Confirmed
          </div>

          <h1 className="mt-3 text-3xl font-black text-zinc-900 dark:text-white sm:text-4xl">
            Thank you, {name.split(" ")[0] || "there"}!
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Your order has been recorded and is now in the kitchen preparation queue.
          </p>

          {/* Order Summary & QR Code Card */}
          <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 items-center text-left">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  Unique Order ID
                </span>
                <p className="font-mono text-2xl font-black text-orange-500">
                  {orderIdDisplay}
                </p>

                <div className="mt-4 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                  <p><span className="font-bold text-zinc-900 dark:text-white">Customer:</span> {placedOrder.customer_name}</p>
                  <p><span className="font-bold text-zinc-900 dark:text-white">Phone:</span> {placedOrder.mobile || placedOrder.customer_phone}</p>
                  <p><span className="font-bold text-zinc-900 dark:text-white">Payment:</span> {placedOrder.payment_method === "card" ? "Credit/Debit Card" : "Cash on Delivery"}</p>
                  <p className="text-sm font-black text-zinc-900 dark:text-white pt-1">
                    Total: <span className="text-orange-500">{formatCurrency(placedOrder.total_amount || placedOrder.total)}</span>
                  </p>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center rounded-2xl bg-zinc-50 p-4 text-center dark:bg-zinc-950/60">
                <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-700">
                  <QRCodeSVG
                    value={trackingUrl}
                    size={90}
                    level="M"
                    fgColor="#09090b"
                  />
                </div>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Scan to Live Track
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => setReceiptModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white py-3.5 text-xs font-black text-zinc-800 shadow-sm transition hover:border-orange-500 hover:text-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <Receipt size={16} className="text-orange-500" />
                <span>View & Print Receipt</span>
              </button>

              <button
                onClick={() => onGoToTracking(placedOrder.order_id || String(placedOrder.id))}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 text-xs font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400"
              >
                <span>Track Live Status</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={goToMenu}
              className="text-xs font-bold text-zinc-500 hover:text-orange-500"
            >
              ← Order something else
            </button>
          </div>
        </div>

        {/* Digital Receipt Modal */}
        {receiptModalOpen && (
          <OrderReceiptModal
            order={placedOrder}
            products={products}
            isOpen={receiptModalOpen}
            onClose={() => setReceiptModalOpen(false)}
          />
        )}
      </div>
    );
  }

  // Checkout Form
  return (
    <div className="px-5 md:px-10 py-8 animate-fade-up">
      <button
        onClick={goToMenu}
        className="flex items-center gap-1 text-sm text-zinc-500 hover:text-orange-500 transition-colors mb-3 font-semibold"
      >
        <ChevronLeft size={16} /> Back to menu
      </button>
      <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-8">Checkout</h1>

      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-semibold text-red-600 dark:text-red-400">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Order Placement Issue</p>
            <p className="mt-0.5">{errorMessage}</p>
            <p className="mt-1 opacity-80">
              Note: If this is an RLS policy issue, please run the updated SQL migration in Supabase SQL Editor.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left - Form */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Contact */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <h3 className="font-black text-zinc-900 dark:text-white mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 mb-1.5 block">Full Name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 mb-1.5 block">Mobile Number *</label>
                <div className="flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-3 focus-within:border-orange-500">
                  <span className="text-sm font-semibold text-zinc-500 pr-2 border-r border-zinc-200 dark:border-zinc-700">+92</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="3XX-XXXXXXX"
                    className="w-full bg-transparent px-2 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 mb-1.5 block">Email Address (Optional)</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <h3 className="font-black text-zinc-900 dark:text-white mb-4">Delivery Address *</h3>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-3.5 text-zinc-400" />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="House #, street, building, area, city..."
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-10 pr-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <h3 className="font-black text-zinc-900 dark:text-white mb-4">
              Special Kitchen Instructions <span className="text-zinc-400 text-xs font-normal">(Optional)</span>
            </h3>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              placeholder="Add any comment for the chef e.g. extra spicy, no onions, or gate delivery instructions."
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          {/* Payment */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <h3 className="font-black text-zinc-900 dark:text-white mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayment("cod")}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 border transition-all ${
                  payment === "cod"
                    ? "border-orange-500 bg-orange-500/10 shadow-sm"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-orange-500/50"
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
                  <Wallet size={18} />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-zinc-900 dark:text-white block">Cash On Delivery</span>
                  <span className="text-[11px] text-zinc-400">Pay when delivered</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPayment("card")}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 border transition-all ${
                  payment === "card"
                    ? "border-orange-500 bg-orange-500/10 shadow-sm"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-orange-500/50"
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
                  <CreditCard size={18} />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-zinc-900 dark:text-white block">Credit / Debit Card</span>
                  <span className="text-[11px] text-zinc-400">POS on delivery / Online</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right - Summary */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">Your Cart Summary</h2>
            </div>

            <div className="px-6 py-4 flex flex-col gap-4 max-h-72 overflow-y-auto">
              {normalizedCartItems.map((item) => (
                <div key={item.key || item.id} className="flex gap-3 items-center">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 font-black shrink-0">
                      F
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{item.title}</p>
                    <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Drink:{" "}
                      <span className={item.drink ? "text-orange-500 font-bold" : "text-zinc-400"}>
                        {item.drink ? `${item.drink_name} (+Rs. ${item.drink_price})` : "No Drink"}
                      </span>
                    </p>
                    <p className="text-xs text-orange-500 mt-0.5 font-bold">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                  <QtyStepper
                    qty={item.quantity}
                    onAdd={() => onAdd(item.key || item.id)}
                    onRemove={() => onRemove(item.key || item.id)}
                  />
                </div>
              ))}
            </div>

            <div className="px-6">
              <button
                onClick={goToMenu}
                className="text-xs text-orange-500 font-bold hover:underline"
              >
                + Add more items
              </button>
            </div>

            <div className="px-6 py-5 mt-2 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Delivery Charges</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{formatCurrency(DELIVERY_CHARGE)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">GST / Tax (15%)</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{formatCurrency(tax)}</span>
                </div>

                <div className="flex justify-between pt-3 mt-1 border-t border-zinc-200 dark:border-zinc-800 text-sm">
                  <span className="font-black text-zinc-900 dark:text-white">Grand total</span>
                  <span className="text-lg font-black text-orange-500">{formatCurrency(grandTotal)}</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={!canPlaceOrder || isSubmitting}
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-400 text-white font-black rounded-full py-4 transition-all shadow-xl shadow-orange-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Placing Order in Database..." : `Place Order • ${formatCurrency(grandTotal)}`}
                </button>
                {!canPlaceOrder && (
                  <p className="text-[11px] text-zinc-500 text-center mt-1">
                    Fill in your name, mobile number, and address to place order.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;