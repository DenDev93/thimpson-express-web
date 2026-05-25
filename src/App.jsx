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

const pageTitle = {
  delivery: 'Solicitar Delivery Express',
  viaje: 'Solicitar Viaje Privado',
  encomienda: 'Solicitar Encomienda',
  mandado: 'Solicitar Mandado',
};

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleRequestService = (serviceId) => {
    setSelectedService(serviceId);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
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
        onClose={() => setModalOpen(false)}
        title={selectedService ? pageTitle[selectedService] : ''}
      >
        {selectedService && (
          <SmartForm
            service={selectedService}
            onSubmit={() => setModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default App;
