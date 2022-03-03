import type Good from './Good';

export default interface Service {
  durationMins: number;
  serviceName: string;
  notes: string;
  goods: Good[];
}
