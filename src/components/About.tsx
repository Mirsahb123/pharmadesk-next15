"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Authentic Recipes",
    description: "Traditional Mughlai recipes passed down through generations",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: "Premium Quality",
    description: "Finest ingredients and spices sourced from trusted suppliers",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Royal Hospitality",
    description: "Experience the warmth of traditional Pakistani hospitality",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Fast Delivery",
    description: "Quick doorstep delivery to satisfy your royal cravings",
  },
];

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-24 bg-gradient-to-b from-[#0F0F0F] via-slate-900 to-[#0F0F0F] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#D4AF37]/3 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-[#D4AF37] font-[family-name:var(--font-cormorant)] text-lg tracking-[0.3em] mb-3">
            OUR STORY
          </p>
          <h2 className="font-[family-name:var(--font-cinzel)] text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4C430] to-[#D4AF37] mb-6">
            About Darbar Restaurant
          </h2>
          <div className="flex items-center justify-center gap-4">
            <span className="w-20 sm:w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            <span className="text-[#D4AF37] text-3xl">✦</span>
            <span className="w-20 sm:w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Image with 3D effect */}
          <div className={`relative group transition-all duration-1000 delay-200 ${isVisible? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Glowing frames */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#D4AF37] via-transparent to-[#D4AF37] rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="absolute inset-0 border border-[#D4AF37]/30 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-700" />
              <div className="absolute inset-0 border border-[#D4AF37]/30 rounded-2xl transform -rotate-6 group-hover:-rotate-12 transition-transform duration-700" />

              <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/20">
                <Image
                  src="/logo.jpg"
                  alt="Darbar Restaurant"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <h3 className="font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl text-[#D4AF37] mb-8 leading-tight">
              A Legacy of Royal Flavors Since 2014
            </h3>
            <div className="space-y-5 font-[family-name:var(--font-cormorant)] text-lg text-gray-300 leading-relaxed">
              <p>
                Welcome to <span className="text-[#D4AF37] font-semibold">Darbar Restaurant</span>, where the grandeur of Mughal cuisine comes alive in every dish. Our name “Darbar” meaning “Royal Court” reflects our commitment to serving food fit for emperors.
              </p>
              <p>
                Established with a passion for authentic Mughlai cuisine, we bring you recipes perfected over generations. From fragrant Biryanis to succulent Kebabs, each dish tells a story of royal heritage.
              </p>
              <p>
                Our master chefs use only the finest ingredients and traditional cooking methods to ensure every bite transports you to the magnificent courts of the Mughal era.
              </p>
            </div>

            {/* Stats with animation */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { value: "10+", label: "Years" },
                { value: "50+", label: "Dishes" },
                { value: "10K+", label: "Customers" },
              ].map((stat, i) => (
                <div key={i} className="text-center p-5 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl border border-[#D4AF37]/20 rounded-xl hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 hover:-translate-y-2">
                  <div className="font-[family-name:var(--font-cinzel)] text-4xl text-[#D4AF37] font-bold mb-1">
                    {stat.value}
                  </div>
                  <div className="font-[family-name:var(--font-cormorant)] text-gray-400 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group text-center p-8 bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl rounded-2xl border border-[#D4AF37]/10 hover:border-[#D4AF37]/50 hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-500 hover:-translate-y-3 ${isVisible? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 text-[#D4AF37] mb-5 group-hover:from-[#D4AF37]/20 group-hover:to-[#D4AF37]/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                {feature.icon}
              </div>
              <h4 className="font-[family-name:var(--font-cinzel)] text-xl text-[#D4AF37] mb-3 group-hover:text-[#F5C842] transition-colors">
                {feature.title}
              </h4>
              <p className="font-[family-name:var(--font-cormorant)] text-gray-400 group-hover:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;