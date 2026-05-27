const testimonials = [
  {
    name: 'María José López',
    role: 'Emprendedora · Ocotal',
    text: 'Thimpson Express me ha salvado en incontables ocasiones con mis entregas. Rápidos, responsables y siempre con una sonrisa. Los recomiendo al 100%.',
    rating: 5,
  },
  {
    name: 'Carlos Antonio Ruiz',
    role: 'Dueño de negocio · Estelí',
    text: 'Desde que uso Thimpson Express para mis encomiendas, mis clientes reciben sus pedidos en tiempo récord. El mejor servicio de delivery de la zona.',
    rating: 5,
  },
  {
    name: 'Ana Cecilia Martínez',
    role: 'Profesional · Madriz',
    text: 'Necesitaba un viaje urgente a primera hora y llegaron puntuales. El conductor fue muy amable y el vehículo impecable. Servicio de primera.',
    rating: 5,
  },
];

const highlights = [
  { icon: '⚡', title: 'Entrega Exprés', desc: '30 minutos o menos en entregas locales' },
  { icon: '🛡️', title: 'Seguro Garantizado', desc: 'Tu paquete y tu viaje siempre protegidos' },
  { icon: '📍', title: 'Cobertura Local', desc: 'Ocotal, Nueva Segovia' },
  { icon: '💬', title: 'Soporte Directo', desc: 'Atención al cliente Lun-Dom 8AM a 10PM' },
];

const Testimonials = () => (
  <section id="testimonios" className="py-24 bg-thimpson-offwhite">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-thimpson-yellow/10 border border-thimpson-yellow/30 px-3 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 bg-thimpson-yellow" />
          <span className="text-thimpson-yellow text-xs font-semibold tracking-widest uppercase">Por Qué Elegirnos</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-thimpson-dark mb-4 tracking-tight">
          Lo que dicen{' '}
          <span className="text-thimpson-yellow">nuestros clientes</span>
        </h2>
        <div className="h-0.5 w-16 bg-thimpson-yellow mx-auto mb-6" />
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          La satisfacción de quienes confían en nosotros es nuestra mejor carta de presentación.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-0 border border-gray-200 mb-16">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-white p-8 border-r border-b border-gray-200 last:border-r-0 md:last:border-r md:border-b-0">
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <svg key={i} className="w-5 h-5 text-thimpson-yellow" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
            <div>
              <p className="font-bold text-thimpson-dark text-sm">{t.name}</p>
              <p className="text-gray-400 text-xs">{t.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-gray-200">
        {highlights.map((h) => (
          <div key={h.title} className="bg-white p-4 sm:p-6 border-r border-b border-gray-200 last:border-r-0 text-center group hover:bg-thimpson-dark transition-colors duration-300">
            <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform duration-300">{h.icon}</span>
            <h4 className="font-bold text-thimpson-dark text-sm mb-1 group-hover:text-thimpson-yellow transition-colors">{h.title}</h4>
            <p className="text-gray-500 text-xs group-hover:text-gray-400 transition-colors">{h.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
