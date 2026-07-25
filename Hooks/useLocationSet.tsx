import { useCallback, useRef, useState } from 'react';
import { makeStop } from '../utils/bookingLocations';
import { LocationStop } from '../types/location';
import { reverseGeocode } from '../utils/reverseGeoCode';
import { message } from 'antd';

const defaultCenter = {
  lat: 53.2297,
  lng: -4.1274,
};

export default function useLocationSet(initialCount = 2) {
  const [locations, setLocations] = useState<LocationStop[]>(
    Array.from({ length: initialCount }, makeStop)
  );
  const [activeMapIndex, setActiveMapIndex] = useState(0);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [loadingDirections, setLoadingDirections] = useState(false);
  const autocompleteRefs = useRef<any[]>([]);
  const dragIndexRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    setLocations([makeStop(), makeStop()]);
    setDirections(null);
    autocompleteRefs.current = [];
  }, []);

  const updateLocation = useCallback((index: number, patch: Partial<LocationStop>) => {
    setLocations((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }, []);

  const addStop = useCallback(() => {
    const newStopIndex = locations.length - 1;
    setLocations((prev) => {
      const next = [...prev];
      next.splice(next.length - 1, 0, makeStop());
      return next;
    });
    autocompleteRefs.current.splice(autocompleteRefs.current.length - 1, 0, null);
    setActiveMapIndex(newStopIndex);
  }, [locations.length]);

  const removeStop = useCallback(
    (index: number) => {
      if (locations.length <= 2) return;
      setLocations((prev) => prev.filter((_, i) => i !== index));
      autocompleteRefs.current.splice(index, 1);
    },
    [locations.length]
  );

  const handleDragStart = useCallback((index: number) => {
    dragIndexRef.current = index;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === index) return;
    setLocations((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(index, 0, item);
      return next;
    });
    dragIndexRef.current = index;
  }, []);

  const handleDragEnd = useCallback(() => {
    dragIndexRef.current = null;
  }, []);

  const onPlaceChanged = useCallback(
    async (index: number) => {
      const place = autocompleteRefs.current[index]?.getPlace();
      if (!place?.geometry) {
        alert('Please select a valid location.');
        return;
      }
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const placeName = place.name || '';
      const formatted = place.formatted_address || (await reverseGeocode({ lat, lng }));
      const address =
        placeName && formatted.toLowerCase().includes(placeName.toLowerCase())
          ? formatted
          : `${placeName}, ${formatted}`;
      updateLocation(index, { lat, lng, address });
    },
    [updateLocation]
  );

  const handleMapClick = useCallback(
    async (event: google.maps.MapMouseEvent) => {
      if (!event?.latLng) return;
      const newLoc = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      try {
        const address = await reverseGeocode(newLoc);
        updateLocation(activeMapIndex, { ...newLoc, address });
      } catch {
        message.error('Failed to fetch location details');
      }
    },
    [activeMapIndex, updateLocation]
  );

  const getCenter = useCallback(() => {
    const valid = locations.filter((l) => l.lat !== null);
    if (valid.length === 0) return defaultCenter;
    if (valid.length === 1) return { lat: valid[0].lat!, lng: valid[0].lng! };
    return {
      lat: valid.reduce((s, l) => s + l.lat!, 0) / valid.length,
      lng: valid.reduce((s, l) => s + l.lng!, 0) / valid.length,
    };
  }, [locations]);

  const pickupLocation =
    locations[0].lat !== null ? { lat: locations[0].lat, lng: locations[0].lng! } : null;

  const dropOffLocation =
    locations[locations.length - 1].lat !== null
      ? { lat: locations[locations.length - 1].lat!, lng: locations[locations.length - 1].lng! }
      : null;

  const toBookingStops = useCallback(
    () =>
      locations
        .filter((l) => l.lat !== null)
        .map((l, i) => ({ order: i, lat: l.lat!, long: l.lng!, address: l.address })),
    [locations]
  );

  const resetToPickupDropoff = () => {
    setLocations((prev) => {
      const valid = prev.filter((loc) => loc.lat !== null);

      // If less than 2 valid points, just keep first 2 anyway
      if (prev.length <= 2) return prev;

      return [
        { ...prev[0] }, // Pickup
        { ...prev[prev.length - 1] }, // Dropoff
      ];
    });

    // Optional: clear directions so they recalc cleanly
    setDirections(null);
  };

  return {
    locations,
    setLocations,
    activeMapIndex,
    setActiveMapIndex,
    directions,
    setDirections,
    loadingDirections,
    setLoadingDirections,
    autocompleteRefs,
    reset,
    updateLocation,
    addStop,
    removeStop,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    onPlaceChanged,
    handleMapClick,
    getCenter,
    pickupLocation,
    dropOffLocation,
    toBookingStops,
    resetToPickupDropoff,
  };
}
