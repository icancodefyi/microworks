"use client";
import React from "react";
import Link from "next/link";
import { MicroworksLogo } from "@/components/brand/microworks-logo";
import { FOOTER_SECTIONS } from "./microworks-data";

export function MicroworksFooter() {
  return (
    <footer className="w-full border-t border-stone-200 mt-10">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-stone-200">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col gap-4">
            <Link href="/" aria-label="Microworks Home" className="w-fit">
              <MicroworksLogo markSize={24} textClassName="text-stone-900" />
            </Link>
            <p className="text-xs text-stone-500 font-sans leading-relaxed">
              On-chain micro-work and consensus settlement engine built on Monad and HTTP 402.
            </p>
          </div>

          {/* Dynamic Link Columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <p className="font-mono text-xs uppercase font-bold tracking-wider text-stone-900">
                {section.title}
              </p>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs font-sans text-stone-500 hover:text-stone-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Status, Copyright & Social */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 items-center">
          {/* Copyright */}
          <div>
            <p className="text-stone-400 font-normal text-xs font-sans uppercase leading-4">
              © 2026 • Microworks · Monad Blitz. All rights reserved.
            </p>
          </div>

          {/* Operational Status */}
          <div className="flex items-center justify-start sm:justify-center">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5 shrink-0">
                <span className="absolute inline-flex size-full rounded-full bg-emerald-400 border border-emerald-600 opacity-75 animate-ping motion-reduce:animate-none" />
                <span className="inline-flex size-2.5 rounded-full bg-emerald-500 border border-emerald-600" />
              </span>
              <p className="text-stone-800 font-semibold text-xs font-sans uppercase leading-4">
                Monad Testnet · All systems operational
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-start sm:justify-end gap-3">
            <a
              target="_blank"
              rel="noreferrer"
              aria-label="Microworks on GitHub"
              className="text-stone-700 hover:text-stone-950 transition-colors p-1"
              href="https://github.com/zaidrakhange/microworks"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.9536 0C5.35265 0 0 5.50135 0 12.2878C0 17.717 3.42506 22.323 8.17462 23.9478C8.772 24.0615 8.99137 23.6812 8.99137 23.3566C8.99137 23.0637 8.98022 22.0956 8.97515 21.0689C5.64956 21.8122 4.94784 19.6191 4.94784 19.6191C4.40409 18.1988 3.62062 17.8212 3.62062 17.8212C2.53612 17.0585 3.70237 17.0741 3.70237 17.0741C4.90275 17.1608 5.53481 18.3404 5.53481 18.3404C6.60094 20.219 8.33119 19.6758 9.01331 19.362C9.12056 18.5677 9.4304 18.0257 9.77222 17.7188C7.11722 17.408 4.32609 16.3544 4.32609 11.6461C4.32609 10.3046 4.79306 9.20837 5.55778 8.34787C5.43366 8.03833 5.02453 6.78859 5.67356 5.09602C5.67356 5.09602 6.67734 4.76575 8.96166 6.35559C9.91509 6.08324 10.9377 5.94678 11.9536 5.94216C12.9695 5.94678 13.9928 6.08324 14.9482 6.35559C17.2297 4.76575 18.2321 5.09602 18.2321 5.09602C18.8827 6.78859 18.4734 8.03833 18.3493 8.34787C19.1157 9.20837 19.5795 10.3045 19.5795 11.6461C19.5795 16.3656 16.7831 17.4048 14.1214 17.709C14.5501 18.0903 14.9321 18.8382 14.9321 19.9845C14.9321 21.6286 14.9182 22.9519 14.9182 23.3566C14.9182 23.6836 15.1334 24.0668 15.7394 23.9461C20.4863 22.3195 23.9071 17.7152 23.9071 12.2878C23.9071 5.50135 18.5552 0 11.9536 0Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              aria-label="Microworks on X / Twitter"
              className="text-stone-700 hover:text-stone-950 transition-colors p-1"
              href="https://x.com"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18.3262 2H21.6998L14.3297 10.4234L23 21.886H16.2112L10.894 14.9341L4.80985 21.886H1.43443L9.31754 12.8761L1 2H7.96101L12.7673 8.35433L18.3262 2ZM17.1422 19.8668H19.0115L6.94529 3.91303H4.93956L17.1422 19.8668Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
