const services = [
  {
    id: 'delivery',
    icon: '🛵',
    title: 'Delivery Express',
    desc: 'Llevamos tus pedidos de comida, documentos y más en tiempo récord.',
    features: ['30 min o menos', 'Seguimiento en tiempo real', 'Cobertura total'],
    gradient: 'from-thimpson-yellow/20 to-transparent',
  },
  // {
  //   id: 'viaje',
  //   icon: '🚗',
  //   title: 'Viajes Privados',
  //   desc: 'Transporte cómodo y seguro. Solicita tu viaje desde cualquier lugar.',
  //   features: ['Vehículos cómodos', 'Conductores verificados', 'Precios justos'],
  //   gradient: 'from-thimpson-yellow/20 to-transparent',
  // },
  {
    id: 'encomienda',
    icon: '📦',
    title: 'Encomiendas',
    desc: 'Envía y recibe paquetes de forma segura. Ideal para empresas.',
    features: ['Rastreo de paquetes', 'Seguro incluido', 'Puerta a puerta'],
    gradient: 'from-thimpson-yellow/20 to-transparent',
  },
  {
    id: 'mandado',
    icon: '🛒',
    title: 'Mandados',
    desc: 'Farmacia, supermercado o tienda. Nosotros lo hacemos por ti.',
    features: ['Compra asistida', 'Pago en efectivo', 'Entrega inmediata'],
    gradient: 'from-thimpson-yellow/20 to-transparent',
  },
  // {
  //   id: 'transporte',
  //   icon: '🏍️',
  //   title: 'Transporte',
  //   desc: 'Te recogemos y llevamos a tu destino en moto. Rápido y económico.',
  //   features: ['Punto a punto', 'Múltiples paradas', 'Ida y vuelta'],
  //   gradient: 'from-thimpson-yellow/20 to-transparent',
  // },
];

const Services = ({ onRequestService }) => (
  <section id="servicios" className="py-24 bg-thimpson-offwhite">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-thimpson-yellow/10 border border-thimpson-yellow/30 px-3 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 bg-thimpson-yellow" />
          <span className="text-thimpson-yellow text-xs font-semibold tracking-widest uppercase">Nuestros Servicios</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-thimpson-dark mb-4 tracking-tight">
          Todo lo que necesitas
        </h2>
        <div className="h-0.5 w-16 bg-thimpson-yellow mx-auto mb-6" />
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Soluciones de movilidad y delivery diseñadas para hacerte la vida más fácil.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="group relative bg-white border border-gray-200 p-5 sm:p-6 lg:p-8 hover:border-thimpson-yellow hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => onRequestService(service.id)}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-thimpson-yellow scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

            <div className="absolute top-4 right-4 bg-thimpson-yellow/10 border border-thimpson-yellow/30 px-2 py-0.5">
              <span className="text-thimpson-yellow text-xs font-bold">C$40</span>
            </div>

            <div className="w-14 h-14 bg-thimpson-dark flex items-center justify-center mb-6 group-hover:bg-thimpson-yellow transition-colors duration-300">
              <span className="text-2xl">{service.icon}</span>
            </div>

            <h3 className="text-xl font-bold text-thimpson-dark mb-3">{service.title}</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{service.desc}</p>

            <ul className="space-y-2 mb-8">
              {service.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-thimpson-yellow flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>

            <button className="w-full py-3 border border-thimpson-dark text-thimpson-dark text-sm font-bold group-hover:bg-thimpson-dark group-hover:text-thimpson-yellow transition-all duration-300 flex items-center justify-center gap-2">
              Solicitar
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
