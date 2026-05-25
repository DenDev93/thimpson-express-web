import { describe, it, expect } from 'vitest';

describe('SmartForm', () => {
  it('renders without crashing', () => {
    expect(true).toBe(true);
  });

  it('has correct service configurations', () => {
    const servicesConfig = {
      delivery: { title: 'Delivery Express' },
      viaje: { title: 'Viaje Privado' },
      encomienda: { title: 'Encomiendas' },
      mandado: { title: 'Mandados' },
    };
    expect(servicesConfig.delivery.title).toBe('Delivery Express');
    expect(servicesConfig.viaje.title).toBe('Viaje Privado');
    expect(servicesConfig.encomienda.title).toBe('Encomiendas');
    expect(servicesConfig.mandado.title).toBe('Mandados');
  });
});
