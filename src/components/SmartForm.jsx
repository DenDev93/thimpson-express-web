import { useState } from 'react';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import RouteMap from './RouteMap';
import { saveOrder } from './OrderTracking';

const BASE_FEE = 40;
const MONEDA = 'C$';

const servicesConfig = {
  delivery: { title: 'Delivery Express', emoji: '🛵', color: 'bg-thimpson-yellow',
    steps: [
      { id: 'tipo', label: 'Tipo de entrega' },
      { id: 'origen', label: 'Origen' },
      { id: 'destino', label: 'Destino' },
      { id: 'detalles', label: 'Detalles' },
      { id: 'confirmar', label: 'Confirmar' },
    ],
  },
  // viaje: { title: 'Viaje Privado', emoji: '🚗', color: 'bg-thimpson-yellow',
  //   steps: [
  //     { id: 'tipo', label: 'Tipo de viaje' },
  //     { id: 'origen', label: 'Origen' },
  //     { id: 'destino', label: 'Destino' },
  //     { id: 'detalles', label: 'Detalles' },
  //     { id: 'confirmar', label: 'Confirmar' },
  //   ],
  // },
  encomienda: { title: 'Encomiendas', emoji: '📦', color: 'bg-thimpson-yellow',
    steps: [
      { id: 'tipo', label: 'Tipo de paquete' },
      { id: 'origen', label: 'Origen' },
      { id: 'destino', label: 'Destino' },
      { id: 'detalles', label: 'Detalles' },
      { id: 'confirmar', label: 'Confirmar' },
    ],
  },
  mandado: { title: 'Mandados', emoji: '🛒', color: 'bg-thimpson-yellow',
    steps: [
      { id: 'tipo', label: 'Tipo de mandado' },
      { id: 'origen', label: 'Ubicación' },
      { id: 'destino', label: 'Destino' },
      { id: 'detalles', label: 'Detalles' },
      { id: 'confirmar', label: 'Confirmar' },
    ],
  },
  // transporte: { title: 'Transporte', emoji: '🏍️', color: 'bg-thimpson-yellow',
  //   steps: [
  //     { id: 'tipo', label: 'Tipo de transporte' },
  //     { id: 'origen', label: 'Origen' },
  //     { id: 'destino', label: 'Destino' },
  //     { id: 'detalles', label: 'Detalles' },
  //     { id: 'confirmar', label: 'Confirmar' },
  //   ],
  // },
};

const deliveryTypes = [
  { value: 'comida', label: 'Comida / Restaurante' },
  { value: 'documentos', label: 'Documentos' },
  { value: 'paquete', label: 'Paquete pequeño' },
  { value: 'medicinas', label: 'Medicinas / Farmacia' },
  { value: 'otro', label: 'Otro' },
];

// const viajeTypes = [
//   { value: 'inmediato', label: 'Viaje inmediato' },
//   { value: 'programado', label: 'Viaje programado' },
//   { value: 'aeropuerto', label: 'Traslado al aeropuerto' },
//   { value: 'evento', label: 'Evento especial' },
// ];

const encomiendaTypes = [
  { value: 'sobre', label: 'Sobre / Documentos' },
  { value: 'caja', label: 'Caja / Paquete' },
  { value: 'electronico', label: 'Dispositivo electrónico' },
  { value: 'alimento', label: 'Alimentos' },
  { value: 'otro', label: 'Otro' },
];

const mandadoTypes = [
  { value: 'supermercado', label: 'Supermercado' },
  { value: 'farmacia', label: 'Farmacia' },
  { value: 'tienda', label: 'Tienda / Comercio' },
  { value: 'pago', label: 'Pago de servicios' },
  { value: 'otro', label: 'Otro' },
];

// const transporteTypes = [
//   { value: 'punto_a_punto', label: 'Punto A → Punto B' },
//   { value: 'multi_parada', label: 'Múltiples paradas' },
//   { value: 'vuelta', label: 'Ida y Vuelta' },
// ];

const typeMap = {
  delivery: deliveryTypes,
  // viaje: viajeTypes,
  encomienda: encomiendaTypes,
  mandado: mandadoTypes,
  // transporte: transporteTypes,
};

const getCurrentLocation = () => {
  if (!navigator.geolocation) return Promise.reject('Geolocalización no disponible');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
      () => reject('No se pudo obtener ubicación')
    );
  });
};

const StepIndicator = ({ steps, current, visited }) => (
  <div className="flex items-center gap-1 mb-6">
    {steps.map((step, i) => (
      <div key={step.id} className="flex items-center flex-1">
        <div className={`flex items-center justify-center w-8 h-8 text-xs font-bold border ${
          current === i
            ? 'bg-thimpson-yellow text-thimpson-dark border-thimpson-yellow'
            : visited[i]
              ? 'bg-green-500 text-white border-green-500'
              : 'bg-gray-100 text-gray-400 border-gray-200'
        }`}>
          {visited[i] && current !== i ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            i + 1
          )}
        </div>
        {i < steps.length - 1 && (
          <div className={`flex-1 h-0.5 mx-1 ${visited[i] ? 'bg-green-500' : 'bg-gray-200'}`} />
        )}
      </div>
    ))}
  </div>
);

const generateOrderNumber = () => {
  const prefix = 'TEX';
  const nums = Date.now().toString().slice(-6);
  const rand = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${prefix}-${nums}${rand}`;
};

function SmartForm({ service, onSubmit }) {
  const config = servicesConfig[service];
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState([true, false, false, false, false]);
  const [orderNumber, setOrderNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    tipo: '',
    origen: '',
    origenRef: '',
    destino: '',
    destinoRef: '',
    descripcion: '',
    monto_producto: '',
    urgencia: 'normal',
    nombre: '',
    telefono: '',
    multiStop: false,
    destinos: [],
    cedula: '',
    fechaNacimiento: '',
    zona: 'urbana',
    roundTrip: false,
  });
  const [errors, setErrors] = useState({});
  const [locating, setLocating] = useState(false);
  const costoProducto = parseFloat(form.monto_producto) || 0;
  const numDestinos = form.multiStop
    ? form.destinos.filter(d => d.dir.trim()).length
    : (form.destino ? 1 : 0);
  const numCarreras = numDestinos + (form.roundTrip ? 1 : 0);
  const totalCarreras = numCarreras * BASE_FEE;
  const total = totalCarreras + costoProducto;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 0 && !form.tipo) newErrors.tipo = 'Selecciona una opción';
    if (step === 1 && !form.origen) newErrors.origen = 'Indica el origen';
    if (step === 2 && !form.multiStop && !form.destino) newErrors.destino = 'Indica el destino';
    if (step === 2 && form.multiStop) {
      const emptyIdx = form.destinos.findIndex((d) => !d.dir);
      if (emptyIdx >= 0) newErrors.destino = `Completa la dirección de la parada ${emptyIdx + 1}`;
    }
    if (step === 3 && !form.nombre) newErrors.nombre = 'Ingresa tu nombre';
    if (step === 3 && !form.telefono) newErrors.telefono = 'Ingresa tu teléfono';
    if (step === 3 && !form.cedula) newErrors.cedula = 'Ingresa tu número de cédula';
    if (step === 3 && form.cedula && form.cedula.replace(/[\s-]/g, '').length < 10) newErrors.cedula = 'Cédula inválida';
    if (step === 3 && !form.fechaNacimiento) newErrors.fechaNacimiento = 'Ingresa tu fecha de nacimiento';
    if (step === 3 && form.fechaNacimiento) {
      const nac = new Date(form.fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - nac.getFullYear();
      const mes = hoy.getMonth() - nac.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
      if (edad < 18) newErrors.fechaNacimiento = 'Debes ser mayor de 18 años para solicitar el servicio';
    }
    if (step === 3) {
      const hora = new Date().getHours();
      if (hora >= 20 && form.zona === 'periferica') {
        newErrors.zona = 'No podemos atender áreas periféricas después de las 8:00 PM';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    const next = step + 1;
    if (next < config.steps.length) {
      setVisited((prev) => { const copy = [...prev]; copy[next] = true; return copy; });
      setStep(next);
    }
  };

  const prevStep = () => { if (step > 0) setStep(step - 1); };

  const toggleMultiStop = () => {
    setForm((prev) => ({
      ...prev,
      multiStop: !prev.multiStop,
      destinos: !prev.multiStop ? [{ dir: '', ref: '' }] : [],
      destino: !prev.multiStop ? '' : prev.destino,
    }));
  };

  const addDestino = () => {
    setForm((prev) => ({ ...prev, destinos: [...prev.destinos, { dir: '', ref: '' }] }));
  };

  const removeDestino = (idx) => {
    setForm((prev) => ({ ...prev, destinos: prev.destinos.filter((_, i) => i !== idx) }));
  };

  const updateDestino = (idx, field, value) => {
    setForm((prev) => {
      const d = [...prev.destinos];
      d[idx] = { ...d[idx], [field]: value };
      return { ...prev, destinos: d };
    });
  };

  const handleLocate = async (field) => {
    setLocating(true);
    try {
      const loc = await getCurrentLocation();
      updateField(field, loc);
    } catch {
      updateField(field, 'Ubicación actual');
    }
    setLocating(false);
  };

  const descargarPDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a5');
      const w = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const y0 = 20;
      let y = y0;
      const ln = 7;
      const num = orderNumber || generateOrderNumber();
      const cp = costoProducto;
      const ttl = total;
      const fecha = new Date().toLocaleString('es-NI');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text('THIMPSON EXPRESS', w / 2, y, { align: 'center' });
      y += ln;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(100);
      pdf.text('Comprobante de Solicitud', w / 2, y, { align: 'center' });
      y += ln + 2;
      pdf.setDrawColor(220);
      pdf.line(margin, y, w - margin, y);
      y += ln;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(0);
      pdf.text(`Orden #${num}`, w / 2, y, { align: 'center' });
      y += ln + 3;
      pdf.line(margin, y, w - margin, y);
      y += ln;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      const labelW = 35;
      const valX = margin + labelW;

      const row = (label, value) => {
        pdf.setTextColor(140);
        pdf.text(label, margin, y);
        pdf.setTextColor(0);
        pdf.text(value, valX, y);
        y += ln;
      };

      row('Servicio:', servicesConfig[service]?.title || '');
      row('Tipo:', typeMap[service]?.find(t => t.value === form.tipo)?.label || form.tipo);
      row('Origen:', form.origen + (form.origenRef ? ` (${form.origenRef})` : ''));
      if (form.multiStop) {
        const stopsStr = form.destinos.filter(d => d.dir).map((d, i) => `${i + 1}. ${d.dir}${d.ref ? ` (${d.ref})` : ''}`).join(' | ');
        row('Paradas:', stopsStr);
      } else {
        row('Destino:', form.destino + (form.destinoRef ? ` (${form.destinoRef})` : ''));
      }
      if (form.descripcion) row('Detalle:', form.descripcion);
      row('Carreras:', `${numCarreras} × ${MONEDA}${BASE_FEE}.00 = ${MONEDA}${totalCarreras.toFixed(2)}`);
      if (form.roundTrip) row('Vuelta:', `${MONEDA}${BASE_FEE}.00`);
      if (cp > 0) row('Producto:', `${MONEDA}${cp.toFixed(2)}`);

      y += 2;
      pdf.setFont('helvetica', 'bold');
      row('Total:', `${MONEDA}${ttl.toFixed(2)}`);
      pdf.setFont('helvetica', 'normal');
      row('Pago:', 'Efectivo');

      y += 3;
      pdf.line(margin, y, w - margin, y);
      y += ln;
      pdf.setTextColor(160);
      pdf.setFontSize(8);
      pdf.text(`${form.nombre} - Cédula: ${form.cedula}`, w / 2, y, { align: 'center' });
      y += ln;
      pdf.text(`${form.telefono}`, w / 2, y, { align: 'center' });
      y += ln;
      pdf.text(fecha, w / 2, y, { align: 'center' });

      pdf.save(`comprobante-${num}.pdf`);
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo generar el PDF.' });
    }
  };

  const handleSubmit = async (tipoEnvio) => {
    if (!validateStep()) return;

    const num = generateOrderNumber();
    if (!orderNumber) setOrderNumber(num);

    const numDestinosH = form.multiStop
      ? form.destinos.filter(d => d.dir.trim()).length
      : (form.destino ? 1 : 0);
    const numCarrerasH = numDestinosH + (form.roundTrip ? 1 : 0);
    const totalCarrerasH = numCarrerasH * BASE_FEE;
    const costoProductoH = parseFloat(form.monto_producto) || 0;
    const totalH = totalCarrerasH + costoProductoH;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(form.origen)}&destination=${encodeURIComponent(form.destino)}`;

    const apiUrl = window.location.hostname === 'localhost'
      ? 'http://localhost/server.thimpsonadmin.app/thimpson-admin/api/ordenes'
      : 'https://thimpson-admin.onrender.com/api/ordenes';

    const body = {
      numero_orden: num,
      tipo_servicio: service,
      subtipo: form.tipo,
      cliente_nombre: form.nombre,
      cliente_telefono: form.telefono,
      cliente_email: '',
      origen_direccion: form.origen,
      origen_referencia: form.origenRef,
      destino_direccion: form.destino,
      destino_referencia: form.destinoRef,
      descripcion: form.descripcion,
      urgencia: form.urgencia,
      monto_producto: costoProductoH,
      num_carreras: numCarrerasH,
      tarifa_carrera: BASE_FEE,
      total_carreras: totalCarrerasH,
      round_trip: form.roundTrip,
      total: totalH,
      moneda: MONEDA,
    };

    const destinosTexto = form.multiStop && form.destinos.length > 0
      ? form.destinos.filter(d => d.dir).map((d, i) => `  ${i + 1}. ${d.dir}${d.ref ? ` (${d.ref})` : ''}`).join('\n')
      : `  ${form.destino}${form.destinoRef ? ` (${form.destinoRef})` : ''}`;

    const orderData = { ...body, estado: 'pendiente', tipo_servicio: config.title };
    saveOrder(orderData);

    if (tipoEnvio === 'api') {
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          Swal.fire({ icon: 'success', title: '¡Solicitud registrada!', text: `Orden #${num} creada exitosamente.`, timer: 3000, showConfirmButton: false });
        } else {
          const errData = await res.json().catch(() => ({}));
          Swal.fire({ icon: 'error', title: 'Error', text: errData.message || 'Ocurrió un error.' });
        }
      } catch {
        Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo conectar con el servidor.' });
      }
      setSubmitted(true);
      setTimeout(() => descargarPDF(), 1500);
    } else {
      let detallePrecio = `• Carreras: ${numCarreras} × ${MONEDA}${BASE_FEE}.00 = ${MONEDA}${totalCarreras.toFixed(2)}`;
      if (form.roundTrip) detallePrecio += `\n• Incluye vuelta al origen`;
      if (costoProducto > 0) detallePrecio += `\n• Producto: ${MONEDA}${costoProducto.toFixed(2)}`;
      const destinosTextoW = form.multiStop && form.destinos.length > 0
        ? form.destinos.filter(d => d.dir).map((d, i) => `  ${i + 1}. ${d.dir}${d.ref ? ` (${d.ref})` : ''}`).join('\n')
        : `  ${form.destino}${form.destinoRef ? ` (${form.destinoRef})` : ''}`;

      const msg = encodeURIComponent(`Hola Thimpson Express! Solicito #${num}:
Servicio: ${config.title}
Tipo: ${typeMap[service]?.find(t => t.value === form.tipo)?.label || form.tipo}
Origen: ${form.origen}
Destino${form.multiStop ? 's' : ''}: ${destinosTextoW}
${detallePrecio}
Total: ${MONEDA}${total.toFixed(2)}
Pago: Efectivo
Nombre: ${form.nombre}
Tel: ${form.telefono}
Mapa: ${mapsUrl}`);

      window.open(`https://wa.me/50584159112?text=${msg}`, '_blank');
      saveOrder(orderData);
      setSubmitted(true);

      try {
        await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } catch {}
      setTimeout(() => descargarPDF(), 2000);
    }
  };

  const mapsEmbedUrl = form.origen && form.destino
    ? `https://maps.google.com/maps?q=${encodeURIComponent(form.destino)}&output=embed`
    : '';

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="animate-slide-up">
            <p className="text-gray-600 mb-4 text-sm">¿Qué necesitas enviar o solicitar?</p>
            <div className="grid grid-cols-1 gap-2">
              {(typeMap[service] || []).map((t) => (
                <button
                  key={t.value}
                  onClick={() => { updateField('tipo', t.value); }}
                  className={`text-left px-4 py-3 border text-sm font-medium transition-all ${
                    form.tipo === t.value
                      ? 'bg-thimpson-yellow/10 border-thimpson-yellow text-thimpson-dark'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {errors.tipo && <p className="text-red-500 text-xs mt-2">{errors.tipo}</p>}
          </div>
        );
      case 1:
        return (
          <div className="animate-slide-up space-y-4">
            <p className="text-gray-600 text-sm">¿Desde dónde?</p>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dirección de origen</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={form.origen}
                  onChange={(e) => updateField('origen', e.target.value)}
                  placeholder="Ej: Av. Principal, Edif. 123"
                  className={`flex-1 px-4 py-3 border text-sm ${errors.origen ? 'border-red-500' : 'border-gray-300'} focus:border-thimpson-yellow`}
                />
                <button
                  onClick={() => handleLocate('origen')}
                  disabled={locating}
                  className="px-3 border border-gray-300 hover:bg-gray-50 text-gray-500 text-sm font-medium transition-colors disabled:opacity-50"
                  title="Usar ubicación actual"
                >
                  {locating ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.origen && <p className="text-red-500 text-xs mt-1">{errors.origen}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Referencia (opcional)</label>
              <input
                type="text"
                value={form.origenRef}
                onChange={(e) => updateField('origenRef', e.target.value)}
                placeholder="Ej: frente al banco, edificio azul"
                className="w-full px-4 py-3 border border-gray-300 text-sm mt-1 focus:border-thimpson-yellow"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-slide-up space-y-4">
            <p className="text-gray-600 text-sm">¿Hacia dónde?</p>

            {(service === 'mandado' || service === 'transporte' || service === 'delivery') && (
              <button
                onClick={toggleMultiStop}
                className={`w-full py-2.5 border text-xs font-semibold tracking-wider uppercase transition-all ${
                  form.multiStop
                    ? 'bg-thimpson-yellow/10 border-thimpson-yellow text-thimpson-dark'
                    : 'border-gray-300 text-gray-500 hover:border-gray-400'
                }`}
              >
                {form.multiStop ? '✓ Varias paradas activado' : '➕ Varias paradas'}
              </button>
            )}

            {!form.multiStop ? (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dirección de destino</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={form.destino}
                      onChange={(e) => updateField('destino', e.target.value)}
                      placeholder="Ej: Calle 5, Local 45"
                      className={`flex-1 px-4 py-3 border text-sm ${errors.destino ? 'border-red-500' : 'border-gray-300'} focus:border-thimpson-yellow`}
                    />
                    <button
                      onClick={() => handleLocate('destino')}
                      disabled={locating}
                      className="px-3 border border-gray-300 hover:bg-gray-50 text-gray-500 text-sm font-medium transition-colors disabled:opacity-50"
                      title="Usar ubicación actual"
                    >
                      {locating ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.destino && <p className="text-red-500 text-xs mt-1">{errors.destino}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Referencia (opcional)</label>
                  <input
                    type="text"
                    value={form.destinoRef}
                    onChange={(e) => updateField('destinoRef', e.target.value)}
                    placeholder="Ej: segundo piso, oficina 2B"
                    className="w-full px-4 py-3 border border-gray-300 text-sm mt-1 focus:border-thimpson-yellow"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">Agrega todas las direcciones de tu recorrido:</p>
                {form.destinos.map((d, idx) => (
                  <div key={idx} className="border border-gray-200 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-thimpson-dark uppercase">Parada {idx + 1}</span>
                      {form.destinos.length > 1 && (
                        <button onClick={() => removeDestino(idx)} className="text-red-500 text-xs hover:text-red-700">
                          Eliminar
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={d.dir}
                      onChange={(e) => updateDestino(idx, 'dir', e.target.value)}
                      placeholder="Dirección de la parada"
                      className="w-full px-3 py-2.5 border border-gray-300 text-sm mb-2 focus:border-thimpson-yellow"
                    />
                    <input
                      type="text"
                      value={d.ref}
                      onChange={(e) => updateDestino(idx, 'ref', e.target.value)}
                      placeholder="Referencia (opcional)"
                      className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:border-thimpson-yellow"
                    />
                  </div>
                ))}
                <button
                  onClick={addDestino}
                  className="w-full py-2.5 border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:border-thimpson-yellow hover:text-thimpson-yellow transition-colors"
                >
                  + Agregar otra parada
                </button>
                <label className="flex items-center gap-3 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={form.roundTrip}
                    onChange={(e) => updateField('roundTrip', e.target.checked)}
                    className="w-4 h-4 border-gray-300 text-thimpson-yellow focus:ring-thimpson-yellow"
                  />
                  <span className="text-sm text-gray-600">
                    Incluir <strong>vuelta al origen</strong> (+{MONEDA}{BASE_FEE})
                  </span>
                </label>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="animate-slide-up space-y-4">
            <p className="text-gray-600 text-sm">Completa los datos de tu solicitud</p>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción / Instrucciones</label>
              <textarea
                value={form.descripcion}
                onChange={(e) => updateField('descripcion', e.target.value)}
                placeholder="Alguna instrucción especial..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 text-sm mt-1 focus:border-thimpson-yellow resize-none"
              />
            </div>
            {service !== 'viaje' && service !== 'transporte' && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Monto del producto {MONEDA}</label>
                <input
                  type="number"
                  value={form.monto_producto}
                  onChange={(e) => updateField('monto_producto', e.target.value)}
                  placeholder="Ej: 200"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 text-sm mt-1 focus:border-thimpson-yellow"
                />
                <p className="text-gray-400 text-xs mt-1">Costo de lo solicitado (sin incluir la tarifa de carrera)</p>
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Urgencia</label>
              <div className="flex gap-2 mt-1">
                {['normal', 'urgente'].map((u) => (
                  <button
                    key={u}
                    onClick={() => updateField('urgencia', u)}
                    className={`flex-1 py-3 border text-sm font-medium transition-all ${
                      form.urgencia === u
                        ? u === 'urgente'
                          ? 'bg-red-50 border-red-400 text-red-600'
                          : 'bg-thimpson-yellow/10 border-thimpson-yellow text-thimpson-dark'
                        : 'border-gray-200 text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    {u === 'urgente' ? '⚡ Urgente' : '✓ Normal'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Zona</label>
              <div className="flex gap-2 mt-1">
                {[{ value: 'urbana', label: 'Urbana' }, { value: 'periferica', label: 'Periférica' }].map((z) => (
                  <button
                    key={z.value}
                    onClick={() => updateField('zona', z.value)}
                    className={`flex-1 py-3 border text-sm font-medium transition-all ${
                      form.zona === z.value
                        ? 'bg-thimpson-yellow/10 border-thimpson-yellow text-thimpson-dark'
                        : 'border-gray-200 text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>
              {errors.zona && <p className="text-red-500 text-xs mt-2">{errors.zona}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tu nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => updateField('nombre', e.target.value)}
                  placeholder="Nombre completo"
                  className={`w-full px-4 py-3 border text-sm mt-1 ${errors.nombre ? 'border-red-500' : 'border-gray-300'} focus:border-thimpson-yellow`}
                />
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => updateField('telefono', e.target.value)}
                  placeholder="+505 XXXX-XXXX"
                  className={`w-full px-4 py-3 border text-sm mt-1 ${errors.telefono ? 'border-red-500' : 'border-gray-300'} focus:border-thimpson-yellow`}
                />
                {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Número de Cédula</label>
                <input
                  type="text"
                  value={form.cedula}
                  onChange={(e) => updateField('cedula', e.target.value)}
                  placeholder="001-123456-1234A"
                  className={`w-full px-4 py-3 border text-sm mt-1 ${errors.cedula ? 'border-red-500' : 'border-gray-300'} focus:border-thimpson-yellow`}
                />
                {errors.cedula && <p className="text-red-500 text-xs mt-1">{errors.cedula}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={form.fechaNacimiento}
                  onChange={(e) => updateField('fechaNacimiento', e.target.value)}
                  className={`w-full px-4 py-3 border text-sm mt-1 ${errors.fechaNacimiento ? 'border-red-500' : 'border-gray-300'} focus:border-thimpson-yellow`}
                />
                {errors.fechaNacimiento && <p className="text-red-500 text-xs mt-1">{errors.fechaNacimiento}</p>}
              </div>
            </div>
          </div>
        );
      case 4: {
        const destinosList = form.multiStop
          ? form.destinos.filter((d) => d.dir).map((d) => d.dir)
          : form.destino
            ? [form.destino]
            : [];
        const mapsUrl = form.multiStop
          ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(form.origen)}&destination=${encodeURIComponent(form.destinos[form.destinos.length - 1]?.dir || form.destino)}&waypoints=${form.destinos.slice(0, -1).filter(d => d.dir).map(d => encodeURIComponent(d.dir)).join('|')}`
          : `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(form.origen)}&destination=${encodeURIComponent(form.destino)}`;
        const orderNum = orderNumber || generateOrderNumber();
        if (!orderNumber) setOrderNumber(orderNum);

        return (
          <div className="animate-slide-up space-y-4 relative">
            {submitted && orderNumber && (
              <div className="bg-green-50 border border-green-200 p-4 text-center">
                <p className="text-green-700 font-bold text-lg">{orderNumber}</p>
                <p className="text-green-600 text-sm">Tu orden fue registrada exitosamente</p>
              </div>
            )}

            <div className="border border-gray-200 bg-thimpson-offwhite p-4">
              <h4 className="font-bold text-thimpson-dark mb-3 flex items-center gap-2">
                <span>{config.emoji}</span>
                {config.title}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-500">Tipo</span>
                  <span className="font-medium text-thimpson-dark">{typeMap[service]?.find(t => t.value === form.tipo)?.label || form.tipo}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-500">Origen</span>
                  <span className="font-medium text-thimpson-dark text-right max-w-[60%]">{form.origen}</span>
                </div>
                {form.origenRef && <div className="flex justify-between py-1 border-b border-gray-200"><span className="text-gray-500">Ref. origen</span><span className="font-medium text-thimpson-dark">{form.origenRef}</span></div>}
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-500">Destino</span>
                  <span className="font-medium text-thimpson-dark text-right max-w-[60%]">{form.destino}</span>
                </div>
                {form.destinoRef && <div className="flex justify-between py-1 border-b border-gray-200"><span className="text-gray-500">Ref. destino</span><span className="font-medium text-thimpson-dark">{form.destinoRef}</span></div>}
                {form.descripcion && <div className="flex justify-between py-1 border-b border-gray-200"><span className="text-gray-500">Descripción</span><span className="font-medium text-thimpson-dark text-right max-w-[60%]">{form.descripcion}</span></div>}
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-500">Urgencia</span>
                  <span className={`font-medium ${form.urgencia === 'urgente' ? 'text-red-500' : 'text-thimpson-dark'}`}>{form.urgencia === 'urgente' ? 'URGENTE' : 'Normal'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Contacto</span>
                  <span className="font-medium text-thimpson-dark">{form.nombre}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Cédula</span>
                  <span className="font-medium text-thimpson-dark">{form.cedula}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Teléfono</span>
                  <span className="font-medium text-thimpson-dark">{form.telefono}</span>
                </div>
              </div>
            </div>

            <div className="border-2 border-thimpson-yellow bg-thimpson-yellow/5 p-4">
              <h5 className="font-bold text-thimpson-dark text-sm mb-3 tracking-wider uppercase">Resumen de pago</h5>
              <div className="space-y-2 text-sm">
                {numCarreras > 0 && (
                  <div className="flex justify-between py-1 border-b border-thimpson-yellow/20">
                    <span className="text-gray-600">
                      {numCarreras} carrera{numCarreras > 1 ? 's' : ''} × {MONEDA}{BASE_FEE}
                    </span>
                    <span className="font-bold text-thimpson-dark">{MONEDA}{totalCarreras.toFixed(2)}</span>
                  </div>
                )}
                {form.roundTrip && (
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600 text-xs italic">Incluye vuelta al origen</span>
                    <span className="text-gray-400 text-xs">+{MONEDA}{BASE_FEE}.00</span>
                  </div>
                )}
                {costoProducto > 0 && (
                  <div className="flex justify-between py-1 border-b border-thimpson-yellow/20">
                    <span className="text-gray-600">Costo del producto</span>
                    <span className="font-medium text-thimpson-dark">{MONEDA}{costoProducto.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t-2 border-thimpson-yellow mt-1">
                  <span className="font-bold text-thimpson-dark">Total a pagar</span>
                  <span className="font-black text-thimpson-dark text-lg">{MONEDA}{total.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-1">Pago en efectivo</p>
            </div>

            {form.origen && destinosList.length > 0 && (
              <>
                <RouteMap origin={form.origen} destinations={destinosList} height={260} />
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Abrir ruta completa en Google Maps
                </a>
              </>
            )}



            <p className="text-center text-gray-500 text-xs">
              Al confirmar, tu solicitud será registrada y podrás descargar tu comprobante.
            </p>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div>
      {submitted ? (
        <div className="text-center py-8 animate-slide-up">
          <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-thimpson-dark mb-2">¡Solicitud enviada!</h3>
          <p className="text-thimpson-yellow font-black text-2xl mb-1">{orderNumber}</p>
          <p className="text-gray-500 text-sm mb-6">Guarda este número de orden para dar seguimiento.</p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button
              onClick={descargarPDF}
              className="w-full py-3 bg-thimpson-dark text-white font-bold text-sm hover:bg-thimpson-dark-secondary transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar comprobante PDF
            </button>
            <button
              onClick={() => { if (onSubmit) onSubmit(); }}
              className="w-full py-3 border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : (
        <>
          <StepIndicator steps={config.steps} current={step} visited={visited} />

          <div className="bg-thimpson-yellow/5 border border-thimpson-yellow/20 px-4 py-2 mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-gray-600 font-medium">
              {numCarreras > 0 ? `${numCarreras} carrera${numCarreras > 1 ? 's' : ''}` : 'Sin rutas'}
            </span>
            <div className="flex items-center gap-3">
              {numCarreras > 0 && (
                <span className="text-gray-500">
                  Carreras: <strong className="text-thimpson-dark">{MONEDA}{totalCarreras.toFixed(2)}</strong>
                </span>
              )}
              {costoProducto > 0 && (
                <span className="text-gray-500">
                  Producto: <strong className="text-thimpson-dark">{MONEDA}{costoProducto.toFixed(2)}</strong>
                </span>
              )}
              <span className="text-thimpson-dark font-black text-base">
                Total: {MONEDA}{total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="min-h-[280px]">
            {renderStep()}
          </div>

          <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
            {step > 0 ? (
              <button onClick={prevStep} className="px-6 py-3 border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
                ← Anterior
              </button>
            ) : <div />}

            {step < config.steps.length - 1 ? (
              <button onClick={nextStep} className="px-6 py-3 bg-thimpson-dark text-white text-sm font-semibold hover:bg-thimpson-dark-secondary transition-colors">
                Siguiente →
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleSubmit('whatsapp')}
                  className="px-6 py-3 bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </button>
                <button
                  onClick={() => handleSubmit('api')}
                  className="px-6 py-3 bg-thimpson-yellow text-thimpson-dark text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Enviar solicitud
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SmartForm;
