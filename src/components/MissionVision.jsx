const MissionVision = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-thimpson-yellow/10 border border-thimpson-yellow/30 px-3 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 bg-thimpson-yellow" />
          <span className="text-thimpson-yellow text-xs font-semibold tracking-widest uppercase">Nuestra Filosofía</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-thimpson-dark mb-4 tracking-tight">
          Lo que nos <span className="text-thimpson-yellow">impulsa</span>
        </h2>
        <div className="h-0.5 w-16 bg-thimpson-yellow mx-auto mb-6" />
      </div>

      <div className="grid md:grid-cols-2 gap-0 border border-gray-200">
        <div className="p-6 sm:p-10 lg:p-14 bg-thimpson-dark relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-thimpson-yellow/5" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%)' }} />
          <div className="relative z-10">
            <div className="w-14 h-14 bg-thimpson-yellow flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-thimpson-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Misión</h3>
            <div className="w-10 h-0.5 bg-thimpson-yellow mb-6" />
            <p className="text-gray-300 leading-relaxed">
              Brindar soluciones de movilidad y delivery rápidas, seguras y confiables en los departamentos de 
              Nueva Segovia, Madriz y Estelí, superando las expectativas de nuestros clientes con un servicio 
              de excelencia, innovación constante y un equipo comprometido con la satisfacción de cada usuario.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-14 bg-thimpson-offwhite relative overflow-hidden">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-thimpson-yellow/10" style={{ clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)' }} />
          <div className="relative z-10">
            <div className="w-14 h-14 bg-thimpson-dark flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-thimpson-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-thimpson-dark mb-2 tracking-tight">Visión</h3>
            <div className="w-10 h-0.5 bg-thimpson-yellow mb-6" />
            <p className="text-gray-600 leading-relaxed">
              Ser la empresa líder en transporte y delivery del norte de Nicaragua, reconocida por nuestra 
              puntualidad, profesionalismo y calidez humana. Expandir nuestra cobertura a nivel nacional 
              manteniendo los estándares de calidad que nos distinguen, impulsando el desarrollo económico 
              de las comunidades que servimos.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default MissionVision;
