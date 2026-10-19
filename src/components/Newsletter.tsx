"use client";

export default function Newsletter() {
  return (
    <section
      className="relative bg-[#F9F9F9] py-10 sm:py-20 text-center"
      style={{
        backgroundImage: "radial-gradient(#d9d9d9 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }}
    >
      <div className="mx-auto max-w-2xl px-4">
        <p className="font-semibold uppercase tracking-wider text-[#1a1a1a] text-xs sm:text-base">
          Our Newsletter
        </p>
        <h2 className="mt-2 sm:mt-3 text-2xl font-bold text-[#1a1a1a] sm:text-3xl md:text-5xl leading-tight">
          Subscribe to Our Newsletter to Get{" "}
          <span className="text-[#1E7F57]">Updates on Our Latest Offers</span>
        </h2>
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-[#6b6b6b]">
          Get 25% off on your first order just by subscribing to our newsletter
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-6 sm:mt-8 flex max-w-lg flex-col sm:flex-row gap-2 sm:gap-3 rounded-2xl sm:rounded-full bg-white p-2 shadow-md"
        >
          <input
            type="email"
            placeholder="Enter Email Address"
            className="flex-1 bg-transparent px-4 py-2.5 sm:py-2 text-sm text-[#1a1a1a] outline-none text-center sm:text-left"
          />
          <button
            type="submit"
            className="rounded-xl sm:rounded-full bg-[#FBC617] px-8 py-3 font-bold text-[#1a1a1a] transition hover:bg-yellow-500 shrink-0"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}