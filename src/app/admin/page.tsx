import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  TrendingUp,
  Activity,
  MoreHorizontal,
} from "lucide-react";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export const metadata = { title: "Admin Dashboard | Gulshan Grocery" };

type DashboardOrder = {
  _id: string;
  orderId: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

async function DashboardContent() {
  await connection();
  await connectDB();

  // Fetch Real Counts from MongoDB
  const [productCount, orderCount, userCount, rawOrders, revenueAgg] =
    await Promise.all([
      Product.countDocuments({}),
      Order.countDocuments({}),
      User.countDocuments({ role: "user" }),
      Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("orderId customerName totalAmount status createdAt")
        .lean(),
      Order.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
      ]),
    ]);

  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recentOrders: DashboardOrder[] = rawOrders.map((o: any) => ({
    _id: o._id.toString(),
    orderId: o.orderId,
    customerName: o.customerName || "Customer",
    totalAmount: o.totalAmount || 0,
    status: o.status || "Accepted",
    createdAt: o.createdAt
      ? new Date(o.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Today",
  }));

  const stats = [
    {
      title: "Total Revenue",
      value: `৳ ${totalRevenue.toLocaleString()}`,
      change: "+Live",
      icon: DollarSign,
      color: "bg-emerald-50 text-[#1E7F57]",
    },
    {
      title: "Total Orders",
      value: orderCount.toString(),
      change: "+Live",
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Customers",
      value: userCount.toString(),
      change: "+Live",
      icon: Users,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Total Products",
      value: productCount.toString(),
      change: "+Live",
      icon: Package,
      color: "bg-amber-50 text-[#FBC617]",
    },
  ];

  const topProducts = [
    { name: "Fresh Oranges", sales: "124 Sales", price: "৳90", emoji: "🍊" },
    { name: "Himsagar Mango", sales: "98 Sales", price: "৳160", emoji: "🥭" },
    { name: "Fresh Strawberry", sales: "76 Sales", price: "৳480", emoji: "🍓" },
    { name: "Basmati Rice", sales: "65 Sales", price: "৳780", emoji: "🍚" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-[#6b6b6b]">
          Welcome to Gulshan Grocery Management Panel. Live database analytics.
        </p>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.color}`}
                >
                  <Icon size={24} />
                </div>
                <span className="flex items-center rounded-full bg-[#E8F3EE] px-2.5 py-1 text-xs font-bold text-[#1E7F57]">
                  <TrendingUp size={12} className="mr-1" />
                  {s.change}
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold text-[#1a1a1a]">{s.value}</p>
              <p className="mt-1 text-sm font-medium text-[#6b6b6b]">{s.title}</p>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Chart & Top Products */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Analytics Chart Area */}
        <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#1a1a1a]">Revenue Overview</h2>
              <p className="text-xs text-[#6b6b6b]">Weekly sales performance</p>
            </div>
            <button className="text-[#6b6b6b] hover:text-[#1a1a1a]">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="mt-6 flex h-62.5 items-end gap-2 sm:gap-6">
            {[40, 70, 45, 90, 65, 80, 55].map((height, i) => (
              <div
                key={i}
                className="group relative flex flex-1 flex-col items-center justify-end gap-2"
              >
                <div
                  className="w-full cursor-pointer rounded-t-lg bg-[#E8F3EE] transition-all hover:bg-[#1E7F57]"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs font-medium text-[#6b6b6b]">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
            <h2 className="text-lg font-bold text-[#1a1a1a]">Top Products</h2>
            <Activity size={18} className="text-[#1E7F57]" />
          </div>
          <div className="mt-4 space-y-5">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F9F9F9] border border-[#e5e5e5] text-xl">
                    {p.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1a1a]">{p.name}</p>
                    <p className="text-xs font-medium text-[#6b6b6b]">{p.sales}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-[#1E7F57]">{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Real Recent Orders Table */}
      <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1a1a1a]">Recent Orders</h2>
            <p className="text-xs text-[#6b6b6b]">Real-time customer transactions</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm font-semibold text-[#1E7F57] hover:underline"
          >
            View All Orders
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm text-[#1a1a1a]">
            <thead className="bg-[#F9F9F9] text-xs font-bold uppercase tracking-wider text-[#6b6b6b]">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {recentOrders.map((o) => (
                <tr key={o._id} className="transition hover:bg-[#F9F9F9]">
                  <td className="px-4 py-4 font-bold text-[#1a1a1a]">{o.orderId}</td>
                  <td className="px-4 py-4 font-medium">{o.customerName}</td>
                  <td className="px-4 py-4 text-[#6b6b6b]">{o.createdAt}</td>
                  <td className="px-4 py-4 font-bold text-[#1E7F57]">
                    ৳{o.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        o.status === "Delivered"
                          ? "bg-[#E8F3EE] text-[#1E7F57]"
                          : o.status === "Accepted"
                          ? "bg-[#FFF3D6] text-[#b8860b]"
                          : o.status === "On the Way"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-purple-50 text-purple-600"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-[#6b6b6b]">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-xl bg-[#e5e5e5]" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-white border border-[#e5e5e5]" />
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}