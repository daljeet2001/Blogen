"use client";

import { ArrowRight } from "lucide-react";
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-3xl py-20">
      <div className="max-w-4xl mx-auto text-center px-6">
        {/* Headline */}
        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-snug">
          Ready to repurpose your blogs into powerful social media posts?
        </h2>

        {/* Subtext */}
        <p className="text-lg text-gray-200 mb-10">
          Join creators, marketers, and teams already using Blogen to turn long-form blogs
          into engaging posts for LinkedIn, X, and Instagram — all in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link href="/auth/signup" className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition">
            Start Creating Now <ArrowRight size={18} />
          </Link>
          <p className="text-sm text-gray-200">
            No credit card required • Free forever plan
          </p>
        </div>
      </div>
    </section>
  );
}
