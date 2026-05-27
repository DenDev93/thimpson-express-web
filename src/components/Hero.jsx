const Hero = () => (
  <section className="min-h-screen flex items-center bg-thimpson-dark relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-thimpson-dark via-thimpson-dark-secondary to-thimpson-dark" />
    <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-thimpson-yellow/5" style={{ clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%, 0% 70%)' }} />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-thimpson-yellow/5" style={{ clipPath: 'polygon(0% 0%, 70% 0%, 100% 100%, 0% 100%)' }} />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-thimpson-yellow/10 border border-thimpson-yellow/30 px-3 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 bg-thimpson-yellow" />
            <span className="text-thimpson-yellow text-xs font-semibold tracking-widest uppercase">Disponible 8:00 AM - 10:00 PM</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.9] mb-4">
            <span className="text-thimpson-yellow">THIMPSON</span>
            <br />
            EXPRESS
          </h1>

          <div className="h-0.5 w-20 bg-thimpson-yellow mb-6" />

          <p className="text-thimpson-yellow font-semibold text-lg sm:text-xl mb-3 tracking-[0.15em] uppercase">
            RÁPIDO | SEGURO | CONFIABLE
          </p>

          <p className="text-gray-400 text-base sm:text-lg mb-2 max-w-lg leading-relaxed">
            Delivery, viajes privados, encomiendas y mandados. 
            Soluciones de movilidad inteligente para lo que necesites, cuando lo necesites.
          </p>
          <p className="text-thimpson-gray text-sm mb-10 font-medium">
            📍 Ocotal, Nueva Segovia — Servicio en <span className="text-thimpson-yellow">Nueva Segovia</span>, <span className="text-thimpson-yellow">Madriz</span> y <span className="text-thimpson-yellow">Estelí</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <a
              href="https://wa.me/50584159112"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-thimpson-yellow text-thimpson-dark font-bold px-8 py-4 text-lg hover:brightness-110 transition-all duration-300 shadow-lg shadow-thimpson-yellow/25 animate-pulse-glow"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Solicitar ahora
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white font-semibold px-8 py-4 text-lg hover:bg-white/5 hover:border-white/40 transition-all duration-300"
            >
              Ver servicios
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 border-t border-white/10 pt-8">
            {[
              { value: '+500', label: 'Viajes Completados' },
              { value: '100%', label: 'Clientes Satisfechos' },
              { value: '14 hrs', label: 'Disponibilidad' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-thimpson-yellow text-3xl sm:text-4xl font-black">{stat.value}</p>
                <p className="text-gray-500 text-xs sm:text-sm tracking-wide uppercase mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex justify-center animate-slide-up">
          <div className="w-full max-w-sm border border-white/10 bg-thimpson-dark-secondary/50">
            <div className="bg-thimpson-yellow px-6 py-3">
              <p className="text-thimpson-dark font-black text-sm tracking-widest uppercase">Servicio Express</p>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="w-14 h-14 bg-thimpson-yellow flex items-center justify-center">
                  <span className="text-thimpson-dark font-black text-2xl">T</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Thimpson Express</p>
                  <p className="text-thimpson-gray text-xs tracking-wide uppercase">Servicio Premium</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { icon: '🛵', label: 'Delivery Express', badge: '15-30 min' },
                  { icon: '📦', label: 'Encomiendas', badge: 'Seguro' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between bg-thimpson-dark/50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-gray-200 text-sm font-medium">{item.label}</span>
                    </div>
                    <span className="bg-thimpson-yellow/10 text-thimpson-yellow text-xs font-bold px-2 py-1">{item.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
