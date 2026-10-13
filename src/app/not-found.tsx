import Link from "next/link";

export const metadata = {
  title: "404 - Page Not Found | Gulshan Grocery",
};

export default function NotFound() {
  return (
    <main className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
        {/* Fruit Pattern 404 Text */}
        <div className="relative mx-auto flex items-center justify-center select-none">
          <h1
            className="bg-clip-text text-[130px] font-black leading-none tracking-tight text-transparent bg-cover bg-center sm:text-[180px] md:text-[230px]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1000&q=80')",
            }}
          >
            404
          </h1>
        </div>

        {/* Heading & Subtitle */}
        <h2 className="mt-4 text-3xl font-bold text-[#1a1a1a] md:text-4xl">
          Oops! <span className="text-[#1E7F57]">Page not Found</span>
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#6b6b6b] md:text-base">
          The page you are looking for cannot be found. take a break before trying again
        </p>

        {/* Go to Home Button */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#1E7F57] px-8 text-sm font-semibold text-white transition hover:bg-[#166b48]"
          >
            Go To Home Page
          </Link>
        </div>
      </div>
    </main>
  );
}