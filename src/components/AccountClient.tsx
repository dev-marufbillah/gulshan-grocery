"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  Pencil,
  ChevronDown,
  Package,
  MapPin,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  X,
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
  status: string;
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

interface RawOrderItem {
  name?: string;
  weight?: string;
  quantity?: number;
  qty?: number;
  emoji?: string;
}

interface RawOrder {
  _id: string;
  totalAmount?: number;
  paymentMethod?: string;
  createdAt: string;
  status?: string;
  items?: RawOrderItem[];
}

const BASE_MENU: { id: Tab; label: string }[] = [
  { id: "personal", label: "Personal Information" },
  { id: "orders", label: "My Orders" },
  { id: "address", label: "Manage Address" },
  { id: "payment", label: "Payment Method" },
  { id: "password", label: "Password Manager" },
  { id: "logout", label: "Logout" },
];

const inputCls =
  "w-full rounded-full border border-[#e5e5e5] px-4 sm:px-5 py-3 sm:py-3.5 text-sm outline-none transition focus:border-[#1E7F57] bg-transparent";

export default function AccountClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tab, setTab] = useState<Tab>("personal");
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

  // Real Database States
  const [dbOrders, setDbOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  
  const [updatedOrders, setUpdatedOrders] = useState<Record<string, string>>({});
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleCancelSubmit = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please enter a reason for cancellation");
      return;
    }
    setCancelLoading(true);
    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: selectedOrderId, reason: cancelReason }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Cancellation request sent to Admin successfully!");
        if (selectedOrderId) {
          setUpdatedOrders((prev) => ({ ...prev, [selectedOrderId]: "Cancel Requested" }));
        }
        setCancelModalOpen(false);
        setCancelReason("");
      } else {
        toast.error(data.error || "Failed to submit request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setCancelLoading(false);
    }
  };

  // Personal State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Female");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Database Fetching (Profile & Orders)
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        // Fetch Profile
        const resProfile = await fetch("/api/profile");
        if (resProfile.ok) {
          const parsed = await resProfile.json();
          const data = parsed.user || parsed;
          const fullName = data?.name || session?.user?.name || "";
          if (fullName) {
            const parts = fullName.trim().split(" ");
            setFirstName(parts[0] || "");
            setLastName(parts.slice(1).join(" ") || "");
          }
          setEmail(data?.email || session?.user?.email || "");
          if (data?.phone) setPhone(data.phone);
          if (data?.gender) setGender(data.gender);
          if (data?.image) setProfilePic(data.image);
          else if (session?.user?.image) setProfilePic(session.user.image);
          
          if (data?.addresses && Array.isArray(data.addresses)) {
            setAddresses(data.addresses);
          }
        }

        // Fetch Orders
        const resOrders = await fetch("/api/orders");
        if (resOrders.ok) {
          const parsed = await resOrders.json();
          if (parsed.orders) {
            const mappedOrders = parsed.orders.map((o: RawOrder) => ({
              id: o._id,
              total: o.totalAmount || 0,
              paymentMethod: o.paymentMethod || "Cash On Delivery",
              dateLabel: new Date(o.createdAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric"
              }),
              dateType: o.status === "Delivered" ? "delivered" : "estimated",
              status: o.status || "Pending",
              statusText: `Your Order is ${o.status || "Pending"}`,
              items: o.items?.map((i: RawOrderItem) => ({
                name: i.name || "Product",
                weight: i.weight || "",
                qty: i.quantity || i.qty || 1,
                emoji: i.emoji || "📦",
              })) || [],
            }));
            setDbOrders(mappedOrders);
          }
        }
      } catch (error) {
        console.error("Failed to fetch real data:", error);
      }
    };

    if (status === "authenticated") {
      fetchRealData();
    }
  }, [status, session]);

  // Password State
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Address State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [aFirst, setAFirst] = useState("");
  const [aLast, setALast] = useState("");
  const [aCompany, setACompany] = useState("");
  const [aCountry, setACountry] = useState("Bangladesh");
  const [aStreet, setAStreet] = useState("");
  const [aCity, setACity] = useState("Dhaka");
  const [aState, setAState] = useState("Dhaka Division");
  const [aZip, setAZip] = useState("1212");
  const [aPhone, setAPhone] = useState("");
  const [aEmail, setAEmail] = useState("");

  // Payment State
  const [bkashLinked, setBkashLinked] = useState(false);
  const [nagadLinked, setNagadLinked] = useState(false);
  const [bkashNumber, setBkashNumber] = useState("");
  const [nagadNumber, setNagadNumber] = useState("");
  const [showBkashForm, setShowBkashForm] = useState(false);
  const [showNagadForm, setShowNagadForm] = useState(false);
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [showCardForm] = useState(true);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  // Orders display logic
  const filteredOrders = useMemo(() => {
    let list = [...dbOrders];
    if (sort === "delivered") {
      list = list.filter((o) => (updatedOrders[o.id] || o.status).toLowerCase() === "delivered");
    }
    if (sort === "accepted") {
      list = list.filter((o) => {
        const s = (updatedOrders[o.id] || o.status).toLowerCase();
        return s === "accepted" || s === "processing" || s === "pending";
      });
    }
    return list;
  }, [sort, dbOrders, updatedOrders]);

  const handleMenu = (id: Tab) => {
    if (id === "admin") {
      router.push("/admin");
      return;
    }
    setTab(id);
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
    setAPhone("");
    setAEmail("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        setProfilePic(canvas.toDataURL("image/webp", 0.75));
      };
    };
  };

  const handleUpdatePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, phone, gender, image: profilePic }),
      });
      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass.trim()) return toast.error("Enter current password");
    if (newPass.length < 6) return toast.error("New password must be 6+ chars");
    if (newPass !== confirmPass) return toast.error("Passwords mismatch");
    toast.success("Password updated successfully!");
    setCurrentPass(""); setNewPass(""); setConfirmPass("");
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
  };

  const updateDatabaseAddresses = async (newAddrs: Address[]) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: newAddrs }),
      });
      if (res.ok) {
        setAddresses(newAddrs);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    const success = await updateDatabaseAddresses(updated);
    if (success) {
      toast.success("Address deleted");
      if (editingId === id) { setEditingId(null); resetAddressForm(); }
    } else {
      toast.error("Failed to delete address");
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = `${aFirst.trim()} ${aLast.trim()}`.trim();
    const line = [aStreet, aCity, aState, aZip, aCountry].filter(Boolean).join(", ");
    let updated: Address[];
    if (editingId) {
      updated = addresses.map((a) => (a.id === editingId ? { ...a, name, line } : a));
    } else {
      const generatedId = `addr_${addresses.length + 1}`;
      updated = [...addresses, { id: generatedId, name, line }];
    }
    
    const success = await updateDatabaseAddresses(updated);
    if (success) {
      toast.success(editingId ? "Address updated!" : "Address added!");
      setEditingId(null);
      resetAddressForm();
    } else {
      toast.error("Failed to save address");
    }
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = cardNumber.replace(/\s/g, "");
    const last4 = digits.slice(-4) || "0000";
    if (saveCard) {
      setCards((prev) => [...prev, { id: `card_${prev.length + 1}`, brand: "visa", last4 }]);
    }
    toast.success("Card added successfully!");
    setCardName(""); setCardNumber(""); setCardExpiry(""); setCardCvv("");
  };

  if (status === "loading") {
    return <div className="py-20 text-center font-bold text-[#1E7F57]">Loading Profile...</div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-14 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-12">
        <aside className="flex flex-row flex-wrap justify-center lg:justify-start lg:flex-col gap-2 sm:gap-3 pb-4 lg:pb-0 border-b border-gray-200 lg:border-none mb-2 lg:mb-0">
          {menu.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleMenu(item.id)}
                className={`shrink-0 whitespace-nowrap rounded-full lg:rounded-2xl px-4 sm:px-6 py-2.5 lg:py-4 text-center lg:text-left text-xs sm:text-sm font-semibold transition ${
                  active
                    ? "bg-[#FBC617] text-[#1a1a1a] shadow-xs"
                    : "border border-[#e5e5e5] bg-white text-[#1a1a1a] hover:border-[#1E7F57]"
                } ${item.id === "admin" ? "border-[#1E7F57] bg-[#E8F3EE] text-[#1E7F57]" : ""}`}
              >
                {item.label}
              </button>
            );
          })}
        </aside>

        <div className="min-w-0">
          {/* PERSONAL */}
          {tab === "personal" && (
            <form onSubmit={handleUpdatePersonal} className="max-w-2xl">
              <div className="mb-8 sm:mb-10 flex justify-center lg:justify-start">
                <div className="relative group">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-24 w-24 sm:h-28 sm:w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#d4ebe0] to-[#a8d4b8] text-4xl sm:text-5xl font-bold text-[#1E7F57] ring-4 ring-white shadow-md transition-opacity group-hover:opacity-90"
                    title="Click to upload photo"
                  >
                    {profilePic ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profilePic} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      firstName ? firstName.charAt(0).toUpperCase() : "U"
                    )}
                  </div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} aria-label="Edit photo" className="absolute bottom-1 right-1 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#1E7F57] text-white shadow ring-2 ring-white hover:bg-[#166b48]">
                    <Pencil size={14} />
                  </button>
                </div>
              </div>
              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#1a1a1a]">First Name <span className="text-red-500">*</span></label>
                  <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#1a1a1a]">Last Name <span className="text-red-500">*</span></label>
                  <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="mt-4 sm:mt-5">
                <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#1a1a1a]">Email <span className="text-red-500">*</span></label>
                <input required type="email" value={email} readOnly className={`${inputCls} bg-gray-50 opacity-70 cursor-not-allowed`} />
              </div>
              <div className="mt-4 sm:mt-5">
                <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#1a1a1a]">Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
              </div>
              <div className="mt-4 sm:mt-5">
                <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#1a1a1a]">Gender <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select required value={gender} onChange={(e) => setGender(e.target.value)} className={`${inputCls} appearance-none bg-white`}>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6b6b]" />
                </div>
              </div>
              <button type="submit" disabled={isUpdating} className="mt-6 sm:mt-8 w-full sm:w-auto rounded-full bg-[#1E7F57] px-10 py-3.5 text-sm font-semibold text-white hover:bg-[#166b48] transition-colors disabled:opacity-50">
                {isUpdating ? "Saving..." : "Update Changes"}
              </button>
            </form>
          )}

          {/* ORDERS */}
          {tab === "orders" && (
            <div>
              <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-[#1a1a1a]">
                  <Package className="text-[#1E7F57]" size={22} /> Orders ({filteredOrders.length})
                </h2>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6b6b6b]">
                  <span className="shrink-0">Sort by :</span>
                  <div className="relative w-full sm:w-auto">
                    <select value={sort} onChange={(e) => setSort(e.target.value)} className="appearance-none w-full sm:w-auto rounded-full border border-[#e5e5e5] bg-white py-2 pl-4 pr-10 text-xs sm:text-sm font-medium text-[#1a1a1a] outline-none focus:border-[#1E7F57]">
                      <option value="all">All</option>
                      <option value="accepted">Accepted</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]" />
                  </div>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="rounded-2xl border border-[#e5e5e5] p-10 sm:p-12 text-center">
                  <Package size={36} className="mx-auto text-[#c4c4c4]" />
                  <p className="mt-4 text-sm sm:text-base font-semibold text-[#1a1a1a]">No orders found</p>
                  <Link href="/shop" className="mt-4 inline-flex rounded-full bg-[#1E7F57] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {filteredOrders.map((order) => {
                    const currentStatus = updatedOrders[order.id] || order.status;
                    return (
                      <div key={order.id} className="overflow-hidden rounded-xl sm:rounded-2xl border border-[#e5e5e5] bg-white shadow-xs">
                        <div className="grid grid-cols-2 gap-3 bg-[#FBC617] px-4 py-3 sm:px-5 sm:py-4 sm:grid-cols-4 sm:gap-0">
                          <div className="sm:border-r sm:border-black/10 sm:pr-4">
                            <p className="text-[10px] sm:text-[11px] font-medium text-[#1a1a1a]/70">Order ID</p>
                            <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#1a1a1a] truncate">#{order.id.slice(-6).toUpperCase()}</p>
                          </div>
                          <div className="sm:border-r sm:border-black/10 sm:px-4">
                            <p className="text-[10px] sm:text-[11px] font-medium text-[#1a1a1a]/70">Total Payment</p>
                            <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#1a1a1a]">৳{order.total.toFixed(2)}</p>
                          </div>
                          <div className="sm:border-r sm:border-black/10 sm:px-4">
                            <p className="text-[10px] sm:text-[11px] font-medium text-[#1a1a1a]/70">Payment Method</p>
                            <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#1a1a1a] truncate">{order.paymentMethod}</p>
                          </div>
                          <div className="sm:pl-4">
                            <p className="text-[10px] sm:text-[11px] font-medium text-[#1a1a1a]/70">{order.dateType === "delivered" ? "Delivered Date" : "Order Date"}</p>
                            <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#1a1a1a]">{order.dateLabel}</p>
                          </div>
                        </div>

                        <div className="divide-y divide-[#e5e5e5] px-4 sm:px-5">
                          {order.items.map((item, idx) => (
                            <div key={`${order.id}-${idx}`} className="flex items-center gap-3 sm:gap-4 py-3 sm:py-4">
                              <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl border border-[#e5e5e5] bg-[#F9F9F9] text-2xl sm:text-3xl">{item.emoji}</div>
                              <div>
                                <p className="text-sm sm:text-base font-semibold text-[#1a1a1a]">{item.name}</p>
                                <p className="text-xs sm:text-sm text-[#6b6b6b]">{item.weight} | {item.qty} Qty.</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-[#e5e5e5] px-4 sm:px-5 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold ${
                              currentStatus === "Delivered" ? "border-[#1E7F57] text-[#1E7F57]"
                              : currentStatus === "Cancel Requested" ? "border-amber-500 text-amber-500"
                              : currentStatus === "Cancelled" ? "border-red-500 text-red-500"
                              : "border-[#f5a623] text-[#f5a623]"
                            }`}>
                              {currentStatus === "Cancel Requested" ? "Pending Approval" : currentStatus}
                            </span>
                            <span className="text-xs sm:text-sm text-[#6b6b6b]">
                              {currentStatus === "Cancel Requested" ? "Cancellation request under review"
                              : currentStatus === "Cancelled" ? "This order has been cancelled"
                              : order.statusText}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
                            {currentStatus === "Delivered" ? (
                              <button type="button" className="w-full sm:w-auto rounded-full bg-[#1E7F57] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#166b48]">Add Review</button>
                            ) : (
                              <Link href="/track-order" className="w-full sm:w-auto text-center rounded-full bg-[#1E7F57] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#166b48]">Track Order</Link>
                            )}
                            <button type="button" onClick={() => window.print()} className="w-full sm:w-auto rounded-full border border-[#1E7F57] px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#1E7F57] transition hover:bg-[#E8F3EE]">Invoice</button>
                            
                            {currentStatus !== "Delivered" && currentStatus !== "Cancelled" && currentStatus !== "Cancel Requested" && (
                              <button type="button" onClick={() => { setSelectedOrderId(order.id); setCancelModalOpen(true); }} className="w-full sm:w-auto sm:ml-auto text-xs sm:text-sm font-semibold text-red-500 transition hover:underline py-2 sm:py-0 text-center">Cancel Order</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ADDRESS */}
          {tab === "address" && (
            <div className="max-w-3xl">
              <div className="mb-5 sm:mb-6 flex items-center gap-2.5 sm:gap-3">
                <MapPin className="text-[#1E7F57]" size={22} />
                <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a]">Manage Address</h2>
              </div>
              {addresses.length > 0 && (
                <div className="mb-6 sm:mb-8 overflow-hidden rounded-xl sm:rounded-2xl border border-[#e5e5e5]">
                  {addresses.map((addr, i) => (
                    <div key={addr.id} className={`flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 px-4 sm:px-5 py-4 sm:py-5 ${i !== addresses.length - 1 ? "border-b border-[#e5e5e5]" : ""}`}>
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-[#1a1a1a]">{addr.name}</p>
                        <p className="mt-1 text-xs sm:text-sm text-[#6b6b6b]">{addr.line}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold shrink-0">
                        <button type="button" onClick={() => fillFormForEdit(addr)} className="text-[#1E7F57] transition hover:underline">Edit</button>
                        <button type="button" onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 transition hover:underline">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-[#1a1a1a]">{editingId ? "Edit Address" : "Add New Address"}</h2>
              <form onSubmit={handleAddAddress} className="space-y-4 sm:space-y-5">
                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#1a1a1a]">First Name <span className="text-red-500">*</span></label>
                    <input required value={aFirst} onChange={(e) => setAFirst(e.target.value)} placeholder="Ex. John" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#1a1a1a]">Last Name <span className="text-red-500">*</span></label>
                    <input required value={aLast} onChange={(e) => setALast(e.target.value)} placeholder="Ex. Doe" className={inputCls} />
                  </div>
                </div>
                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#1a1a1a]">Company (Optional)</label>
                    <input value={aCompany} onChange={(e) => setACompany(e.target.value)} placeholder="Company" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#1a1a1a]">Country <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select required value={aCountry} onChange={(e) => setACountry(e.target.value)} className={`${inputCls} appearance-none bg-white`}>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="India">India</option>
                      </select>
                      <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6b6b]" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#1a1a1a]">Street Address <span className="text-red-500">*</span></label>
                  <input required value={aStreet} onChange={(e) => setAStreet(e.target.value)} placeholder="Enter Street Address" className={inputCls} />
                </div>
                <div className="grid gap-4 sm:gap-5 sm:grid-cols-3">
                  <div>
                    <input value={aCity} onChange={(e) => setACity(e.target.value)} placeholder="City" className={inputCls} />
                  </div>
                  <div>
                    <input value={aState} onChange={(e) => setAState(e.target.value)} placeholder="State" className={inputCls} />
                  </div>
                  <div>
                    <input value={aZip} onChange={(e) => setAZip(e.target.value)} placeholder="Zip Code" className={inputCls} />
                  </div>
                </div>
                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                  <div>
                    <input value={aPhone} onChange={(e) => setAPhone(e.target.value)} placeholder="Phone" className={inputCls} />
                  </div>
                  <div>
                    <input value={aEmail} onChange={(e) => setAEmail(e.target.value)} placeholder="Email" className={inputCls} />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
                  <button type="submit" className="w-full sm:w-auto rounded-full bg-[#1E7F57] px-8 sm:px-10 py-3.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#166b48]">{editingId ? "Update Address" : "Add Address"}</button>
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); resetAddressForm(); }} className="w-full sm:w-auto rounded-full border border-[#e5e5e5] px-8 py-3.5 text-xs sm:text-sm font-semibold text-[#1a1a1a] hover:border-[#1E7F57]">Cancel</button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* PAYMENT */}
          {tab === "payment" && (
            <div className="max-w-2xl space-y-4">
              <div className="mb-5 sm:mb-6 flex items-center gap-2.5 sm:gap-3 border-b border-[#e5e5e5] pb-3 sm:pb-4">
                <CreditCard className="text-[#1E7F57]" size={22} />
                <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a]">Payment Method</h2>
              </div>
              <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-[#e5e5e5]">
                <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#E2136E] text-[10px] sm:text-xs font-bold text-white shrink-0">bK</span>
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-[#1a1a1a]">bKash</p>
                      {bkashLinked && <p className="text-xs sm:text-sm text-[#6b6b6b]">{bkashNumber}</p>}
                    </div>
                  </div>
                  {bkashLinked ? (
                    <button type="button" onClick={() => { setBkashLinked(false); toast.success("bKash unlinked"); }} className="text-xs sm:text-sm font-semibold text-red-500 hover:underline">Unlink</button>
                  ) : (
                    <button type="button" onClick={() => setShowBkashForm(!showBkashForm)} className="text-xs sm:text-sm font-semibold text-[#1E7F57] hover:underline">Link Account</button>
                  )}
                </div>
                {showBkashForm && !bkashLinked && (
                  <div className="space-y-3 border-t border-[#e5e5e5] px-4 sm:px-5 py-3.5 sm:py-4">
                    <input type="tel" value={bkashNumber} onChange={(e) => setBkashNumber(e.target.value)} placeholder="bKash Number" className={inputCls} />
                    <button type="button" onClick={() => { setBkashLinked(true); setShowBkashForm(false); toast.success("bKash linked!"); }} className="rounded-full bg-[#E2136E] px-6 py-2.5 text-xs text-white">Confirm</button>
                  </div>
                )}
              </div>

              {/* Nagad */}
              <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-[#e5e5e5]">
                <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#F6921E] text-[10px] sm:text-xs font-bold text-white shrink-0">N</span>
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-[#1a1a1a]">Nagad</p>
                      {nagadLinked && <p className="text-xs sm:text-sm text-[#6b6b6b]">{nagadNumber}</p>}
                    </div>
                  </div>
                  {nagadLinked ? (
                    <button type="button" onClick={() => { setNagadLinked(false); toast.success("Nagad unlinked"); }} className="text-xs sm:text-sm font-semibold text-red-500 hover:underline">Unlink</button>
                  ) : (
                    <button type="button" onClick={() => setShowNagadForm(!showNagadForm)} className="text-xs sm:text-sm font-semibold text-[#1E7F57] hover:underline">Link Account</button>
                  )}
                </div>
                {showNagadForm && !nagadLinked && (
                  <div className="space-y-3 border-t border-[#e5e5e5] px-4 sm:px-5 py-3.5 sm:py-4">
                    <input type="tel" value={nagadNumber} onChange={(e) => setNagadNumber(e.target.value)} placeholder="Nagad Number" className={inputCls} />
                    <button type="button" onClick={() => { setNagadLinked(true); setShowNagadForm(false); toast.success("Nagad linked!"); }} className="rounded-full bg-[#F6921E] px-6 py-2.5 text-xs text-white">Confirm</button>
                  </div>
                )}
              </div>

              {/* Cards */}
              {cards.map((card) => (
                <div key={card.id} className="flex items-center justify-between rounded-xl border border-[#e5e5e5] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FaCcVisa size={24} className="text-[#1434CB]" />
                    <span>**** **** {card.last4}</span>
                  </div>
                </div>
              ))}

              {showCardForm && (
                <form onSubmit={handleAddCard} className="space-y-3 border-t pt-4">
                  <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Card Holder Name" className={inputCls} />
                  <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card Number" className={inputCls} />
                  <div className="grid grid-cols-2 gap-3">
                    <input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="Expiry Date" className={inputCls} />
                    <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="CVV" className={inputCls} />
                  </div>
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} /> Save card
                  </label>
                  <button type="submit" className="rounded-full bg-[#1E7F57] px-6 py-2.5 text-xs text-white">Add Card</button>
                </form>
              )}

              <div className="flex items-center justify-between rounded-xl sm:rounded-2xl border border-[#e5e5e5] px-4 sm:px-5 py-3.5 sm:py-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#E8F3EE] text-base sm:text-lg shrink-0">💵</span>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-[#1a1a1a]">Cash on Delivery</p>
                    <p className="text-xs sm:text-sm text-[#6b6b6b]">Available at checkout</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-[#E8F3EE] px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-[#1E7F57]">Always on</span>
              </div>
            </div>
          )}

          {/* PASSWORD */}
          {tab === "password" && (
            <form onSubmit={handleUpdatePassword} className="max-w-xl">
              <div className="mb-5 sm:mb-6 flex items-center gap-2.5 sm:gap-3">
                <Lock className="text-[#1E7F57]" size={22} />
                <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a]">Password Manager</h2>
              </div>
              <div>
                <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#1a1a1a]">Current Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input required type={showCurrent ? "text" : "password"} value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} placeholder="Enter Current Password" className={`${inputCls} pr-12`} />
                  <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E7F57]">
                    {showCurrent ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#1a1a1a]">New Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input required type={showNew ? "text" : "password"} value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="Enter New Password" className={`${inputCls} pr-12`} />
                  <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E7F57]">
                    {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#1a1a1a]">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input required type={showConfirm ? "text" : "password"} value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Confirm New Password" className={`${inputCls} pr-12`} />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E7F57]">
                    {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="mt-6 sm:mt-8 w-full sm:w-auto rounded-full bg-[#1E7F57] px-10 py-3.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#166b48]">Update Password</button>
            </form>
          )}

          {/* LOGOUT */}
          {tab === "logout" && (
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">Logout</h2>
              <p className="mt-2 text-xs sm:text-sm text-[#6b6b6b]">Are you sure you want to log out?</p>
              <button type="button" onClick={handleLogout} className="mt-5 sm:mt-6 w-full sm:w-auto rounded-full bg-[#1E7F57] px-8 py-3.5 sm:py-3 text-sm font-semibold text-white transition hover:bg-[#166b48]">Yes, Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Request Modal Popup */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-[#1a1a1a]">Cancel Order</h3>
              <button onClick={() => setCancelModalOpen(false)} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><X size={20} /></button>
            </div>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              className="mt-4 h-28 w-full rounded-xl border border-[#e5e5e5] p-3 text-sm text-[#1a1a1a] focus:border-[#1E7F57] focus:outline-none"
            />
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setCancelModalOpen(false)} disabled={cancelLoading} className="rounded-full bg-gray-100 px-5 py-2 text-xs font-semibold text-[#1a1a1a]">Close</button>
              <button onClick={handleCancelSubmit} disabled={cancelLoading} className="rounded-full bg-red-500 px-5 py-2 text-xs font-semibold text-white disabled:opacity-50">{cancelLoading ? "Submitting..." : "Submit Request"}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}