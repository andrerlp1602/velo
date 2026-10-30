import { beforeEach, describe, expect, it } from 'vitest';
import {
  calculateInstallment,
  calculateTotalPrice,
  formatPrice,
  useConfiguratorStore,
  type CarConfiguration,
  type Order,
} from './configuratorStore';

const defaultConfiguration: CarConfiguration = {
  exteriorColor: 'glacier-blue',
  interiorColor: 'carbon-black',
  wheelType: 'aero',
  optionals: [],
};

const makeOrder = (email: string, id = `order-${email}`): Order => ({
  id,
  configuration: defaultConfiguration,
  totalPrice: 40000,
  customer: {
    name: 'Maria',
    surname: 'Silva',
    email,
    phone: '11999999999',
    cpf: '12345678900',
    store: 'Velo Paulista',
  },
  paymentMethod: 'avista',
  status: 'APROVADO',
  createdAt: '2026-01-01T00:00:00.000Z',
});

describe('funções puras', () => {
  describe('calculateTotalPrice', () => {
    it('retorna o preço base para a configuração padrão', () => {
      expect(calculateTotalPrice(defaultConfiguration)).toBe(40000);
    });

    it('soma o valor das rodas sport', () => {
      const config: CarConfiguration = { ...defaultConfiguration, wheelType: 'sport' };
      expect(calculateTotalPrice(config)).toBe(42000);
    });

    it('soma o valor de cada opcional selecionado', () => {
      const config: CarConfiguration = {
        ...defaultConfiguration,
        optionals: ['precision-park', 'flux-capacitor'],
      };
      expect(calculateTotalPrice(config)).toBe(40000 + 5500 + 5000);
    });
  });

  describe('calculateInstallment', () => {
    it('calcula a parcela em 12x com 2% de juros ao mês, arredondada em 2 casas', () => {
      // PMT = 40000 * 0.02 * 1.02^12 / (1.02^12 - 1) ≈ 3782.38
      expect(calculateInstallment(40000)).toBe(3782.38);
    });
  });

  describe('formatPrice', () => {
    it('formata o valor em reais (BRL)', () => {
      // O Intl usa espaço não separável entre "R$" e o valor, por isso o \s
      expect(formatPrice(40000)).toMatch(/^R\$\s40\.000,00$/);
    });
  });
});

describe('useConfiguratorStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useConfiguratorStore.setState({
      configuration: { ...defaultConfiguration, optionals: [] },
      viewMode: 'exterior',
      orders: [],
      currentUserEmail: null,
    });
  });

  it('setExteriorColor atualiza a cor e muda a visão para exterior', () => {
    useConfiguratorStore.setState({ viewMode: 'interior' });

    useConfiguratorStore.getState().setExteriorColor('midnight-black');

    const state = useConfiguratorStore.getState();
    expect(state.configuration.exteriorColor).toBe('midnight-black');
    expect(state.viewMode).toBe('exterior');
  });

  it('setInteriorColor atualiza a cor e muda a visão para interior', () => {
    useConfiguratorStore.getState().setInteriorColor('deep-blue');

    const state = useConfiguratorStore.getState();
    expect(state.configuration.interiorColor).toBe('deep-blue');
    expect(state.viewMode).toBe('interior');
  });

  it('toggleOptional adiciona e remove um opcional', () => {
    const { toggleOptional } = useConfiguratorStore.getState();

    toggleOptional('precision-park');
    expect(useConfiguratorStore.getState().configuration.optionals).toEqual(['precision-park']);

    toggleOptional('precision-park');
    expect(useConfiguratorStore.getState().configuration.optionals).toEqual([]);
  });

  it('resetConfiguration volta para a configuração padrão', () => {
    const { setExteriorColor, setWheelType, toggleOptional, resetConfiguration } =
      useConfiguratorStore.getState();
    setExteriorColor('lunar-white');
    setWheelType('sport');
    toggleOptional('flux-capacitor');

    resetConfiguration();

    expect(useConfiguratorStore.getState().configuration).toEqual(defaultConfiguration);
  });

  describe('login', () => {
    it('retorna true quando o e-mail possui pedidos', () => {
      const { addOrder, login } = useConfiguratorStore.getState();
      addOrder(makeOrder('maria@velo.com'));

      expect(login('maria@velo.com')).toBe(true);
      expect(useConfiguratorStore.getState().currentUserEmail).toBe('maria@velo.com');
    });

    it('retorna false quando o e-mail não possui pedidos', () => {
      expect(useConfiguratorStore.getState().login('sem-pedido@velo.com')).toBe(false);
      expect(useConfiguratorStore.getState().currentUserEmail).toBeNull();
    });
  });

  describe('getUserOrders', () => {
    it('retorna apenas os pedidos do usuário logado', () => {
      const { addOrder, login } = useConfiguratorStore.getState();
      addOrder(makeOrder('maria@velo.com', 'order-1'));
      addOrder(makeOrder('joao@velo.com', 'order-2'));
      login('maria@velo.com');

      const orders = useConfiguratorStore.getState().getUserOrders();

      expect(orders).toHaveLength(1);
      expect(orders[0].id).toBe('order-1');
    });

    it('retorna lista vazia após logout', () => {
      const { addOrder, login, logout } = useConfiguratorStore.getState();
      addOrder(makeOrder('maria@velo.com'));
      login('maria@velo.com');

      logout();

      expect(useConfiguratorStore.getState().getUserOrders()).toEqual([]);
    });
  });
});
