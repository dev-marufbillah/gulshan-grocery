"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function CheckoutClient() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.totalItems());
  const totalPrice = useCartStore((s) => s.totalPrice());

  const [deliveryAddress, setDeliveryAddress] = useState("same");

  const subTotal = totalPrice;
  const shipping = items.length > 0 && subTotal < 500 ? 60 : 0;
  const taxes = 0;
  const discount = 0;
  const total = subTotal + shipping + taxes - discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // কোনো alert ছাড়াই সরাসরি Payment পেজে যাবে
    router.push("/checkout/payment");
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20 text-center md:px-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#F4F4F4]">
          <ShoppingBag size={40} className="text-[#6b6b6b]" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-[#1a1a1a]">
          Your cart is empty
        </h2>
        <p className="mt-2 text-[#6b6b6b]">Add some products to checkout.</p>
        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-full bg-[#1E7F57] px-8 py-3 font-semibold text-white transition hover:bg-[#166b48]"
        >
          Return to Shop
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <form
        onSubmit={handleSubmit}
        className="grid gap-10 lg:grid-cols-[1fr_380px]"
      >
        {/* Left Side: Billing Details Form */}
        <div>
          <h2 className="mb-8 text-2xl font-bold text-[#1a1a1a]">
            Billing Details
          </h2>

          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  First Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex. John"
                  className="w-full rounded-full border border-[#e5e5e5] px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  Last Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex. Doe"
                  className="w-full rounded-full border border-[#e5e5e5] px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                Company Name (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter Company Name"
                className="w-full rounded-full border border-[#e5e5e5] px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
              />
            </div>

            {/* Country Dropdown */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                Country *
              </label>
              <div className="relative">
                <select
                  required
                  className="w-full appearance-none rounded-full border border-[#e5e5e5] bg-white px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
                >
                  <option value="">Select Country</option>
                  <option value="bangladesh">Bangladesh</option>
                  <option value="usa">United States</option>
                  <option value="uk">United Kingdom</option>
                </select>
                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6b6b]"
                />
              </div>
            </div>

            {/* Street Address */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                Street Address *
              </label>
              <input
                required
                type="text"
                placeholder="Enter Street Address"
                className="w-full rounded-full border border-[#e5e5e5] px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
              />
            </div>

            {/* City Dropdown */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                City *
              </label>
              <div className="relative">
                <select
                  required
                  className="w-full appearance-none rounded-full border border-[#e5e5e5] bg-white px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
                >
                  <option value="">Select City</option>
                  <option value="dhaka">Dhaka</option>
                  <option value="chittagong">Chittagong</option>
                  <option value="sylhet">Sylhet</option>
                  <option value="khulna">Khulna</option>
                  <option value="rajshahi">Rajshahi</option>
                </select>
                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6b6b]"
                />
              </div>
            </div>

            {/* State Dropdown */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                State *
              </label>
              <div className="relative">
                <select
                  required
                  className="w-full appearance-none rounded-full border border-[#e5e5e5] bg-white px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
                >
                  <option value="">Select State</option>
                  <option value="dhaka-division">Dhaka Division</option>
                  <option value="chittagong-division">Chittagong Division</option>
                  <option value="rajshahi-division">Rajshahi Division</option>
                  <option value="khulna-division">Khulna Division</option>
                  <option value="sylhet-division">Sylhet Division</option>
                </select>
                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6b6b]"
                />
              </div>
            </div>

            {/* Zip Code */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                Zip Code *
              </label>
              <input
                required
                type="text"
                placeholder="Enter Zip Code"
                className="w-full rounded-full border border-[#e5e5e5] px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                Phone *
              </label>
              <input
                required
                type="tel"
                placeholder="Enter Phone Number"
                className="w-full rounded-full border border-[#e5e5e5] px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                Email *
              </label>
              <input
                required
                type="email"
                placeholder="Enter Email Address"
                className="w-full rounded-full border border-[#e5e5e5] px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
              />
            </div>

            {/* Delivery Address Radio Buttons */}
            <div className="pt-4">
              <label className="mb-4 block text-sm font-semibold text-[#1a1a1a]">
                Delivery Address *
              </label>
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <label
                  className={`flex flex-1 cursor-pointer items-center gap-3 rounded-full border px-5 py-3 text-sm transition ${
                    deliveryAddress === "same"
                      ? "border-[#1E7F57] bg-[#F4F9F7]"
                      : "border-[#e5e5e5] hover:border-[#1E7F57]"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="same"
                    checked={deliveryAddress === "same"}
                    onChange={() => setDeliveryAddress("same")}
                    className="h-4 w-4 cursor-pointer accent-[#1E7F57]"
                  />
                  <span className="font-medium text-[#1a1a1a]">
                    Same as shipping address
                  </span>
                </label>

                <label
                  className={`flex flex-1 cursor-pointer items-center gap-3 rounded-full border px-5 py-3 text-sm transition ${
                    deliveryAddress === "different"
                      ? "border-[#1E7F57] bg-[#F4F9F7]"
                      : "border-[#e5e5e5] hover:border-[#1E7F57]"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="different"
                    checked={deliveryAddress === "different"}
                    onChange={() => setDeliveryAddress("different")}
                    className="h-4 w-4 cursor-pointer accent-[#1E7F57]"
                  />
                  <span className="font-medium text-[#1a1a1a]">
                    Use a different billing address
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div>
          <div className="sticky top-20 rounded-2xl border border-[#e5e5e5] p-6 shadow-sm">
            <h3 className="border-b border-[#e5e5e5] pb-4 text-xl font-bold text-[#1a1a1a]">
              Order Summary
            </h3>

            <div className="mt-6 space-y-4 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-[#6b6b6b]">Items</span>
                <span className="font-bold text-[#1a1a1a]">{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b6b]">Sub Total</span>
                <span className="font-bold text-[#1a1a1a]">
                  ৳{subTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b6b]">Shipping</span>
                <span className="font-bold text-[#1a1a1a]">
                  {shipping === 0 ? "Free" : `৳${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b6b]">Taxes</span>
                <span className="font-bold text-[#1a1a1a]">
                  ৳{taxes.toFixed(2)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span className="font-bold">-৳{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-[#e5e5e5] pt-4 text-lg">
                <span className="font-bold text-[#1a1a1a]">Total</span>
                <span className="font-bold text-[#1E7F57]">
                  ৳{total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-[#1E7F57] font-semibold text-white transition hover:bg-[#166b48]"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}