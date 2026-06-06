"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('darbar_cart') || '[]');
      const total = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(total);
    };

    updateCount();
    window.addEventListener('cartUpdated', updateCount);
    window.addEventListener('storage', updateCount);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('cartUpdated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  // SAB LINKS ABSOLUTE PATH - HAR PAGE SE KAAM KAREGA
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/#menu" },
    { name: "Admin", href: "/admin" },
    { name: "Dine In", href: "/dine-in" },
    { name: "My Orders", href: "/my-orders" },
    { name: "About Us", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-2xl shadow-black/50 border-b border-[#D4AF37]/20"
          : "bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-lg bg-[#7B1818]">
              <Image
                src="/logo.jpg"
                alt="Darbar Restaurant Logo"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-[#D4AF37]">
                Darbar
              </h1>
              <p className="text-xs text-[#D4AF37]/80 tracking-widest">
                RESTAURANT
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-[family-name:var(--font-cinzel)] text-sm tracking-wider transition-colors duration-300 relative group ${
                  pathname === link.href ? 'text-[#D4AF37]' : 'text-gray-200 hover:text-[#D4AF37]'
                }`}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-yellow-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}

            <Link
              href="/cart"
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-[family-name:var(--font-cinzel)] text-sm tracking-wider transition-all duration-300 shadow-lg transform hover:scale-105 ${
                cartCount > 0
                  ? 'bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50'
                  : 'bg-gradient-to-r from-gray-700 to-gray-800 text-[#D4AF37] border border-[#D4AF37]/50 hover:from-[#D4AF37] hover:to-yellow-500 hover:text-black'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 0 013 0zM6.5 18a1.5 0 100-3 1.5 0 000 3z"/>
              </svg>
              Order Now
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-[#D4AF37] transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`w-full h-0.5 bg-[#D4AF37] transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`w-full h-0.5 bg-[#D4AF37] transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-6" : "max-h-0"}`}>
          <div className="flex flex-col space-y-4 pt-4 border-t border-[#D4AF37]/30">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`font-[family-name:var(--font-cinzel)] text-sm tracking-wider transition-colors duration-300 ${
                  pathname === link.href ? 'text-[#D4AF37]' : 'text-gray-200 hover:text-[#D4AF37]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className={`relative flex items-center justify-center gap-2 px-5 py-3 rounded-full font-[family-name:var(--font-cinzel)] text-sm tracking-wider transition-all duration-300 shadow-lg ${
                cartCount > 0
                  ? 'bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black shadow-[#D4AF37]/30'
                  : 'bg-gradient-to-r from-gray-700 to-gray-800 text-[#D4AF37] border border-[#D4AF37]/50'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 0 013 0zM6.5 18a1.5 0 100-3 1.5 0 000 3z"/>
              </svg>
              Order Now
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;