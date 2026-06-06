"use client";

import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Banner Background Image - Original HD Quality */}
      <div className="absolute inset-0 bg-[#7B1818]">
        <Image
          src="/banner.jpg"
          alt="Darbar Restaurant - Royal Mughal Cuisine"
          fill
          className="object-cover object-center"
          priority
          quality={100}
          unoptimized
          sizes="100vw"
        />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <Link href="#menu" className="text-[#D4AF37]">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default Hero;