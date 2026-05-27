import { useState } from 'react';

const STATUSES = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-500', icon: '⏳' },
  en_camino: { label: 'En Camino', color: 'bg-blue-500', icon: '🚚' },
  entregado: { label: 'Entregado', color: 'bg-green-500', icon: '✅' },
};

const STEPS = ['pendiente', 'en_camino', 'entregado'];

const getOrders = () => {
  try {
    const data = localStorage.getItem('thimpson_orders');
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveOrder = (order) => {
  const orders = getOrders();
  orders[order.numero_orden] = { ...order, updatedAt: new Date().toISOString() };
  localStorage.setItem('thimpson_orders', JSON.stringify(orders));
};

export { saveOrder };

const OrderTracking = ({ onClose }) => {
  const [searchNum, setSearchNum] = useState('');
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchNum.trim()) return;
    const orders = getOrders();
    const found = orders[searchNum.trim().toUpperCase()];
    if (found) {
      setOrder(found);
      setNotFound(false);
    } else {
      setOrder(null);
      setNotFound(true);
    }
  };

  const currentIdx = order ? STEPS.indexOf(order.estado || 'pendiente') : -1;

  return (
    <div className="animate-slide-up">
      {!order ? (
        <>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-thimpson-yellow/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-thimpson-dark mb-2">Seguimiento de Pedido</h3>
            <p className="text-gray-500 text-sm mb-6">
              Ingresa tu número de orden para ver el estado de tu solicitud.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-sm mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={searchNum}
                onChange={(e) => setSearchNum(e.target.value)}
                placeholder="Ej: ORD-123456"
                className="flex-1 px-4 py-3 border border-gray-300 text-sm focus:border-thimpson-yellow text-center font-bold uppercase"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-thimpson-yellow text-thimpson-dark font-bold text-sm hover:brightness-110 transition-all"
              >
                Buscar
              </button>
            </div>
          </form>

          {notFound && (
            <p className="text-red-500 text-sm text-center mt-4">
              No encontramos ninguna orden con ese número. Verifica e intenta de nuevo.
            </p>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-thimpson-yellow/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">{STATUSES[order.estado || 'pendiente'].icon}</span>
            </div>
            <h3 className="text-xl font-bold text-thimpson-dark mb-1">Orden #{order.numero_orden}</h3>
            <p className="text-gray-500 text-sm">{order.cliente_nombre}</p>
          </div>

          <div className="border border-gray-200 bg-thimpson-offwhite p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Servicio</span>
                <span className="font-medium text-thimpson-dark">{order.tipo_servicio}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Origen</span>
                <span className="font-medium text-thimpson-dark text-right max-w-[60%]">{order.origen_direccion}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Destino</span>
                <span className="font-medium text-thimpson-dark text-right max-w-[60%]">{order.destino_direccion}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Total</span>
                <span className="font-bold text-thimpson-dark">C${order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-6 relative">
              {STEPS.map((step, i) => {
                const s = STATUSES[step];
                const active = i <= currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <div key={step} className="flex items-start gap-4">
                    <div className={`relative z-10 w-[46px] h-[46px] flex items-center justify-center border-2 flex-shrink-0 ${
                      active
                        ? `${s.color} border-${step === 'entregado' ? 'green' : step === 'en_camino' ? 'blue' : 'yellow'}-500 text-white`
                        : 'bg-white border-gray-300 text-gray-400'
                    } ${isCurrent ? 'shadow-lg scale-110' : ''} transition-all duration-300`}>
                      <span className="text-lg">{s.icon}</span>
                    </div>
                    <div className="pt-3">
                      <p className={`font-bold text-sm ${active ? 'text-thimpson-dark' : 'text-gray-400'}`}>
                        {s.label}
                        {isCurrent && active && <span className="ml-2 text-xs text-thimpson-yellow">(Actual)</span>}
                      </p>
                      {i === 0 && active && (
                        <p className="text-xs text-gray-500 mt-0.5">Solicitud registrada</p>
                      )}
                      {i === 1 && active && (
                        <p className="text-xs text-blue-500 mt-0.5">Tu pedido está en camino</p>
                      )}
                      {i === 2 && active && (
                        <p className="text-xs text-green-500 mt-0.5">¡Entregado con éxito!</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => { setOrder(null); setSearchNum(''); setNotFound(false); }}
            className="w-full py-3 border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Buscar otra orden
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
