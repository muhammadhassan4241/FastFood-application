import { useState } from "react";
import { MapPin, Wallet, CreditCard, Check, ChevronLeft } from "lucide-react";
import QtyStepper from "./QtyStepper";

const DELIVERY_CHARGE = 150;
const TAX_RATE = 0.15;

function CheckoutPage({ cart, products, onAdd, onRemove, goToMenu, onPlaceOrder }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [payment, setPayment] = useState("cod");
  const [placed, setPlaced] = useState(false);

  const items = Object.entries(cart).filter(([, q]) => q > 0);
  const subtotal = items.reduce((sum, [id, q]) => {
    const p = products.find((pr) => pr.id === Number(id));
    return sum + (p ? p.price * q : 0);
  }, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const grandTotal = subtotal + DELIVERY_CHARGE + tax;

  const canPlaceOrder = name.trim() && phone.trim() && address.trim() && items.length > 0;

  const handlePlaceOrder = () => {
    if (!canPlaceOrder) return;
    setPlaced(true);
    setTimeout(() => {
      onPlaceOrder();
    }, 1800);
  };

  if (items.length === 0 && !placed) {
    return (
      <div className="px-5 md:px-10 py-24 text-center">
        <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Your cart is empty</p>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">Add a few dishes before heading to checkout.</p>
        <button
          onClick={goToMenu}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-full px-6 py-3 transition-colors"
        >
          Browse menu
        </button>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="px-5 md:px-10 py-28 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mb-6">
          <Check size={28} strokeWidth={3} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Order placed</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Thank you, {name.split(" ")[0] || "there"} — your order is on its way.
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 md:px-10 py-8">
      <button
        onClick={goToMenu}
        className="flex items-center gap-1 text-sm text-zinc-500 hover:text-orange-500 transition-colors mb-3"
      >
        <ChevronLeft size={16} /> Back to menu
      </button>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left - Form */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Contact */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block">Mobile Number</label>
                <div className="flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 focus-within:border-orange-500">
                  <span className="text-sm text-zinc-500 pr-2 border-r border-zinc-200 dark:border-zinc-700">+92</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="3XX-XXXXXXX"
                    className="w-full bg-transparent px-2 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block">Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Your Address</h3>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3.5 text-zinc-400" />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="House #, street, area, city..."
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4">
              Special Instructions <span className="text-zinc-400 text-sm font-normal">(Optional)</span>
            </h3>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              placeholder="Add any comment, e.g. about allergies, or delivery instructions here."
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          {/* Payment */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setPayment("cod")}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-colors ${
                  payment === "cod"
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-orange-500/50"
                }`}
              >
                <Wallet size={18} className="text-orange-500" />
                <span className="text-sm font-medium text-zinc-900 dark:text-white">Cash On Delivery</span>
              </button>
              <button
                onClick={() => setPayment("card")}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-colors ${
                  payment === "card"
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-orange-500/50"
                }`}
              >
                <CreditCard size={18} className="text-orange-500" />
                <span className="text-sm font-medium text-zinc-900 dark:text-white">Credit/Debit Card</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right - Summary */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Your Cart</h2>
            </div>

            <div className="px-6 py-4 flex flex-col gap-4 max-h-72 overflow-y-auto">
              {items.map(([id, q]) => {
                const p = products.find((pr) => pr.id === Number(id));
                if (!p) return null;
                return (
                  <div key={id} className="flex gap-3 items-center">
                    <img src={p.image} alt={p.title} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{p.title}</p>
                      <p className="text-xs text-orange-500 mt-0.5 font-semibold">Rs. {p.price * q}</p>
                    </div>
                    <QtyStepper qty={q} onAdd={() => onAdd(p.id)} onRemove={() => onRemove(p.id)} />
                  </div>
                );
              })}
            </div>

            <div className="px-6">
              <button
                onClick={goToMenu}
                className="text-sm text-orange-500 font-medium hover:underline"
              >
                + Add more items
              </button>
            </div>

            <div className="px-6 py-5 mt-2 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="text-zinc-900 dark:text-white">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Delivery Charges</span>
                  <span className="text-zinc-900 dark:text-white">Rs. {DELIVERY_CHARGE}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Tax (15%)</span>
                  <span className="text-zinc-900 dark:text-white">Rs. {tax}</span>
                </div>

                <div className="flex justify-between pt-3 mt-1 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="text-lg font-bold text-zinc-900 dark:text-white">Grand total</span>
                  <span className="text-xl font-bold text-orange-500">Rs. {grandTotal}</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={!canPlaceOrder}
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-full py-3.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Place Order
                </button>
                {!canPlaceOrder && (
                  <p className="text-[11px] text-zinc-500 text-center mt-1">
                    Fill in your name, phone, and address to continue.
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