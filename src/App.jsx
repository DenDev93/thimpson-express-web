import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import MissionVision from './components/MissionVision'
import Testimonials from './components/Testimonials'
import About from './components/About'
import Contact from './components/Contact'
import ContactForm from './components/ContactForm'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import Modal from './components/Modal'
import BackToTop from './components/BackToTop'
import SmartForm from './components/SmartForm'
import OrderTracking from './components/OrderTracking'
import emailjs from '@emailjs/browser'

const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

const pageTitle = {
  delivery: 'Solicitar Delivery Express',
  encomienda: 'Solicitar Encomienda',
  mandado: 'Solicitar Mandado',
};

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [pendingService, setPendingService] = useState(null);
  const [subscribeFirst, setSubscribeFirst] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState('idle');
  const [subMessage, setSubMessage] = useState('');
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [trackingMode, setTrackingMode] = useState(false);

  const handleRequestService = (serviceId) => {
    const subscribed = localStorage.getItem('thimpson_subscribed');
    if (subscribed) {
      setSelectedService(serviceId);
      setModalOpen(true);
    } else {
      setPendingService(serviceId);
      setSubscribeFirst(true);
      setModalOpen(true);
    }
  };

  const handleOpenTracking = () => {
    const subscribed = localStorage.getItem('thimpson_subscribed');
    if (subscribed) {
      setTrackingMode(true);
      setTrackingOpen(true);
      setModalOpen(true);
    } else {
      setPendingService(null);
      setSubscribeFirst(true);
      setModalOpen(true);
    }
  };

  const handleSubscribeFirst = async (e) => {
    e.preventDefault();
    if (!subEmail) return;
    setSubStatus('loading');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { email: subEmail, source: 'preservice_thimpson' },
        EMAILJS_PUBLIC_KEY
      );
    } catch {}
    localStorage.setItem('thimpson_subscribed', 'true');
    setSubStatus('success');
    setSubMessage('¡Gracias por suscribirte!');
    setTimeout(() => {
      if (pendingService) {
        setSubscribeFirst(false);
        setSelectedService(pendingService);
        setPendingService(null);
      } else {
        setSubscribeFirst(false);
        setTrackingMode(true);
        setTrackingOpen(true);
      }
      setSubEmail('');
      setSubStatus('idle');
      setSubMessage('');
    }, 1500);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSubscribeFirst(false);
    setPendingService(null);
    setSelectedService(null);
    setTrackingMode(false);
    setTrackingOpen(false);
    setSubEmail('');
    setSubStatus('idle');
    setSubMessage('');
  };

  const getModalTitle = () => {
    if (subscribeFirst) return 'Suscríbete para continuar';
    if (trackingMode) return 'Seguimiento de Pedido';
    return selectedService ? pageTitle[selectedService] : '';
  };

  const getModalContent = () => {
    if (subscribeFirst) {
      return (
        <div className="animate-slide-up text-center py-4">
          <div className="w-16 h-16 bg-thimpson-yellow/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📧</span>
          </div>
          <h3 className="text-xl font-bold text-thimpson-dark mb-2">Antes de continuar...</h3>
          <p className="text-gray-500 text-sm mb-6">
            Suscríbete a nuestro newsletter para recibir ofertas y novedades. ¡Es rápido y sin compromiso!
          </p>
          <form onSubmit={handleSubscribeFirst} className="max-w-sm mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                className="flex-1 px-4 py-3 border border-gray-300 text-sm focus:border-thimpson-yellow"
              />
              <button
                type="submit"
                disabled={subStatus === 'loading'}
                className="px-6 py-3 bg-thimpson-yellow text-thimpson-dark font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
              >
                {subStatus === 'loading' ? 'Enviando...' : 'Suscribirme'}
              </button>
            </div>
          </form>
          {subMessage && (
            <p className="text-green-600 text-sm mt-3">{subMessage}</p>
          )}
          <p className="text-gray-400 text-xs mt-4">
            Sin spam. Puedes darte de baja en cualquier momento.
          </p>
        </div>
      );
    }
    if (trackingMode) {
      return <OrderTracking onClose={handleClose} />;
    }
    return selectedService && (
      <SmartForm
        service={selectedService}
        onSubmit={() => setModalOpen(false)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onOpenTracking={handleOpenTracking} />
      <Hero />
      <Services onRequestService={handleRequestService} />
      <MissionVision />
      <Testimonials />
      <About />
      <Contact>
        <ContactForm />
      </Contact>
      <Newsletter />
      <Footer />
      <BackToTop />

      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title={getModalTitle()}
      >
        {getModalContent()}
      </Modal>
    </div>
  );
};

export default App;
