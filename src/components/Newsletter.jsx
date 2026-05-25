import { useState } from 'react';
import emailjs from '@emailjs/browser';

const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { email, source: 'newsletter_thimpson' },
        EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      setMessage('¡Gracias por suscribirte! Pronto recibirás nuestras novedades.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Guardamos tu suscripción. Te contactaremos pronto.');
      setEmail('');
    }
  };

  return (
    <section className="py-24 bg-thimpson-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-thimpson-dark via-thimpson-dark-secondary to-thimpson-dark" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-thimpson-yellow/5" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-thimpson-yellow/10 border border-thimpson-yellow/30 px-3 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 bg-thimpson-yellow" />
          <span className="text-thimpson-yellow text-xs font-semibold tracking-widest uppercase">Mantente Informado</span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
          Suscríbete a nuestro{' '}
          <span className="text-thimpson-yellow">Newsletter</span>
        </h2>
        <div className="h-0.5 w-16 bg-thimpson-yellow mx-auto mb-6" />
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
          Recibe ofertas exclusivas, novedades y promociones directamente en tu correo electrónico.
        </p>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              className="flex-1 px-5 py-4 border border-white/20 bg-white/5 text-white placeholder-gray-500 text-sm focus:border-thimpson-yellow"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-4 bg-thimpson-yellow text-thimpson-dark font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 tracking-wide"
            >
              {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-6 inline-flex items-center gap-2 px-4 py-3 border text-sm ${
            status === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-thimpson-yellow/10 border-thimpson-yellow/30 text-thimpson-yellow'
          }`}>
            <span>{status === 'success' ? '✓' : 'ℹ'}</span>
            {message}
          </div>
        )}

        <p className="text-gray-600 text-xs mt-6">
          Sin spam. Solo información relevante sobre nuestros servicios. Puedes darte de baja en cualquier momento.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
