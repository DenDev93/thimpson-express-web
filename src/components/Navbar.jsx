import { useState } from 'react';

const Navbar = ({ onOpenTracking }) => {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '#', label: 'Inicio' },
    { href: '#servicios', label: 'Servicios' },
    { href: '#nosotros', label: 'Nosotros' },
    { href: '#testimonios', label: 'Testimonios' },
    { href: '#contacto', label: 'Contacto' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-thimpson-dark border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-thimpson-yellow flex items-center justify-center">
              <span className="text-thimpson-dark font-black text-lg">T</span>
            </div>
            <div>
              <span className="text-white font-bold text-base leading-tight block">THIMPSON</span>
              <span className="text-thimpson-yellow text-[10px] font-semibold tracking-[0.2em] uppercase leading-tight block">Express</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-400 hover:text-thimpson-yellow transition-colors text-sm font-medium tracking-wide uppercase"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={onOpenTracking}
              className="text-gray-400 hover:text-thimpson-yellow transition-colors text-sm font-medium tracking-wide uppercase"
            >
              📦 Seguimiento
            </button>
            <a
              href="https://wa.me/50584159112"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-thimpson-yellow text-thimpson-dark font-bold px-5 py-2.5 text-sm hover:brightness-110 transition-all tracking-wide"
            >
              WhatsApp
            </a>
          </div>

            <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-3"
            aria-label="Menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-white/10 py-4">
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-thimpson-yellow transition-colors py-3 text-sm font-medium tracking-wide uppercase"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => { setOpen(false); onOpenTracking(); }}
                className="text-left text-gray-400 hover:text-thimpson-yellow transition-colors py-3 text-sm font-medium tracking-wide uppercase"
              >
                📦 Seguimiento
              </button>
              <a
                href="https://wa.me/50584159112"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-thimpson-yellow text-thimpson-dark font-bold px-5 py-3 text-sm text-center hover:brightness-110 transition-all mt-2"
              >
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
