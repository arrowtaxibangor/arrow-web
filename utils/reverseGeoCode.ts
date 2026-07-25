/* eslint-disable @typescript-eslint/no-explicit-any */
export const reverseGeocode = (location: google.maps.LatLngLiteral): Promise<string> => {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location }, (results: any, status) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        const formattedAddress = results[0].formatted_address;

        // Remove Plus Code (J22X+5VQ, etc.) and extra commas at the start
        const filteredAddress = formattedAddress
          .replace(/([A-Z0-9]{4}\+{1}[A-Z0-9]{2,4})/g, '') // Improved regex to remove Plus Codes
          .replace(/^,|,$/g, '') // Remove leading or trailing commas
          .replace(/,\s+/g, ', ') // Ensure single space after each comma
          .trim(); // Remove any extra whitespace from the ends
        resolve(filteredAddress);
      } else {
        reject('Failed to get address');
      }
    });
  });
};

export const getPlaceName = (placeId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    service.getDetails({ placeId }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place?.formatted_address) {
        const cleaned = place.formatted_address
          .replace(/^[A-Z0-9]{4,}\+[A-Z0-9]{2,}\s*/g, '') // remove leading plus code
          .trim();
        resolve(cleaned); // e.g. "Cineworld Llandudno Junction"
      } else {
        reject('Failed to get place name');
      }
    });
  });
};

export const formatPhoneNumber = (phone: string) => {
  if (!phone) return '';

  const trimmed = phone?.trim()?.replace(/[\s-]/g, '');

  const isUkLocal = /^07\d{9}$/?.test(trimmed);

  if (isUkLocal) {
    return '+44' + trimmed?.slice(1);
  }

  return trimmed;
};
