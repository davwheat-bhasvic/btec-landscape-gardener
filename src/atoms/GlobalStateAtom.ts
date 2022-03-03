import { atom } from 'recoil';

import type Service from '../models/Service';

interface IState {
  services: Service[];
}

const globalStateAtom = atom<IState>({
  key: 'globalServicesState',
  default: {
    services: [],
  },
  dangerouslyAllowMutability: true,
});

interface IPricingState {
  lawnmowing: number;
  gardening: number;
  paving: number;
  planting: number;
}

const pricingStateAtom = atom<IPricingState>({
  key: 'pricingState',
  default: {
    lawnmowing: 10,
    gardening: 15,
    paving: 18,
    planting: 16,
  },
  dangerouslyAllowMutability: true,
});

export { globalStateAtom, pricingStateAtom };
