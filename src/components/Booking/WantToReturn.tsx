/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Row, Col, message, Spin, DatePicker, InputNumber } from 'antd';
import {
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  useJsApiLoader,
} from '@react-google-maps/api';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import { BookingState, useBookingStore, useGoogleMapsStore } from '../../../store/useStore';
import ASAPTimePicker from './ASAPTimePicker';
import { reverseGeocode } from '../../../utils/reverseGeoCode';
import { useMultipleVehiclesFare } from '../../../utils/useCalculateMultiVehicleFare';
import { VehicleSelectionCards } from './VehicleSelectionCards';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '2px',
  marginBottom: '16px',
};
const defaultCenter = {
  lat: 53.2297, // Latitude for Bangor, Gwynedd
  lng: -4.1274, // Longitude for Bangor, Gwynedd
};

export default function WantToReturnForm({
  form,
  setReturnDropOffLocation,
  setReturnPickupLocation,
  returnPickupLocation,
  returnDropOffLocation,
  setSearchPickupLocation,
  searchPickupLocation,
  setSearchDopOffLocation,
  searchDopOffLocation,
  setReturnIsAsap,
  initialIsAsap,
  returnPassengers,
  setReturnPassengers,
  selectedReturnVehicles,
  setSelectedReturnVehicles,
  selectedReturnVehicleTypes,
  setSelectedReturnVehicleTypes,
}: {
  form: any;
  setReturnDropOffLocation: any;
  setReturnPickupLocation: any;
  returnPickupLocation: any;
  returnDropOffLocation: any;
  setSearchDopOffLocation: any;
  searchDopOffLocation: any;
  setSearchPickupLocation: any;
  searchPickupLocation: any;
  setReturnIsAsap: any;
  initialIsAsap: boolean;
  returnPassengers: number;
  setReturnPassengers: React.Dispatch<React.SetStateAction<number>>;
  selectedReturnVehicles: any[];
  setSelectedReturnVehicles: React.Dispatch<React.SetStateAction<any[]>>;
  selectedReturnVehicleTypes: any[];
  setSelectedReturnVehicleTypes: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [loadingDirections, setLoadingDirections] = useState<boolean>(false);
  const [bookingTime, setBookingTime] = useState<any>(dayjs());
  const pickupAutocompleteRef = useRef<any>(null);
  const dropOffAutocompleteRef = useRef<any>(null);
  const returnDistance = useBookingStore((state: BookingState) => state?.returnDistance);
  const setReturnDistance = useBookingStore((state: BookingState) => state?.setReturnDistance);
  const setReturnEstCost = useBookingStore((state: BookingState) => state?.setReturnEstCost);
  const [selectionMode, setSelectionMode] = useState<'pickup' | 'dropoff'>('pickup');
  const { setIsLoaded } = useGoogleMapsStore();
  const allValues: any = Form.useWatch([], form);
  const bookingDate = allValues?.returnDate;
  const { totalFare: fare } = useMultipleVehiclesFare({
    vehicles: selectedReturnVehicleTypes || [],
    bookingTime: bookingTime,
    isReturn: true,
    bookingDate,
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY || '',
    libraries: ['places', 'geometry'],
  });

  useEffect(() => {
    if (isLoaded) {
      setIsLoaded(true);
    }
  }, [isLoaded, setIsLoaded]);
  useEffect(() => {
    if (initialIsAsap !== undefined) {
      setReturnIsAsap(initialIsAsap);
    }
  }, [initialIsAsap, setReturnIsAsap]);
  useEffect(() => {
    // Get the current date and time from the main form
    const mainFormDate = form.getFieldValue('date');
    const mainFormTime = form.getFieldValue('time');

    // Set initial values if they exist
    if (mainFormDate) {
      form.setFieldValue('returnDate', mainFormDate);
    }
    if (mainFormTime) {
      form.setFieldValue('returnTime', mainFormTime);
      setBookingTime(mainFormTime);
    }
  }, [form]);
  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event?.latLng) {
      const newLocation = { lat: event.latLng.lat(), lng: event.latLng.lng() };

      try {
        const address = await reverseGeocode(newLocation); // Fetch the address of the clicked location

        if (selectionMode === 'pickup') {
          setReturnPickupLocation(newLocation);
          setSearchPickupLocation(address); // Update the input field for pickup
          form.setFieldValue('returnSearchPickupLocation', address);
        } else {
          setReturnDropOffLocation(newLocation);
          setSearchDopOffLocation(address); // Update the input field for dropoff
          form.setFieldValue('returnSearchDropOffLocation', address);
        }
      } catch (err: any) {
        message.error('Failed to fetch location details. Please try again.', err);
      }
    }
  };

  const getCenter = () => {
    if (returnPickupLocation && returnDropOffLocation) {
      // If both pickup and dropoff are set, center between them
      return {
        lat: (returnPickupLocation.lat + returnDropOffLocation.lat) / 2,
        lng: (returnPickupLocation.lng + returnDropOffLocation.lng) / 2,
      };
    }

    // If only pickup or dropoff is set, use that as the center
    if (returnPickupLocation) {
      return returnPickupLocation;
    }
    if (returnDropOffLocation) {
      return returnDropOffLocation;
    }

    // Default to San Francisco if neither is set
    return defaultCenter;
  };

  const onPlaceChangedPickup = () => {
    const place = pickupAutocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setSearchPickupLocation(place?.formatted_address || '');
      form.setFieldValue('returnSearchPickupLocation', place?.formatted_address);
      setReturnPickupLocation(newLocation);
    } else {
      alert('Please select a valid location.');
    }
  };

  const onPlaceChangedDropOff = () => {
    const place = dropOffAutocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setSearchDopOffLocation(place?.formatted_address || '');
      form.setFieldValue('returnSearchDropOffLocation', place?.formatted_address);
      setReturnDropOffLocation(newLocation);
    } else {
      alert('Please select a valid location.');
    }
  };

  useEffect(() => {
    if (returnPickupLocation && returnDropOffLocation) {
      setLoadingDirections(true);

      const directionsService = new google.maps.DirectionsService();
      const request = {
        origin: returnPickupLocation,
        destination: returnDropOffLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      };
      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
          const route = result?.routes[0];
          let totalDistance: any = 0;
          route?.legs?.forEach((leg) => {
            totalDistance += leg?.distance?.value; // Distance in meters
          });

          // Convert the total distance to miles
          const totalDistanceInMiles: any = (totalDistance / 1609.34).toFixed(2);
          setReturnDistance(totalDistanceInMiles);
          // Convert the total distance to miles
        } else {
          message.error('Directions request failed due to');
        }
        setLoadingDirections(false);
      });
    }
  }, [returnPickupLocation, returnDropOffLocation, bookingTime]);
  useEffect(() => {
    form.setFieldsValue({ returnEstimatedCost: fare });
    setReturnEstCost(fare);
  }, [fare, form]);

  const ukBounds = {
    north: 60.8566, // Approximate northern boundary of the UK
    south: 49.9599, // Approximate southern boundary of the UK
    west: -8.6494, // Approximate western boundary of the UK
    east: 1.7638, // Approximate eastern boundary of the UK
  };
  const handlePickupChange = (e: any) => {
    setSearchPickupLocation(e?.target?.value);
    form.setFieldValue('returnSearchPickupLocation', e?.target?.value);
    setSelectionMode('pickup');
  };

  const handleDropoffChange = (e: any) => {
    setSearchDopOffLocation(e?.target?.value);
    form.setFieldValue('returnSearchDropOffLocation', e?.target?.value);
    setSelectionMode('dropoff');
  };

  return (
    <div>
      {/* Pickup and dropoff location */}
      {isLoaded && (
        <>
          <Form.Item
            label="Pickup Location"
            className="!mb-[10px]"
            name="returnSearchPickupLocation"
            rules={[
              {
                required: !returnPickupLocation,
                message: 'Please provide pickup location',
              },
            ]}
          >
            <Autocomplete
              onLoad={(autocomplete) => (pickupAutocompleteRef.current = autocomplete)}
              onPlaceChanged={onPlaceChangedPickup}
              options={{
                componentRestrictions: { country: 'uk' },
              }}
            >
              <Input
                value={searchPickupLocation}
                onChange={handlePickupChange}
                onFocus={() => setSelectionMode('pickup')}
                placeholder="Choose your Pickup Location"
                allowClear
                className="!bg-[#fff]  !text-[#000] rounded-[2px]"
              />
            </Autocomplete>
          </Form.Item>

          <Form.Item
            label="Drop-off Location"
            name="returnSearchDropOffLocation"
            className="!mb-[10px]"
            rules={[
              {
                required: !returnDropOffLocation,
                message: 'Please provide drop-off location',
              },
            ]}
          >
            <Autocomplete
              onLoad={(autocomplete) => (dropOffAutocompleteRef.current = autocomplete)}
              onPlaceChanged={onPlaceChangedDropOff}
              options={{
                componentRestrictions: { country: 'uk' },
              }}
            >
              <Input
                value={searchDopOffLocation}
                onChange={handleDropoffChange}
                onFocus={() => setSelectionMode('dropoff')}
                placeholder="Choose your Drop-off Location"
                allowClear
                className="!bg-[#fff]  !text-[#000] rounded-[2px]"
              />
            </Autocomplete>
          </Form.Item>
        </>
      )}

      {/* Map & Fare */}
      {isLoaded ? (
        <div className="mb-4">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={getCenter()}
            zoom={12}
            onClick={handleMapClick}
            options={{
              restriction: {
                latLngBounds: ukBounds,
                strictBounds: true,
              },
            }}
          >
            {returnPickupLocation && <Marker position={returnPickupLocation} label="P" />}
            {returnDropOffLocation && <Marker position={returnDropOffLocation} label="D" />}
            {directions && !loadingDirections && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true, // Suppress default "A" and "B" markers
                }}
              />
            )}
          </GoogleMap>
        </div>
      ) : (
        <Spin className="w-full h-[300px] flex justify-center items-center" />
      )}

      {/* Date & Time */}
      <Row gutter={10}>
        <Col span={12}>
          <Form.Item
            label="Date"
            name="returnDate"
            className="!mb-[10px]"
            rules={[{ required: true, message: 'Please enter date' }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              className="w-full rounded-[2px]"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Time"
            name="returnTime"
            className="!mb-[10px]"
            rules={[{ required: true, message: 'Please choose time' }]}
          >
            <ASAPTimePicker
              value={bookingTime}
              onChange={(time) => {
                setBookingTime(time);
                setReturnIsAsap(false);
              }}
              onASAPClick={() => {
                const now = dayjs();
                form.setFieldsValue({ returnDate: now });
                setReturnIsAsap(true);
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Passengers */}
      <Form.Item
        label="Number of Passengers"
        name="returnNoOfPassengers"
        rules={[
          {
            required: true,
            message: 'Please select number of passengers',
          },
        ]}
        className="!mb-[10px]"
      >
        <InputNumber
          min={1}
          placeholder="Your Passengers"
          className="!rounded-[2px] !w-full"
          onChange={(e) => setReturnPassengers(Number(e))}
          // onChange={(e: any) => suggestedVehicles(e)}
        />
      </Form.Item>

      {allValues?.noOfPassengers > 0 && (
        <VehicleSelectionCards
          isReturn={true}
          bookingTime={bookingTime}
          noOfPassengers={returnPassengers}
          selectedVehicles={selectedReturnVehicles}
          onVehiclesChange={setSelectedReturnVehicles}
          selectedVehicleTypes={selectedReturnVehicleTypes}
          setSelectedVehicleTypes={setSelectedReturnVehicleTypes}
          form={form}
        />
      )}

      {fare && returnDistance && (
        <div className="w-full flex flex-col justify-center items-center costDistanceDiv text-white">
          <span className="font-normal text-3xl">
            Fare:
            <strong className="font-semibold"> £{fare?.toFixed(2)}</strong>
          </span>
          {/* <span className="font-normal text-3xl">
            Distance: <strong className="font-semibold text-3xl">{returnDistance} miles</strong>
          </span> */}
        </div>
      )}

      {/* Details */}
      <Form.Item label="Additional Information" name="returnInstructions" className="!mb-[10px]">
        <TextArea rows={3} placeholder="Write your text here..." className="rounded-[2px]" />
      </Form.Item>

      {/* This is used purely to set static values in the corresponding Form.Item fields. */}
      {/* <Form.Item name="returnSearchDropOffLocation" className="!hidden" /> */}
      {/* <Form.Item name="returnSearchPickupLocation" className="!hidden" /> */}
      <Form.Item name="returnEstimatedCost" className="!hidden" />
    </div>
  );
}
