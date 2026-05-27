const Footer = () => (
  <footer className="bg-thimpson-dark border-t border-white/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-4 gap-6 md:gap-10 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-thimpson-yellow flex items-center justify-center">
              <span className="text-thimpson-dark font-black text-sm">T</span>
            </div>
            <div>
              <span className="text-white font-bold text-base leading-tight block">THIMPSON</span>
              <span className="text-thimpson-yellow text-[10px] font-semibold tracking-[0.2em] uppercase leading-tight block">Express</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm max-w-md leading-relaxed">
             Servicio de delivery, encomiendas y mandados. 
            Rápido, seguro y confiable. Disponibles de Lunes a Domingo 8:00 AM - 10:00 PM.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Servicios</h4>
          <ul className="space-y-3">
            {['Delivery Express', 'Encomiendas', 'Mandados'].map((s) => (
              <li key={s} className="text-gray-400 text-sm hover:text-thimpson-yellow transition-colors cursor-pointer">{s}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Contacto</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="https://wa.me/50584159112" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-thimpson-yellow transition-colors">
                Claro: +505 8415-9112
              </a>
            </li>
            <li>
              <a href="https://wa.me/50585932295" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-thimpson-yellow transition-colors">
                Tigo: +505 8593-2295
              </a>
            </li>
            <li className="text-gray-400">Lun-Dom 8:00 AM - 10:00 PM</li>
            <li className="text-gray-400">Ocotal, Nueva Segovia</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Thimpson Express. Todos los derechos reservados.
        </p>
        <p className="text-thimpson-yellow text-xs font-semibold tracking-[0.15em] uppercase">
          RÁPIDO | SEGURO | CONFIABLE
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
