const Contact = ({ children }) => (
  <section id="contacto" className="py-24 bg-thimpson-offwhite">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {children && (
          <div>
            {children}
          </div>
        )}
        <div>
          <div className="inline-flex items-center gap-2 bg-thimpson-yellow/10 border border-thimpson-yellow/30 px-3 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-thimpson-yellow" />
            <span className="text-thimpson-yellow text-xs font-semibold tracking-widest uppercase">Contacto</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-thimpson-dark mb-6 tracking-tight">
            Estamos aquí para{' '}
            <span className="text-thimpson-yellow">ayudarte</span>
          </h2>
          <div className="h-0.5 w-16 bg-thimpson-yellow mb-8" />
          <p className="text-gray-500 text-lg leading-relaxed mb-10">
            ¿Tienes alguna pregunta o deseas solicitar nuestro servicio? 
            Escríbenos por WhatsApp y te atenderemos de inmediato.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-thimpson-dark flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-thimpson-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono / WhatsApp</p>
                <div className="flex flex-col gap-0.5">
                  <a href="https://wa.me/50584159112" target="_blank" rel="noopener noreferrer" className="text-thimpson-yellow font-bold text-lg hover:underline">
                    Claro: +505 8415-9112
                  </a>
                  <a href="https://wa.me/50585932295" target="_blank" rel="noopener noreferrer" className="text-thimpson-yellow font-bold text-lg hover:underline">
                    Tigo: +505 8593-2295
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-thimpson-dark flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-thimpson-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ubicación</p>
                <p className="text-thimpson-dark font-medium">Ocotal, Nueva Segovia, Nicaragua</p>
                <p className="text-thimpson-gray text-xs mt-0.5">Cobertura: Nueva Segovia · Madriz · Estelí</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-thimpson-dark flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-thimpson-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Horario</p>
                <p className="text-thimpson-dark font-medium">Lunes a Domingo - 8:00 AM a 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-thimpson-dark p-8 sm:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-thimpson-yellow flex items-center justify-center">
              <span className="text-thimpson-dark font-black text-2xl">T</span>
            </div>
            <div>
              <p className="text-white font-bold text-xl">Thimpson Express</p>
              <p className="text-thimpson-gray text-xs tracking-wider uppercase">Respuesta Inmediata</p>
            </div>
          </div>

          <p className="text-gray-300 text-lg mb-8">
            ¡Contáctanos ahora! Estamos listos para atender tu solicitud en menos de 5 minutos.
          </p>

          <div className="border border-white/10 p-6 mb-8">
            <p className="text-thimpson-yellow text-sm font-bold tracking-wider uppercase mb-2">Tiempo de respuesta</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500" />
              <span className="text-gray-300 text-sm">Menos de 5 minutos</span>
            </div>
          </div>

          <a
            href="https://wa.me/50584159112"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-3 bg-thimpson-yellow text-thimpson-dark font-bold px-8 py-4 text-lg hover:brightness-110 transition-all duration-300 shadow-lg shadow-thimpson-yellow/25"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default Contact;
