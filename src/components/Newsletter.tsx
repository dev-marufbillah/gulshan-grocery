"use client";

export default function Newsletter() {
  return (
    <section
      className="relative bg-[#F9F9F9] py-20 text-center"
      style={{
        backgroundImage: "radial-gradient(#d9d9d9 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }}
    >
      <div className="mx-auto max-w-2xl px-4">
        <p className="font-semibold uppercase tracking-wider text-[#1a1a1a]">
          Our Newsletter
        </p>
        <h2 className="mt-3 text-3xl font-bold text-[#1a1a1a] md:text-5xl">
          Subscribe to Our Newsletter to Get{" "}
          <span className="text-[#1E7F57]">Updates on Our Latest Offers</span>
        </h2>
        <p className="mt-4 text-sm text-[#6b6b6b]">
          Get 25% off on your first order just by subscribing to our newsletter
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-8 flex max-w-lg flex-col gap-3 rounded-full bg-white p-2 shadow-md sm:flex-row"
        >
          <input
            type="email"
            placeholder="Enter Email Address"
            className="flex-1 bg-transparent px-4 py-2 text-sm text-[#1a1a1a] outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-[#FBC617] px-8 py-3 font-bold text-[#1a1a1a] transition hover:bg-yellow-500"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}