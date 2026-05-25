import { useState } from 'react';
import emailjs from '@emailjs/browser';

const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID_CONTACT = 'YOUR_CONTACT_TEMPLATE_ID';

const subjects = [
  { value: 'informacion', label: 'Solicitar información' },
  { value: 'cotizacion', label: 'Pedir cotización' },
  { value: 'sugerencia', label: 'Sugerencia' },
  { value: 'reclamo', label: 'Reclamo' },
  { value: 'otro', label: 'Otro' },
];

const ContactForm = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.mensaje) return;

    setStatus('loading');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID_CONTACT,
        {
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          asunto: subjects.find((s) => s.value === form.asunto)?.label || form.asunto,
          mensaje: form.mensaje,
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      setMessage('¡Mensaje enviado con éxito! Te responderemos a la brevedad.');
      setForm({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
    } catch {
      setStatus('error');
      setMessage('No se pudo enviar el mensaje. Escríbenos directamente por WhatsApp.');
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-8 sm:p-10">
      <h3 className="text-xl font-bold text-thimpson-dark mb-2">Envíanos un mensaje</h3>
      <p className="text-gray-500 text-sm mb-8">Te responderemos en menos de 24 horas.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Nombre *</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => update('nombre', e.target.value)}
              placeholder="Tu nombre completo"
              required
              className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-thimpson-yellow"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Correo *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="tu@correo.com"
              required
              className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-thimpson-yellow"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Teléfono</label>
            <input
              type="tel"
              value={form.telefono}
              onChange={(e) => update('telefono', e.target.value)}
              placeholder="+505 XXXX-XXXX"
              className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-thimpson-yellow"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Asunto</label>
            <select
              value={form.asunto}
              onChange={(e) => update('asunto', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-thimpson-yellow bg-white"
            >
              <option value="">Seleccionar...</option>
              {subjects.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Mensaje *</label>
          <textarea
            value={form.mensaje}
            onChange={(e) => update('mensaje', e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            rows={5}
            required
            className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-thimpson-yellow resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-4 bg-thimpson-dark text-white font-bold text-sm hover:bg-thimpson-dark-secondary transition-colors disabled:opacity-50 tracking-wide"
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-4 border text-sm ${
          status === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-yellow-50 border-yellow-200 text-yellow-700'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-gray-500 text-sm mb-3">¿Prefieres contactarnos directamente?</p>
        <a
          href="https://wa.me/584143443746"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-thimpson-yellow text-thimpson-dark font-bold px-6 py-3 text-sm hover:brightness-110 transition-all"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Escribir por WhatsApp
        </a>
      </div>
    </div>
  );
};

export default ContactForm;
