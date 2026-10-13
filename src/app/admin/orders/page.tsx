"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, ShoppingBag, CheckCircle2, AlertCircle } from "lucide-react";

type OrderData = {
  _id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  itemsSummary: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      } else {
        showToast(data.error || "Failed to load orders", "error");
      }
    } catch {
      showToast("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        if (isMounted) {
          if (res.ok) {
            setOrders(data.orders || []);
          }
        }
      } catch {
        if (isMounted) {
          showToast("Network error while loading orders", "error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const handleStatusChange = async (orderDbId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderDbId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(data.message, "success");
        fetchOrders();
      } else {
        showToast(data.error || "Failed to update status", "error");
      }
    } catch {
      showToast("Error updating status", "error");
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-6 py-4 text-white shadow-2xl transition-all ${
            toast.type === "success" ? "bg-[#1E7F57]" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={22} className="text-[#FBC617]" />
          ) : (
            <AlertCircle size={22} />
          )}
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Customer Orders</h1>
        <p className="text-sm text-[#6b6b6b]">
          Track and update real-time customer orders from database.
        </p>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-[#e5e5e5] bg-white shadow-sm">
        {/* Search Bar */}
        <div className="border-b border-[#e5e5e5] p-4">
          <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-[#e5e5e5] bg-[#F9F9F9] px-4 py-2 transition focus-within:border-[#1E7F57] focus-within:bg-white">
            <Search size={18} className="text-[#6b6b6b]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, name or phone..."
              className="w-full bg-transparent text-sm text-[#1a1a1a] outline-none"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#1a1a1a]">
            <thead className="bg-[#F9F9F9] text-xs font-bold uppercase tracking-wider text-[#6b6b6b]">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items Summary</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#6b6b6b]">
                    <div className="flex items-center justify-center gap-2">
                      <ShoppingBag
                        size={20}
                        className="animate-bounce text-[#1E7F57]"
                      />
                      <span>Loading real orders from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#6b6b6b]">
                    No orders found in database. Place a checkout order from customer site!
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o._id} className="transition hover:bg-[#F9F9F9]">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1a1a1a]">{o.orderId}</p>
                      <p className="text-xs text-[#6b6b6b]">{o.createdAt}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#1a1a1a]">{o.customerName}</p>
                      <p className="text-xs text-[#6b6b6b]">{o.phone}</p>
                      <p className="text-xs text-[#9a9a9a] line-clamp-1">{o.address}</p>
                    </td>
                    <td className="px-6 py-4 max-w-xs text-xs text-[#6b6b6b] font-medium leading-relaxed">
                      {o.itemsSummary}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#1E7F57]">
                      ৳{o.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#1a1a1a]">
                      {o.paymentMethod}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          handleStatusChange(o._id, e.target.value)
                        }
                        className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-bold outline-none transition ${
                          o.status === "Delivered"
                            ? "border-[#1E7F57] bg-[#E8F3EE] text-[#1E7F57]"
                            : o.status === "Cancelled"
                            ? "border-red-300 bg-red-50 text-red-600"
                            : "border-[#f5a623] bg-[#FFF3D6] text-[#b8860b]"
                        }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Accepted">Accepted</option>
                        <option value="On the Way">On the Way</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}