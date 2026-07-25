import { LocationStop } from '../types/location';

export function labelForIndex(index: number, total: number) {
  if (index === 0) return 'P';
  if (index === total - 1) return 'D';
  return `S${index}`;
}
export const makeStop = (): LocationStop => ({
  id: crypto.randomUUID(),
  lat: null,
  lng: null,
  address: '',
});
