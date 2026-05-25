const stats = [
  { value: '+3', label: 'Años' },
  { value: '+500', label: 'Viajes' },
  { value: '+50', label: 'Clientes' },
  { value: '99%', label: 'Satisfacción' },
];

const About = () => (
  <section id="nosotros" className="py-24 bg-thimpson-dark relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-thimpson-dark via-thimpson-dark-secondary to-thimpson-dark" />
    <div className="absolute top-0 right-0 w-96 h-96 bg-thimpson-yellow/5" style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 80%)' }} />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-5 gap-16 items-center">
        <div className="lg:col-span-3">
          <div className="inline-flex items-center gap-2 bg-thimpson-yellow/10 border border-thimpson-yellow/30 px-3 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-thimpson-yellow" />
            <span className="text-thimpson-yellow text-xs font-semibold tracking-widest uppercase">Sobre Nosotros</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
            Lideramos el{' '}
            <span className="text-thimpson-yellow">transporte inteligente</span>
          </h2>
          <div className="h-0.5 w-16 bg-thimpson-yellow mb-6" />
          <p className="text-gray-400 text-lg leading-relaxed mb-6">
            En Thimpson Express nos apasiona llevar soluciones de movilidad a cada rincón.
            Desde nuestros inicios, nos hemos comprometido a ofrecer un servicio rápido, 
            seguro y confiable que supere las expectativas de nuestros clientes.
          </p>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Con base en <strong className="text-white">Ocotal, Nueva Segovia</strong>, brindamos cobertura en los departamentos de{' '}
            <strong className="text-thimpson-yellow">Nueva Segovia</strong>,{' '}
            <strong className="text-thimpson-yellow">Madriz</strong> y{' '}
            <strong className="text-thimpson-yellow">Estelí</strong>.
            Contamos con un equipo de profesionales y una flota moderna lista 
            para atender todas tus necesidades de delivery, transporte, encomiendas y mandados.
          </p>
          <a
            href="https://wa.me/584143443746"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-thimpson-yellow text-thimpson-dark font-bold px-6 py-3 text-sm hover:brightness-110 transition-all duration-300 tracking-wide"
          >
            Contáctanos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="border border-white/10 p-6 text-center bg-white/5">
                <p className="text-thimpson-yellow text-3xl sm:text-4xl font-black mb-1">{stat.value}</p>
                <p className="text-gray-500 text-xs tracking-wider uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
