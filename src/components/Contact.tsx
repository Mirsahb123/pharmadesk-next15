"use client";

const Contact = () => {
  const whatsappNumber = "923001234567";
  const whatsappMessage = encodeURIComponent("Hello! I would like to make a reservation at Darbar Restaurant.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
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
            Contact Us
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-2xl animate-pulse">&#9830;</span>
            <span className="w-16 sm:w-24 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#D4AF37]" />
          </div>
          <p className="font-[family-name:var(--font-cormorant)] text-xl text-gray-300 max-w-2xl mx-auto">
            Visit us or reach out for reservations and inquiries
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Location */}
          <div className="text-center p-8 bg-gradient-to-br from-slate-900/60 to-slate-800/50 backdrop-blur-sm rounded-lg border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 hover:-translate-y-1 group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] mb-6 group-hover:bg-[#D4AF37]/20 group-hover:scale-110 transition-all duration-300 shadow-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-[family-name:var(--font-cinzel)] text-xl text-[#D4AF37] mb-3 group-hover:text-[#F5C842] transition-colors">
              Our Location
            </h3>
            <p className="font-[family-name:var(--font-cormorant)] text-lg text-gray-300">
              Main Boulevard, Gulberg III<br />
              Lahore, Pakistan
            </p>
          </div>

          {/* Phone */}
          <div className="text-center p-8 bg-gradient-to-br from-slate-900/60 to-slate-800/50 backdrop-blur-sm rounded-lg border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 hover:-translate-y-1 group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] mb-6 group-hover:bg-[#D4AF37]/20 group-hover:scale-110 transition-all duration-300 shadow-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="font-[family-name:var(--font-cinzel)] text-xl text-[#D4AF37] mb-3 group-hover:text-[#F5C842] transition-colors">
              Phone
            </h3>
            <p className="font-[family-name:var(--font-cormorant)] text-lg text-gray-300">
              +92 300 1234567<br />
              +92 42 35761234
            </p>
          </div>

          {/* Hours */}
          <div className="text-center p-8 bg-gradient-to-br from-slate-900/60 to-slate-800/50 backdrop-blur-sm rounded-lg border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 hover:-translate-y-1 group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] mb-6 group-hover:bg-[#D4AF37]/20 group-hover:scale-110 transition-all duration-300 shadow-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-[family-name:var(--font-cinzel)] text-xl text-[#D4AF37] mb-3 group-hover:text-[#F5C842] transition-colors">
              Opening Hours
            </h3>
            <p className="font-[family-name:var(--font-cormorant)] text-lg text-gray-300">
              Daily: 12:00 PM - 12:00 AM<br />
              Friday: 1:00 PM - 12:00 AM
            </p>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="text-center bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-md p-10 rounded-xl border-2 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/20">
          <h3 className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl text-[#D4AF37] mb-4 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
            Ready to Order?
          </h3>
          <p className="font-[family-name:var(--font-cormorant)] text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            Contact us directly on WhatsApp for quick orders, reservations, or any inquiries.
            We&apos;re here to serve you royally!
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#25D366] text-white px-10 py-4 rounded-lg font-[family-name:var(--font-cinzel)] text-lg tracking-wider transition-all duration-300 shadow-lg shadow-green-600/30 hover:shadow-green-600/50 transform hover:scale-105"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>

        {/* Map Placeholder */}
        <div className="mt-16">
          <div className="w-full h-64 sm:h-80 bg-black/30 backdrop-blur-sm rounded-xl border border-[#D4AF37]/30 flex items-center justify-center hover:border-[#D4AF37] transition-all duration-300">
            <div className="text-center">
              <svg className="w-16 h-16 text-[#D4AF37]/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="font-[family-name:var(--font-cormorant)] text-gray-400 text-lg">
                Map Location - Gulberg III, Lahore
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
