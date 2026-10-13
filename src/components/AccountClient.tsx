"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Pencil,
  ChevronDown,
  Package,
  MapPin,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { FaCcVisa } from "react-icons/fa";

type Tab =
  | "personal"
  | "orders"
  | "address"
  | "payment"
  | "password"
  | "admin"
  | "logout";

type OrderItem = {
  name: string;
  weight: string;
  qty: number;
  emoji: string;
};

type Order = {
  id: string;
  total: number;
  paymentMethod: string;
  dateLabel: string;
  dateType: "estimated" | "delivered";
  status: "accepted" | "delivered" | "processing" | "shipped";
  statusText: string;
  items: OrderItem[];
};

type Address = {
  id: string;
  name: string;
  line: string;
};

type SavedCard = {
  id: string;
  brand: "visa" | "mastercard";
  last4: string;
};

type SessionOrderItem = {
  name: string;
  weight: string;
  qty: number;
  emoji: string;
};

type SessionOrderData = {
  orderId?: string;
  paymentMethod?: string;
  deliveryDate?: string;
  total?: number;
  items?: SessionOrderItem[];
};

const BASE_MENU: { id: Tab; label: string }[] = [
  { id: "personal", label: "Personal Information" },
  { id: "orders", label: "My Orders" },
  { id: "address", label: "Manage Address" },
  { id: "payment", label: "Payment Method" },
  { id: "password", label: "Password Manager" },
  { id: "logout", label: "Logout" },
];

const DEMO_ORDERS: Order[] = [
  {
    id: "#SDGT1254FD",
    total: 74,
    paymentMethod: "bKash",
    dateLabel: "29 July 2024",
    dateType: "estimated",
    status: "accepted",
    statusText: "Your Order has been Accepted",
    items: [
      { name: "Fresh Oranges", weight: "500 g", qty: 4, emoji: "🍊" },
      { name: "Red Onion", weight: "500 g", qty: 2, emoji: "🧅" },
      { name: "Fresh Yellow Lemon", weight: "500 g", qty: 1, emoji: "🍋" },
      { name: "Pomegranate", weight: "500 g", qty: 2, emoji: "🍎" },
    ],
  },
  {
    id: "#SDGT7412DF",
    total: 40,
    paymentMethod: "Cash On Delivery",
    dateLabel: "27 July 2024",
    dateType: "delivered",
    status: "delivered",
    statusText: "Your Order has been Delivered",
    items: [{ name: "Fresh Strawberry", weight: "500 g", qty: 5, emoji: "🍓" }],
  },
];

const INITIAL_ADDRESSES: Address[] = [
  {
    id: "1",
    name: "Bessie Cooper",
    line: "House 12, Road 54, Gulshan 1, Dhaka 1212",
  },
  {
    id: "2",
    name: "Bessie Cooper",
    line: "Flat B3, Banani Road 11, Dhaka 1213",
  },
];

function subscribeStorage(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSessionOrderSnapshot() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("gulshan-last-order") || "";
}

function getServerSnapshot() {
  return "";
}

const inputCls =
  "w-full rounded-full border border-[#e5e5e5] px-5 py-3.5 text-sm outline-none transition focus:border-[#1E7F57]";

export default function AccountClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const [tab, setTab] = useState<Tab>("personal");
  const [saved, setSaved] = useState(false);
  const [sort, setSort] = useState("all");

  const userRole = (session?.user as { role?: string })?.role;
  const isAdmin = userRole === "admin" || userRole === "superadmin";

  const menu = useMemo(() => {
    if (isAdmin) {
      const items = [...BASE_MENU];
      items.splice(5, 0, { id: "admin", label: "Go to Admin Panel" });
      return items;
    }
    return BASE_MENU;
  }, [isAdmin]);

  const sessionOrderRaw = useSyncExternalStore(
    subscribeStorage,
    getSessionOrderSnapshot,
    getServerSnapshot
  );

  const sessionOrder = useMemo<Order | null>(() => {
    if (!sessionOrderRaw) return null;
    try {
      const s = JSON.parse(sessionOrderRaw) as SessionOrderData;
      if (!s.orderId || !s.items?.length) return null;
      return {
        id: s.orderId.startsWith("#") ? s.orderId : `#${s.orderId}`,
        total: s.total ?? 0,
        paymentMethod: s.paymentMethod || "Cash On Delivery",
        dateLabel: s.deliveryDate || "Soon",
        dateType: "estimated",
        status: "accepted",
        statusText: "Your Order has been Accepted",
        items: s.items.map((i) => ({
          name: i.name,
          weight: i.weight,
          qty: i.qty,
          emoji: i.emoji,
        })),
      };
    } catch {
      return null;
    }
  }, [sessionOrderRaw]);

  // Personal State
  const [firstName, setFirstName] = useState("Leslie");
  const [lastName, setLastName] = useState("Cooper");
  const [email, setEmail] = useState("example@gmail.com");
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
  const [aCountry, setACountry] = useState("Bangladesh");
  const [aStreet, setAStreet] = useState("");
  const [aCity, setACity] = useState("Dhaka");
  const [aState, setAState] = useState("Dhaka Division");
  const [aZip, setAZip] = useState("1212");
  const [aPhone, setAPhone] = useState("+880 1700-000000");
  const [aEmail, setAEmail] = useState("example@gmail.com");

  // Payment State
  const [bkashLinked, setBkashLinked] = useState(false);
  const [nagadLinked, setNagadLinked] = useState(false);
  const [bkashNumber, setBkashNumber] = useState("");
  const [nagadNumber, setNagadNumber] = useState("");
  const [showBkashForm, setShowBkashForm] = useState(false);
  const [showNagadForm, setShowNagadForm] = useState(false);
  const [cards, setCards] = useState<SavedCard[]>([
    { id: "1", brand: "visa", last4: "8047" },
  ]);
  const [showCardForm, setShowCardForm] = useState(true);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [payMsg, setPayMsg] = useState("");

  const orders = useMemo(() => {
    const list = sessionOrder
      ? [sessionOrder, ...DEMO_ORDERS.filter((o) => o.id !== sessionOrder.id)]
      : DEMO_ORDERS;

    if (sort === "delivered")
      return list.filter((o) => o.status === "delivered");
    if (sort === "accepted")
      return list.filter(
        (o) => o.status === "accepted" || o.status === "processing"
      );
    return list;
  }, [sort, sessionOrder]);

  const handleMenu = (id: Tab) => {
    if (id === "admin") {
      router.push("/admin");
      return;
    }
    setTab(id);
    setSaved(false);
    setAddrMsg("");
    setPayMsg("");
    setEditingId(null);
    resetAddressForm();
  };

  const resetAddressForm = () => {
    setAFirst("");
    setALast("");
    setACompany("");
    setACountry("Bangladesh");
    setAStreet("");
    setACity("Dhaka");
    setAState("Dhaka Division");
    setAZip("1212");
    setAPhone("+880 1700-000000");
    setAEmail("example@gmail.com");
  };

  const handleUpdatePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass.trim()) {
      alert("Please enter your current password");
      return;
    }
    if (newPass.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }
    if (newPass !== confirmPass) {
      alert("New passwords do not match");
      return;
    }
    setSaved(true);
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const fillFormForEdit = (addr: Address) => {
    setEditingId(addr.id);
    const parts = addr.name.split(" ");
    setAFirst(parts[0] || "");
    setALast(parts.slice(1).join(" ") || "");
    setAStreet(addr.line);
    setACountry("Bangladesh");
    setACity("Dhaka");
    setAState("Dhaka Division");
    setAZip("1212");
    setAPhone("+880 1700-000000");
    setAEmail("example@gmail.com");
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (editingId === id) {
      setEditingId(null);
      resetAddressForm();
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const name = `${aFirst.trim()} ${aLast.trim()}`.trim();
    const line = [aStreet, aCity, aState, aZip, aCountry]
      .filter(Boolean)
      .join(", ");
    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, name, line } : a))
      );
      setAddrMsg("Address updated successfully!");
    } else {
      setAddresses((prev) => [
        ...prev,
        { id: String(Date.now()), name, line },
      ]);
      setAddrMsg("Address added successfully!");
    }
    setEditingId(null);
    resetAddressForm();
    setTimeout(() => setAddrMsg(""), 2500);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = cardNumber.replace(/\s/g, "");
    const last4 = digits.slice(-4) || "0000";
    if (saveCard) {
      setCards((prev) => [
        ...prev,
        { id: String(Date.now()), brand: "visa", last4 },
      ]);
    }
    setPayMsg("Card added successfully!");
    setCardName("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setTimeout(() => setPayMsg(""), 2500);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
        {/* Left menu */}
        <aside className="flex flex-col gap-3">
          {menu.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleMenu(item.id)}
                className={`rounded-2xl px-6 py-4 text-left text-sm font-semibold transition ${
                  active
                    ? "bg-[#FBC617] text-[#1a1a1a] shadow-sm"
                    : "border border-[#e5e5e5] bg-white text-[#1a1a1a] hover:border-[#1E7F57]"
                } ${
                  item.id === "admin"
                    ? "border-[#1E7F57] bg-[#E8F3EE] text-[#1E7F57]"
                    : ""
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </aside>

        {/* Right content */}
        <div className="min-w-0">
          {/* ===== PERSONAL ===== */}
          {tab === "personal" && (
            <form onSubmit={handleUpdatePersonal} className="max-w-2xl">
              <div className="mb-10 flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#d4ebe0] to-[#a8d4b8] text-5xl ring-4 ring-white shadow-md">
                    👩
                  </div>
                  <button
                    type="button"
                    aria-label="Edit photo"
                    className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#1E7F57] text-white shadow ring-2 ring-white hover:bg-[#166b48]"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputCls}
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={`${inputCls} appearance-none bg-white`}
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6b6b]"
                  />
                </div>
              </div>

              {saved && (
                <p className="mt-4 text-sm font-semibold text-[#1E7F57]">
                  Profile updated successfully!
                </p>
              )}

              <button
                type="submit"
                className="mt-8 rounded-full bg-[#1E7F57] px-10 py-3.5 text-sm font-semibold text-white hover:bg-[#166b48]"
              >
                Update Changes
              </button>
            </form>
          )}

          {/* ===== MY ORDERS ===== */}
          {tab === "orders" && (
            <div>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#1a1a1a]">
                  <Package className="text-[#1E7F57]" size={24} />
                  Orders ({orders.length})
                </h2>
                <div className="flex items-center gap-2 text-sm text-[#6b6b6b]">
                  <span>Sort by :</span>
                  <div className="relative">
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="appearance-none rounded-full border border-[#e5e5e5] bg-white py-2 pl-4 pr-10 text-sm font-medium text-[#1a1a1a] outline-none focus:border-[#1E7F57]"
                    >
                      <option value="all">All</option>
                      <option value="accepted">Accepted</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]"
                    />
                  </div>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="rounded-2xl border border-[#e5e5e5] p-12 text-center">
                  <Package size={40} className="mx-auto text-[#c4c4c4]" />
                  <p className="mt-4 font-semibold text-[#1a1a1a]">
                    No orders found
                  </p>
                  <Link
                    href="/shop"
                    className="mt-4 inline-flex rounded-full bg-[#1E7F57] px-6 py-2.5 text-sm font-semibold text-white"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white shadow-sm"
                    >
                      <div className="grid grid-cols-2 gap-3 bg-[#FBC617] px-5 py-4 sm:grid-cols-4 sm:gap-0">
                        <div className="sm:border-r sm:border-black/10 sm:pr-4">
                          <p className="text-[11px] font-medium text-[#1a1a1a]/70">
                            Order ID
                          </p>
                          <p className="mt-0.5 text-sm font-bold text-[#1a1a1a]">
                            {order.id}
                          </p>
                        </div>
                        <div className="sm:border-r sm:border-black/10 sm:px-4">
                          <p className="text-[11px] font-medium text-[#1a1a1a]/70">
                            Total Payment
                          </p>
                          <p className="mt-0.5 text-sm font-bold text-[#1a1a1a]">
                            ৳{order.total.toFixed(2)}
                          </p>
                        </div>
                        <div className="sm:border-r sm:border-black/10 sm:px-4">
                          <p className="text-[11px] font-medium text-[#1a1a1a]/70">
                            Payment Method
                          </p>
                          <p className="mt-0.5 text-sm font-bold text-[#1a1a1a]">
                            {order.paymentMethod}
                          </p>
                        </div>
                        <div className="sm:pl-4">
                          <p className="text-[11px] font-medium text-[#1a1a1a]/70">
                            {order.dateType === "delivered"
                              ? "Delivered Date"
                              : "Estimated Delivery Date"}
                          </p>
                          <p className="mt-0.5 text-sm font-bold text-[#1a1a1a]">
                            {order.dateLabel}
                          </p>
                        </div>
                      </div>

                      <div className="divide-y divide-[#e5e5e5] px-5">
                        {order.items.map((item, idx) => (
                          <div
                            key={`${order.id}-${idx}`}
                            className="flex items-center gap-4 py-4"
                          >
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#e5e5e5] bg-[#F9F9F9] text-3xl">
                              {item.emoji}
                            </div>
                            <div>
                              <p className="font-semibold text-[#1a1a1a]">
                                {item.name}
                              </p>
                              <p className="text-sm text-[#6b6b6b]">
                                {item.weight} | {item.qty} Qty.
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-[#e5e5e5] px-5 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${
                              order.status === "delivered"
                                ? "border-[#1E7F57] text-[#1E7F57]"
                                : "border-[#f5a623] text-[#f5a623]"
                            }`}
                          >
                            {order.status === "delivered"
                              ? "Delivered"
                              : "Accepted"}
                          </span>
                          <span className="text-sm text-[#6b6b6b]">
                            {order.statusText}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          {order.status === "delivered" ? (
                            <button
                              type="button"
                              className="rounded-full bg-[#1E7F57] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#166b48]"
                            >
                              Add Review
                            </button>
                          ) : (
                            <Link
                              href="/track-order"
                              className="rounded-full bg-[#1E7F57] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#166b48]"
                            >
                              Track Order
                            </Link>
                          )}

                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded-full border border-[#1E7F57] px-6 py-2.5 text-sm font-semibold text-[#1E7F57] transition hover:bg-[#E8F3EE]"
                          >
                            Invoice
                          </button>

                          {order.status !== "delivered" && (
                            <button
                              type="button"
                              className="ml-auto text-sm font-semibold text-red-500 transition hover:underline"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== ADDRESS ===== */}
          {tab === "address" && (
            <div className="max-w-3xl">
              <div className="mb-6 flex items-center gap-3">
                <MapPin className="text-[#1E7F57]" size={24} />
                <h2 className="text-xl font-bold text-[#1a1a1a]">
                  Manage Address
                </h2>
              </div>

              {addresses.length > 0 && (
                <div className="mb-8 overflow-hidden rounded-2xl border border-[#e5e5e5]">
                  {addresses.map((addr, i) => (
                    <div
                      key={addr.id}
                      className={`flex flex-wrap items-start justify-between gap-4 px-5 py-5 ${
                        i !== addresses.length - 1
                          ? "border-b border-[#e5e5e5]"
                          : ""
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-[#1a1a1a]">
                          {addr.name}
                        </p>
                        <p className="mt-1 text-sm text-[#6b6b6b]">
                          {addr.line}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-semibold">
                        <button
                          type="button"
                          onClick={() => fillFormForEdit(addr)}
                          className="text-[#1E7F57] transition hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-red-500 transition hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h2 className="mb-6 text-xl font-bold text-[#1a1a1a]">
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>

              <form onSubmit={handleAddAddress} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={aFirst}
                      onChange={(e) => setAFirst(e.target.value)}
                      placeholder="Ex. John"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={aLast}
                      onChange={(e) => setALast(e.target.value)}
                      placeholder="Ex. Doe"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                    Company Name (Optional)
                  </label>
                  <input
                    value={aCompany}
                    onChange={(e) => setACompany(e.target.value)}
                    placeholder="Enter Company Name"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={aCountry}
                      onChange={(e) => setACountry(e.target.value)}
                      className={`${inputCls} appearance-none bg-white`}
                    >
                      <option value="">Select Country</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6b6b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={aStreet}
                    onChange={(e) => setAStreet(e.target.value)}
                    placeholder="Enter Street Address"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                    City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={aCity}
                      onChange={(e) => setACity(e.target.value)}
                      className={`${inputCls} appearance-none bg-white`}
                    >
                      <option value="">Select City</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Rajshahi">Rajshahi</option>
                    </select>
                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6b6b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                    State <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={aState}
                      onChange={(e) => setAState(e.target.value)}
                      className={`${inputCls} appearance-none bg-white`}
                    >
                      <option value="">Select State</option>
                      <option value="Dhaka Division">Dhaka Division</option>
                      <option value="Chittagong Division">
                        Chittagong Division
                      </option>
                      <option value="Rajshahi Division">
                        Rajshahi Division
                      </option>
                      <option value="Khulna Division">Khulna Division</option>
                      <option value="Sylhet Division">Sylhet Division</option>
                    </select>
                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6b6b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                    Zip Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={aZip}
                    onChange={(e) => setAZip(e.target.value)}
                    placeholder="Enter Zip Code"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    value={aPhone}
                    onChange={(e) => setAPhone(e.target.value)}
                    placeholder="Enter Phone Number"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={aEmail}
                    onChange={(e) => setAEmail(e.target.value)}
                    placeholder="Enter Email Address"
                    className={inputCls}
                  />
                </div>

                {addrMsg && (
                  <p className="text-sm font-semibold text-[#1E7F57]">
                    {addrMsg}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    className="rounded-full bg-[#1E7F57] px-10 py-3.5 text-sm font-semibold text-white transition hover:bg-[#166b48]"
                  >
                    {editingId ? "Update Address" : "Add Address"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        resetAddressForm();
                      }}
                      className="rounded-full border border-[#e5e5e5] px-8 py-3.5 text-sm font-semibold text-[#1a1a1a] hover:border-[#1E7F57]"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* ===== PAYMENT ===== */}
          {tab === "payment" && (
            <div className="max-w-2xl space-y-4">
              <div className="mb-6 flex items-center gap-3 border-b border-[#e5e5e5] pb-4">
                <CreditCard className="text-[#1E7F57]" size={24} />
                <h2 className="text-xl font-bold text-[#1a1a1a]">
                  Payment Method
                </h2>
              </div>

              {/* bKash */}
              <div className="overflow-hidden rounded-2xl border border-[#e5e5e5]">
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E2136E] text-xs font-bold text-white">
                      bK
                    </span>
                    <div>
                      <p className="font-semibold text-[#1a1a1a]">bKash</p>
                      {bkashLinked && bkashNumber && (
                        <p className="text-sm text-[#6b6b6b]">{bkashNumber}</p>
                      )}
                    </div>
                  </div>
                  {bkashLinked ? (
                    <button
                      type="button"
                      onClick={() => {
                        setBkashLinked(false);
                        setBkashNumber("");
                        setShowBkashForm(false);
                        setPayMsg("bKash unlinked");
                        setTimeout(() => setPayMsg(""), 2000);
                      }}
                      className="text-sm font-semibold text-red-500 hover:underline"
                    >
                      Unlink
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setShowBkashForm((v) => !v);
                        setShowNagadForm(false);
                      }}
                      className="text-sm font-semibold text-[#1E7F57] hover:underline"
                    >
                      Link Account
                    </button>
                  )}
                </div>

                {showBkashForm && !bkashLinked && (
                  <div className="space-y-3 border-t border-[#e5e5e5] px-5 py-4">
                    <label className="block text-sm font-semibold text-[#1a1a1a]">
                      bKash Number *
                    </label>
                    <input
                      type="tel"
                      value={bkashNumber}
                      onChange={(e) => setBkashNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!bkashNumber.trim() || bkashNumber.length < 11) {
                          alert("Enter a valid bKash number");
                          return;
                        }
                        setBkashLinked(true);
                        setShowBkashForm(false);
                        setPayMsg("bKash linked successfully!");
                        setTimeout(() => setPayMsg(""), 2000);
                      }}
                      className="rounded-full bg-[#E2136E] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                    >
                      Confirm bKash
                    </button>
                  </div>
                )}
              </div>

              {/* Nagad */}
              <div className="overflow-hidden rounded-2xl border border-[#e5e5e5]">
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6921E] text-xs font-bold text-white">
                      N
                    </span>
                    <div>
                      <p className="font-semibold text-[#1a1a1a]">Nagad</p>
                      {nagadLinked && nagadNumber && (
                        <p className="text-sm text-[#6b6b6b]">{nagadNumber}</p>
                      )}
                    </div>
                  </div>
                  {nagadLinked ? (
                    <button
                      type="button"
                      onClick={() => {
                        setNagadLinked(false);
                        setNagadNumber("");
                        setShowNagadForm(false);
                        setPayMsg("Nagad unlinked");
                        setTimeout(() => setPayMsg(""), 2000);
                      }}
                      className="text-sm font-semibold text-red-500 hover:underline"
                    >
                      Unlink
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setShowNagadForm((v) => !v);
                        setShowBkashForm(false);
                      }}
                      className="text-sm font-semibold text-[#1E7F57] hover:underline"
                    >
                      Link Account
                    </button>
                  )}
                </div>

                {showNagadForm && !nagadLinked && (
                  <div className="space-y-3 border-t border-[#e5e5e5] px-5 py-4">
                    <label className="block text-sm font-semibold text-[#1a1a1a]">
                      Nagad Number *
                    </label>
                    <input
                      type="tel"
                      value={nagadNumber}
                      onChange={(e) => setNagadNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!nagadNumber.trim() || nagadNumber.length < 11) {
                          alert("Enter a valid Nagad number");
                          return;
                        }
                        setNagadLinked(true);
                        setShowNagadForm(false);
                        setPayMsg("Nagad linked successfully!");
                        setTimeout(() => setPayMsg(""), 2000);
                      }}
                      className="rounded-full bg-[#F6921E] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                    >
                      Confirm Nagad
                    </button>
                  </div>
                )}
              </div>

              {/* Saved Visa cards */}
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between rounded-2xl border border-[#e5e5e5] px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <FaCcVisa className="text-[#1434CB]" size={32} />
                    <span className="font-semibold tracking-wide text-[#1a1a1a]">
                      **** **** **** {card.last4}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setCards((prev) => prev.filter((c) => c.id !== card.id))
                    }
                    className="text-sm font-semibold text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}

              {/* Cash on Delivery */}
              <div className="flex items-center justify-between rounded-2xl border border-[#e5e5e5] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3EE] text-lg">
                    💵
                  </span>
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">
                      Cash on Delivery
                    </p>
                    <p className="text-sm text-[#6b6b6b]">
                      Available at checkout
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-[#E8F3EE] px-3 py-1 text-xs font-bold text-[#1E7F57]">
                  Always on
                </span>
              </div>

              {/* Add New Card form */}
              <div className="overflow-hidden rounded-2xl border border-[#e5e5e5]">
                <label className="flex cursor-pointer items-center gap-3 px-5 py-4 hover:bg-[#F9F9F9]">
                  <input
                    type="radio"
                    name="addcard"
                    checked={showCardForm}
                    onChange={() => setShowCardForm(true)}
                    className="h-4 w-4 cursor-pointer accent-[#1E7F57]"
                  />
                  <CreditCard size={20} className="text-[#1E7F57]" />
                  <span className="font-semibold text-[#1a1a1a]">
                    Add New Credit/Debit Card
                  </span>
                </label>

                {showCardForm && (
                  <form
                    onSubmit={handleAddCard}
                    className="space-y-5 border-t border-[#e5e5e5] px-5 pb-6 pt-5"
                  >
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                        Card Holder Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Ex. John Doe"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                        Card Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4716 9627 1635 8047"
                        className={inputCls}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                          Expiry Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="02/30"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                          CVV <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="000"
                          maxLength={4}
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <label className="flex cursor-pointer items-center gap-3 pt-2">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="h-4 w-4 cursor-pointer rounded accent-[#1E7F57]"
                      />
                      <span className="text-sm font-medium text-[#1a1a1a]">
                        Save card for future payments
                      </span>
                    </label>
                    {payMsg && (
                      <p className="text-sm font-semibold text-[#1E7F57]">
                        {payMsg}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="rounded-full bg-[#1E7F57] px-10 py-3.5 text-sm font-semibold text-white transition hover:bg-[#166b48]"
                    >
                      Add Card
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ===== PASSWORD MANAGER ===== */}
          {tab === "password" && (
            <form onSubmit={handleUpdatePassword} className="max-w-xl">
              <div className="mb-6 flex items-center gap-3">
                <Lock className="text-[#1E7F57]" size={24} />
                <h2 className="text-xl font-bold text-[#1a1a1a]">
                  Password Manager
                </h2>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    required
                    type={showCurrent ? "text" : "password"}
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter Password"
                    className={`${inputCls} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E7F57]"
                    aria-label={
                      showCurrent ? "Hide password" : "Show password"
                    }
                  >
                    {showCurrent ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                <div className="mt-2 flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-[#1E7F57] underline underline-offset-4 hover:text-[#166b48]"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  New Password
                </label>
                <div className="relative">
                  <input
                    required
                    type={showNew ? "text" : "password"}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Enter Password"
                    className={`${inputCls} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E7F57]"
                    aria-label={showNew ? "Hide password" : "Show password"}
                  >
                    {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    required
                    type={showConfirm ? "text" : "password"}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Enter Password"
                    className={`${inputCls} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E7F57]"
                    aria-label={
                      showConfirm ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {saved && (
                <p className="mt-4 text-sm font-semibold text-[#1E7F57]">
                  Password updated successfully!
                </p>
              )}

              <button
                type="submit"
                className="mt-8 rounded-full bg-[#1E7F57] px-10 py-3.5 text-sm font-semibold text-white transition hover:bg-[#166b48]"
              >
                Update Password
              </button>
            </form>
          )}

          {/* ===== LOGOUT ===== */}
          {tab === "logout" && (
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a]">Logout</h2>
              <p className="mt-2 text-sm text-[#6b6b6b]">
                Are you sure you want to log out?
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-6 rounded-full bg-[#1E7F57] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#166b48]"
              >
                Yes, Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}