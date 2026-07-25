import { create } from 'zustand';

export type BookingState = {
  dropOffLocationGlobal: google.maps.LatLngLiteral | null;
  setDropOffLocationGlobal: (location: google.maps.LatLngLiteral | null) => void;
  pickupLocationGlobal: google.maps.LatLngLiteral | null;
  setPickupLocationGlobal: (location: google.maps.LatLngLiteral | null) => void;
  fare: number | null; // Add fare property
  distance: number;
  setFare: (fare: number | null) => void; // Add setFare method
  setDistance: (distance: number) => void;
  returnDistance: number;
  setReturnDistance: (distance: number) => void;
  returnEstCost: number | null;
  setReturnEstCost: (cost: number | null) => void;
};
export type GoogleMapsStore = {
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
};
export const useBookingStore = create<BookingState>((set) => ({
  dropOffLocationGlobal: null,
  setDropOffLocationGlobal: (location) => set({ dropOffLocationGlobal: location }),
  pickupLocationGlobal: null,
  setPickupLocationGlobal: (location) => set({ pickupLocationGlobal: location }),
  fare: null, // Initialize fare as null
  distance: 0,
  returnDistance: 0,
  returnEstCost: null,
  setReturnEstCost: (returnEstCost) => set({ returnEstCost }),
  setFare: (fare) => set({ fare }), // Implement setFare
  setDistance: (distance) => set({ distance }),
  setReturnDistance: (returnDistance) => set({ returnDistance }),
}));
export const useGoogleMapsStore = create<GoogleMapsStore>((set) => ({
  isLoaded: false,
  setIsLoaded: (isLoaded) => set({ isLoaded }),
}));
