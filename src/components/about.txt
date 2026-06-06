"use client";

import Image from "next/image";

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
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.03) 35px, rgba(255,255,255,.03) 70px)`
        }} />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-cinzel)] text-4xl sm:text-5xl font-bold text-[#D4AF37] mb-4">
            About Darbar Restaurant
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-2xl">&#9830;</span>
            <span className="w-16 sm:w-24 h-0.5 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Image */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 border-2 border-[#D4AF37] transform rotate-3" />
              <div className="absolute inset-0 border-2 border-[#D4AF37] transform -rotate-3" />
              <div className="relative w-full h-full rounded-sm overflow-hidden border-2 border-[#D4AF37]">
                <Image
                  src="/logo.jpg"
                  alt="Darbar Restaurant"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h3 className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl text-[#D4AF37] mb-6">
              A Legacy of Royal Flavors
            </h3>
            <div className="space-y-4 font-[family-name:var(--font-cormorant)] text-lg text-[#FAF8F0]/90">
              <p>
                Welcome to Darbar Restaurant, where the grandeur of Mughal cuisine comes alive
                in every dish. Our name &ldquo;Darbar&rdquo; meaning &ldquo;Royal Court&rdquo; reflects our commitment
                to serving food fit for emperors.
              </p>
              <p>
                Established with a passion for authentic Mughlai cuisine, we bring you recipes
                that have been perfected over generations. From the fragrant Biryanis to the
                succulent Kebabs, each dish tells a story of royal heritage.
              </p>
              <p>
                Our master chefs use only the finest ingredients and traditional cooking
                methods to ensure every bite transports you to the magnificent courts of
                the Mughal era.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-black/30 backdrop-blur-sm border border-[#D4AF37]/30 rounded-lg hover:border-[#D4AF37] transition-all duration-300">
                <div className="font-[family-name:var(--font-cinzel)] text-3xl text-[#D4AF37] font-bold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                  10+
                </div>
                <div className="font-[family-name:var(--font-cormorant)] text-gray-300 text-sm">
                  Years Experience
                </div>
              </div>
              <div className="text-center p-4 bg-black/30 backdrop-blur-sm border border-[#D4AF37]/30 rounded-lg hover:border-[#D4AF37] transition-all duration-300">
                <div className="font-[family-name:var(--font-cinzel)] text-3xl text-[#D4AF37] font-bold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                  50+
                </div>
                <div className="font-[family-name:var(--font-cormorant)] text-gray-300 text-sm">
                  Menu Items
                </div>
              </div>
              <div className="text-center p-4 bg-black/30 backdrop-blur-sm border border-[#D4AF37]/30 rounded-lg hover:border-[#D4AF37] transition-all duration-300">
                <div className="font-[family-name:var(--font-cinzel)] text-3xl text-[#D4AF37] font-bold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                  1000+
                </div>
                <div className="font-[family-name:var(--font-cormorant)] text-gray-300 text-sm">
                  Happy Customers
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group text-center p-6 bg-gradient-to-br from-[#5A1010]/60 to-[#4A0808]/50 backdrop-blur-sm rounded-lg border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] mb-4 group-hover:bg-[#D4AF37]/20 group-hover:scale-110 transition-all duration-300 shadow-lg">
                {feature.icon}
              </div>
              <h4 className="font-[family-name:var(--font-cinzel)] text-lg text-[#D4AF37] mb-2 group-hover:text-[#F5C842] transition-colors">
                {feature.title}
              </h4>
              <p className="font-[family-name:var(--font-cormorant)] text-[#FAF8F0]/80 group-hover:text-[#FAF8F0]/90">
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
