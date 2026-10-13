"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Pencil,
  ChevronDown,
  Package,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { FaCcVisa } from "react-icons/fa";

type Tab = "personal" | "orders" | "address" | "payment" | "password" | "admin" | "logout";

type OrderItem = { name: string; weight: string; qty: number; emoji: string };
type Order = {
  id: string;
  total: number;
  paymentMethod: string;
  dateLabel: string;
  status: "Processing" | "Accepted" | "On the Way" | "Delivered" | "Cancelled";
  items: OrderItem[];
};
type Address = { id: string; name: string; line: string };
type SavedCard = { id: string; brand: "visa"; last4: string };

const BASE_MENU: { id: Tab; label: string }[] = [
  { id: "personal", label: "Personal Information" },
  { id: "orders", label: "My Orders" },
  { id: "address", label: "Manage Address" },
  { id: "payment", label: "Payment Method" },
  { id: "password", label: "Password Manager" },
  { id: "logout", label: "Logout" },
];

const INITIAL_ADDRESSES: Address[] = [
  { id: "1", name: "User", line: "House 12, Road 54, Gulshan 1, Dhaka 1212" },
];

export default function AccountClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [tab, setTab] = useState<Tab>("personal");
  const [saved, setSaved] = useState(false);
  const [sort, setSort] = useState("all");
  const [toast, setToast] = useState("");

  // Real Database Orders
  const [dbOrders, setDbOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Load Real Orders from DB
  useEffect(() => {
    if (status !== "authenticated") return;

    let isMounted = true;
    async function loadUserOrders() {
      try {
        const res = await fetch("/api/user/orders");
        const data = await res.json();
        if (res.ok && isMounted) {
          setDbOrders(data.orders || []);
        }
      } catch {
        // ignore
      } finally {
        if (isMounted) setLoadingOrders(false);
      }
    }
    loadUserOrders();

    return () => {
      isMounted = false;
    };
  }, [status]);

  // Auth Protection & Admin Menu
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const userRole = (session?.user as { role?: string })?.role;
  const isAdmin = userRole === "admin" || userRole === "superadmin";

  const menu = isAdmin
    ? [...BASE_MENU.slice(0, 5), { id: "admin", label: "Go to Admin Panel" }, BASE_MENU[5]]
    : BASE_MENU;

  // Personal State (Live Data from Session)
  const [firstName, setFirstName] = useState(session?.user?.name?.split(" ")[0] || "User");
  const [lastName, setLastName] = useState(session?.user?.name?.split(" ")[1] || "");
  const [email, setEmail] = useState(session?.user?.email || "customer@example.com");
  const [phone, setPhone] = useState("+880 1700-000000");
  const [gender, setGender] = useState("Female");

  // Password State
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addrMsg, setAddrMsg] = useState("");
  const [aFirst, setAFirst] = useState("");
  const [aLast, setALast] = useState("");
  const [aCompany, setACompany] = useState("");
  const [aCountry, setACountry] = useState("");
  const [aStreet, setAStreet] = useState("");
  const [aCity, setACity] = useState("");
  const [aState, setAState] = useState("");
  const [aZip, setAZip] = useState("");
  const [aPhone, setAPhone] = useState("");
  const [aEmail, setAEmail] = useState("");

  // Payment State
  const [bkashLinked, setBkashLinked] = useState(false);
  const [nagadLinked, setNagadLinked] = useState(false);
  const [bkashNumber, setBkashNumber] = useState("");
  const [nagadNumber, setNagadNumber] = useState("");
  const [showBkashForm, setShowBkashForm] = useState(false);
  const [showNagadForm, setShowNagadForm] = useState(false);
  const [cards, setCards] = useState<SavedCard[]>([{ id: "1", brand: "visa", last4: "8047" }]);
  const [showCardForm, setShowCardForm] = useState(true);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [payMsg, setPayMsg] = useState("");

  const displayOrders = dbOrders.filter((o) => {
    if (sort === "delivered") return o.status === "Delivered";
    if (sort === "accepted") return o.status === "Accepted" || o.status === "Processing";
    return true;
  });

  const inputCls = "w-full rounded-full border border-[#e5e5e5] px-5 py-3.5 text-sm outline-none transition focus:border-[#1E7F57] text-[#1a1a1a]";

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleMenu = (id: Tab) => {
    if (id === "logout") return; // Handled below
    if (id === "admin") {
      router.push("/admin");
      return;
    }
    setTab(id);
    setSaved(false);
    setAddrMsg("");
    setPayMsg("");
    setEditingId(null);
  };

  const handleUpdatePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) return alert("New password must be at least 6 characters");
    if (newPass !== confirmPass) return alert("New passwords do not match");
    setSaved(true);
    setCurrentPass(""); setNewPass(""); setConfirmPass("");
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const fillFormForEdit = (addr: Address) => {
    setEditingId(addr.id);
    const parts = addr.name.split(" ");
    setAFirst(parts[0] || "");
    setALast(parts.slice(1).join(" ") || "");
    setAStreet(addr.line);
    setACountry("Bangladesh");
    setACity("Dhaka");
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((p) => p.filter((a) => a.id !== id));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const name = `${aFirst.trim()} ${aLast.trim()}`.trim();
    const line = [aStreet, aCity, aZip, aCountry].filter(Boolean).join(", ");
    if (editingId) {
      setAddresses((p) => p.map((a) => (a.id === editingId ? { ...a, name, line } : a)));
      setAddrMsg("Address updated successfully!");
    } else {
      setAddresses((p) => [...p, { id: String(Date.now()), name, line }]);
      setAddrMsg("Address added successfully!");
    }
    setEditingId(null);
    setTimeout(() => setAddrMsg(""), 2500);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (saveCard) setCards((p) => [...p, { id: String(Date.now()), brand: "visa", last4: cardNumber.slice(-4) || "0000" }]);
    showToastMsg("Card added successfully!");
    setCardNumber(""); setCardName(""); setCardExpiry(""); setCardCvv("");
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1E7F57] border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#1E7F57] px-6 py-4 text-white shadow-2xl animate-in slide-in-from-top-5 duration-300">
          <CheckCircle2 size={24} className="text-[#FBC617]" />
          <p className="text-sm font-bold">{toast}</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
        {/* Left menu */}
        <aside className="flex flex-col gap-3">
          {menu.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleMenu(item.id as Tab)}
              className={`rounded-2xl px-6 py-4 text-left text-sm font-semibold transition ${
                tab === item.id ? "bg-[#FBC617] text-[#1a1a1a]" : "border border-[#e5e5e5] bg-white hover:border-[#1E7F57]"
              } ${item.id === "admin" ? "border-[#1E7F57] bg-[#E8F3EE] text-[#1E7F57]" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </aside>

        {/* Right content */}
        <div className="min-w-0">
          
          {/* PERSONAL */}
          {tab === "personal" && (
            <form onSubmit={handleUpdatePersonal} className="max-w-2xl">
              <div className="mb-10 flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#d4ebe0] to-[#a8d4b8] text-5xl ring-4 ring-white shadow-md">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                  <button type="button" className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#1E7F57] text-white shadow hover:bg-[#166b48]">
                    <Pencil size={14} />
                  </button>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">First Name *</label>
                  <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Last Name *</label>
                  <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold">Email *</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              </div>
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold">Phone *</label>
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
              </div>
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold">Gender *</label>
                <div className="relative">
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className={`${inputCls} appearance-none bg-white`}>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                  <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6b6b]" />
                </div>
              </div>
              {saved && <p className="mt-4 text-sm font-semibold text-[#1E7F57]">Profile updated successfully!</p>}
              <button type="submit" className="mt-8 rounded-full bg-[#1E7F57] px-10 py-3.5 text-sm font-semibold text-white hover:bg-[#166b48]">
                Update Changes
              </button>
            </form>
          )}

          {/* MY REAL ORDERS */}
          {tab === "orders" && (
            <div>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <Package className="text-[#1E7F57]" size={24} />
                  Orders ({displayOrders.length})
                </h2>
                <div className="relative">
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="appearance-none rounded-full border border-[#e5e5e5] bg-white py-2 pl-4 pr-10 text-sm font-medium outline-none">
                    <option value="all">All Orders</option>
                    <option value="accepted">Accepted / Processing</option>
                    <option value="delivered">Delivered</option>
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]" />
                </div>
              </div>

              {loadingOrders ? (
                <div className="p-12 text-center text-[#6b6b6b]">Loading real orders...</div>
              ) : displayOrders.length === 0 ? (
                <div className="rounded-2xl border border-[#e5e5e5] p-12 text-center">
                  <Package size={40} className="mx-auto text-[#c4c4c4]" />
                  <p className="mt-4 font-semibold">No orders found</p>
                  <Link href="/shop" className="mt-4 inline-flex rounded-full bg-[#1E7F57] px-6 py-2.5 text-sm font-semibold text-white">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {displayOrders.map((order) => (
                    <div key={order.id} className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white shadow-sm">
                      <div className="grid grid-cols-2 gap-3 bg-[#FBC617] px-5 py-4 sm:grid-cols-4 sm:gap-0">
                        <div className="sm:border-r sm:border-black/10 sm:pr-4">
                          <p className="text-[11px] font-medium text-[#1a1a1a]/70">Order ID</p>
                          <p className="mt-0.5 text-sm font-bold text-[#1a1a1a]">{order.id}</p>
                        </div>
                        <div className="sm:border-r sm:border-black/10 sm:px-4">
                          <p className="text-[11px] font-medium text-[#1a1a1a]/70">Total Payment</p>
                          <p className="mt-0.5 text-sm font-bold text-[#1a1a1a]">৳{order.total.toFixed(2)}</p>
                        </div>
                        <div className="sm:border-r sm:border-black/10 sm:px-4">
                          <p className="text-[11px] font-medium text-[#1a1a1a]/70">Payment Method</p>
                          <p className="mt-0.5 text-sm font-bold text-[#1a1a1a]">{order.paymentMethod}</p>
                        </div>
                        <div className="sm:pl-4">
                          <p className="text-[11px] font-medium text-[#1a1a1a]/70">Order Date</p>
                          <p className="mt-0.5 text-sm font-bold text-[#1a1a1a]">{order.dateLabel}</p>
                        </div>
                      </div>

                      <div className="divide-y divide-[#e5e5e5] px-5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 py-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#e5e5e5] bg-[#F9F9F9] text-3xl">
                              {item.emoji}
                            </div>
                            <div>
                              <p className="font-semibold text-[#1a1a1a]">{item.name}</p>
                              <p className="text-sm text-[#6b6b6b]">{item.weight} | {item.qty} Qty.</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-[#e5e5e5] px-5 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${
                              order.status === "Delivered" ? "border-[#1E7F57] text-[#1E7F57]" : "border-[#f5a623] text-[#f5a623]"
                            }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <Link href={`/track-order?orderId=${encodeURIComponent(order.id)}`} className="rounded-full bg-[#1E7F57] px-6 py-2.5 text-sm font-semibold text-white">Track Order</Link>
                          <button onClick={() => window.print()} className="rounded-full border border-[#1E7F57] px-6 py-2.5 text-sm font-semibold text-[#1E7F57]">Invoice</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADDRESS */}
          {tab === "address" && (
            <div className="max-w-3xl">
              <h2 className="mb-6 text-xl font-bold flex items-center gap-2"><MapPin className="text-[#1E7F57]"/> Manage Address</h2>
              {addresses.map((addr) => (
                <div key={addr.id} className="mb-4 rounded-2xl border p-5 flex justify-between">
                  <div>
                    <p className="font-semibold">{addr.name}</p>
                    <p className="text-sm text-[#6b6b6b]">{addr.line}</p>
                  </div>
                  <div className="flex gap-4 text-sm font-bold">
                    <button onClick={() => fillFormForEdit(addr)} className="text-[#1E7F57]">Edit</button>
                    <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-500">Delete</button>
                  </div>
                </div>
              ))}
              <form onSubmit={handleAddAddress} className="mt-8 space-y-4">
                <input required value={aStreet} onChange={(e) => setAStreet(e.target.value)} placeholder="Full Address" className={inputCls} />
                <button type="submit" className="rounded-full bg-[#1E7F57] px-8 py-3 text-white font-bold">{editingId ? "Update Address" : "Add Address"}</button>
              </form>
            </div>
          )}

          {/* PAYMENT */}
          {tab === "payment" && (
            <div className="max-w-2xl space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard className="text-[#1E7F57]"/> Payment Methods</h2>
              
              <div className="rounded-2xl border p-4 flex justify-between items-center">
                <div className="flex gap-3 items-center"><span className="bg-[#E2136E] text-white p-2 rounded-full text-xs font-bold">bK</span> bKash</div>
                <button onClick={() => setShowBkashForm(!showBkashForm)} className="text-[#1E7F57] font-bold text-sm">Link</button>
              </div>

              <div className="rounded-2xl border p-4 flex justify-between items-center">
                <div className="flex gap-3 items-center"><span className="text-2xl">💵</span> Cash On Delivery</div>
                <span className="text-xs font-bold text-[#1E7F57] bg-[#E8F3EE] px-3 py-1 rounded-full">Always On</span>
              </div>

              <form onSubmit={handleAddCard} className="rounded-2xl border p-5 mt-6">
                <h3 className="font-bold mb-4">Add New Card</h3>
                <input required value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card Number" className={inputCls} />
                <button type="submit" className="mt-4 rounded-full bg-[#1E7F57] px-8 py-3 text-white font-bold">Add Card</button>
              </form>
            </div>
          )}

          {/* PASSWORD */}
          {tab === "password" && (
            <form onSubmit={handleUpdatePassword} className="max-w-xl space-y-5">
              <h2 className="mb-6 text-xl font-bold flex items-center gap-2"><Lock className="text-[#1E7F57]" /> Password Manager</h2>
              <div className="relative">
                <input required type={showCurrent ? "text" : "password"} value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} placeholder="Current Password" className={inputCls} />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2"><Eye size={18}/></button>
              </div>
              <div className="relative">
                <input required type={showNew ? "text" : "password"} value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New Password" className={inputCls} />
              </div>
              <button type="submit" className="mt-4 rounded-full bg-[#1E7F57] px-10 py-3.5 text-white font-bold">Update Password</button>
            </form>
          )}

          {/* LOGOUT */}
          {tab === "logout" && (
            <div>
              <h2 className="text-2xl font-bold">Logout</h2>
              <p className="mt-2 text-sm text-[#6b6b6b]">Are you sure you want to log out?</p>
              <button onClick={handleLogout} className="mt-6 rounded-full bg-[#1E7F57] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#166b48]">
                Yes, Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}