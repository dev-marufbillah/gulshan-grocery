"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  const [description, setDescription] = useState(
    "Fresh groceries delivered to your doorstep in Gulshan, Dhaka. Quality products, fast delivery, and great prices every day."
  );
  const [copyright, setCopyright] = useState(
    "Copyright © 2024 Gulshan Grocery. All Rights Reserved."
  );

  useEffect(() => {
    async function loadFooterSettings() {
      try {
        const res = await fetch("/api/admin/section-settings");
        if (res.ok) {
          const data = await res.json();
          if (data?.settings?.footer) {
            if (data.settings.footer.description) {
              setDescription(data.settings.footer.description);
            }
            if (data.settings.footer.copyright) {
              setCopyright(data.settings.footer.copyright);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load footer settings:", err);
      }
    }
    loadFooterSettings();
  }, []);

  return (
    <footer className="bg-[#1E7F57] pt-16 pb-8 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FBC617] text-lg text-[#1a1a1a]">
                🛒
              </span>
              Gulshan Grocery
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-white/80">
              {description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#FBC617] hover:text-[#1a1a1a]"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#FBC617] hover:text-[#1a1a1a]"
              >
                <FaTwitter size={14} />
              </a>
              <a
                href="#"
                aria-label="Pinterest"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#FBC617] hover:text-[#1a1a1a]"
              >
                <FaPinterestP size={14} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#FBC617] hover:text-[#1a1a1a]"
              >
                <FaInstagram size={14} />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#FBC617] hover:text-[#1a1a1a]"
              >
                <FaYoutube size={14} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-6 text-lg font-bold">Company</h3>
            <ul className="space-y-4 text-sm text-white/80">
              <li>
                <Link href="/about" className="transition hover:text-[#FBC617]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="transition hover:text-[#FBC617]">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-[#FBC617]"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/career"
                  className="transition hover:text-[#FBC617]"
                >
                  Career
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h3 className="mb-6 text-lg font-bold">Customer Services</h3>
            <ul className="space-y-4 text-sm text-white/80">
              <li>
                <Link
                  href="/account"
                  className="transition hover:text-[#FBC617]"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="transition hover:text-[#FBC617]"
                >
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition hover:text-[#FBC617]">
                  Return
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition hover:text-[#FBC617]">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Information */}
          <div>
            <h3 className="mb-6 text-lg font-bold">Our Information</h3>
            <ul className="space-y-4 text-sm text-white/80">
              <li>
                <Link href="/faq" className="transition hover:text-[#FBC617]">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition hover:text-[#FBC617]">
                  User Terms &amp; Condition
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition hover:text-[#FBC617]">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-6 text-lg font-bold">Contact Info</h3>
            <ul className="space-y-4 text-sm text-white/80">
              <li>+880 1700-000000</li>
              <li>support@gulshangrocery.com</li>
              <li className="leading-relaxed">
                Gulshan 1, Dhaka 1212,
                <br />
                Bangladesh
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-8 text-sm text-white/80 sm:flex-row">
          <p>{copyright}</p>
          <div className="flex gap-4">
            <span>English ⌄</span>
            <span>BDT ৳ ⌄</span>
          </div>
        </div>
      </div>
    </footer>
  );
}