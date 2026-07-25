/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  message,
  Spin,
  DatePicker,
  Radio,
  Checkbox,
  RadioChangeEvent,
  InputNumber,
  Alert,
} from 'antd';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { createBooking } from '../../../services/booking';
import { useMutation } from 'react-query';
import { formatPhoneNumber } from '../../../utils/reverseGeoCode';
import { useRouter } from 'next/navigation';
import { BookingState, useBookingStore, useGoogleMapsStore } from '../../../store/useStore';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import ASAPTimePicker from './ASAPTimePicker';
import { CheckboxChangeEvent, CheckboxProps } from 'antd/es/checkbox';
import moment from 'moment-timezone';
import { useMultipleVehiclesFare } from '../../../utils/useCalculateMultiVehicleFare';
import { VehicleSelectionCards } from './VehicleSelectionCards';
import { getSetting } from '../../../services/settings.service';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import useLocationSet from '../../../Hooks/useLocationSet';
import LocationList from '../CreateBooking/LocationList';
import { labelForIndex } from '../../../utils/bookingLocations';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '2px',
  marginBottom: '16px',
};

const ukBounds = {
  north: 60.8566,
  south: 49.9599,
  west: -8.6494,
  east: 1.7638,
};

type PayOption = {
  label: string;
  value: string;
};

export default function BookingForm() {
  // Location sets
  const outbound = useLocationSet(2);
  const ret = useLocationSet(2);

  const [passengers, setPassengers] = useState<number>(0);
  const [selectedVehicles, setSelectedVehicles] = useState<any>([]);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<any>([]);
  const [returnPassengers, setReturnPassengers] = useState<number>(0);
  const [selectedReturnVehicles, setSelectedReturnVehicles] = useState<any>([]);
  const [selectedReturnVehicleTypes, setSelectedReturnVehicleTypes] = useState<any>([]);

  const [bookingTime, setBookingTime] = useState<any>(dayjs());
  const [phoneValue, setPhoneValue] = useState<any>();
  const [wantToReturn, setWantToReturn] = useState<boolean>(false);
  const [addStops, setAddStops] = useState(false);
  const [returnAddStops, setReturnAddStops] = useState(false);
  const [pay, setPay] = useState<string>('pay_in_vehicle');
  const [isAsap, setIsAsap] = useState<boolean>(true);
  const [returnIsAsap, setReturnIsAsap] = useState<boolean>(true);
  const [legDistances, setLegDistances] = useState<string[]>([]);
  const [returnLegDistances, setReturnLegDistances] = useState<string[]>([]);

  // Return form states (kept for WantToReturnForm compatibility)
  const [returnPickupLocation, setReturnPickupLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [returnDropOffLocation, setReturnDropOffLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [searchReturnPickupLocation, setSearchReturnPickupLocation] = useState<string>('');
  const [searchReturnDopOffLocation, setSearchReturnDopOffLocation] = useState<string>('');

  const [form] = Form.useForm();

  const { setDistance } = useBookingStore((state: BookingState) => state);
  const setReturnDistance = useBookingStore((state: BookingState) => state?.setReturnDistance);
  const returnEstCost = useBookingStore((state: BookingState) => state?.returnEstCost);
  const returnDistance = useBookingStore((state: BookingState) => state?.returnDistance);
  const distance = useBookingStore((state: BookingState) => state?.distance);

  const { setIsLoaded } = useGoogleMapsStore();
  const router = useRouter();
  const allValues = Form.useWatch([], form);
  const bookingDate = allValues?.date;

  const { totalFare: outboundTotalFare, reasons } = useMultipleVehiclesFare({
    vehicles: selectedVehicleTypes || [],
    bookingTime,
    isReturn: false,
    bookingDate,
  });

  const { totalFare: returnTotalFare, reasons: returnReasons } = useMultipleVehiclesFare({
    vehicles: selectedReturnVehicleTypes || [],
    bookingTime,
    isReturn: true,
    bookingDate: allValues?.returnDate,
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY || '',
    libraries: ['places', 'geometry'],
  });

  useEffect(() => {
    if (isLoaded) setIsLoaded(true);
  }, [isLoaded, setIsLoaded]);

  useEffect(() => {
    form.setFieldsValue({
      locations: outbound.locations,
    });
  }, [outbound.locations]);

  useEffect(() => {
    form.setFieldsValue({
      returnLocations: ret.locations,
    });
  }, [ret.locations]);

  // ── Directions effect (outbound) ─────────────────────────────────────────

  useEffect(() => {
    const validLocs = outbound.locations.filter((l) => l.lat !== null);
    if (validLocs.length < 2) return;
    outbound.setLoadingDirections(true);
    const svc = new google.maps.DirectionsService();
    svc.route(
      {
        origin: { lat: validLocs[0].lat!, lng: validLocs[0].lng! },
        destination: {
          lat: validLocs[validLocs.length - 1].lat!,
          lng: validLocs[validLocs.length - 1].lng!,
        },
        waypoints: validLocs
          .slice(1, -1)
          .map((l) => ({ location: { lat: l.lat!, lng: l.lng! }, stopover: true })),
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          outbound.setDirections(result);
          let total = 0;
          const legs = result.routes[0].legs;

          const distances: string[] = [];

          legs.forEach((leg) => {
            total += leg.distance?.value || 0;
            const meters = leg.distance?.value || 0;
            const miles = (meters / 1609.34).toFixed(2);

            distances.push(`${miles} miles`);
          });
          setLegDistances(distances);
          setDistance(Number((total / 1609.34).toFixed(2)));
        } else {
          message.error('Outbound directions request failed');
        }
        outbound.setLoadingDirections(false);
      }
    );
  }, [outbound.locations]);

  // ── Directions effect (return) ───────────────────────────────────────────

  useEffect(() => {
    if (!wantToReturn) return;
    const validLocs = ret.locations.filter((l) => l.lat !== null);
    if (validLocs.length < 2) return;
    ret.setLoadingDirections(true);
    const svc = new google.maps.DirectionsService();
    svc.route(
      {
        origin: { lat: validLocs[0].lat!, lng: validLocs[0].lng! },
        destination: {
          lat: validLocs[validLocs.length - 1].lat!,
          lng: validLocs[validLocs.length - 1].lng!,
        },
        waypoints: validLocs
          .slice(1, -1)
          .map((l) => ({ location: { lat: l.lat!, lng: l.lng! }, stopover: true })),
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          ret.setDirections(result);
          let total = 0;
          const legs = result.routes[0].legs;

          const distances: string[] = [];

          legs.forEach((leg) => {
            total += leg.distance?.value || 0;
            const meters = leg.distance?.value || 0;
            const miles = (meters / 1609.34).toFixed(2);

            distances.push(`${miles} miles`);
          });
          setReturnLegDistances(distances);
          setReturnDistance(Number((total / 1609.34).toFixed(2)));
        } else {
          message.error('Return directions request failed');
        }
        ret.setLoadingDirections(false);
      }
    );
  }, [ret.locations, wantToReturn]);

  // ── Settings ─────────────────────────────────────────────────────────────

  const [bookingsEnabled, setBookingsEnabled] = useState<boolean>(true);
  const [disabledMessage, setDisabledMessage] = useState<string>('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSetting();
        setBookingsEnabled(res?.booking_enabled);
        setDisabledMessage(res?.booking_message || 'Bookings are disabled temporarily.');
      } catch (err) {
        console.error('Failed to fetch settings', err);
      }
    };
    fetchSettings();
  }, []);

  const onAddStops = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    setAddStops(checked);

    if (!checked) {
      outbound.resetToPickupDropoff();
      setLegDistances([]);
    } else {
      setPay('pay_in_vehicle');

      //update UI
      form.setFieldsValue({
        paymentMethod: 'pay_in_vehicle',
      });
    }
  };

  const onReturnAddStops = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    setReturnAddStops(checked);

    if (!checked) {
      ret.resetToPickupDropoff();
      setReturnLegDistances([]);
    } else {
      setPay('pay_in_vehicle');

      //update UI
      form.setFieldsValue({
        paymentMethod: 'pay_in_vehicle',
      });
    }
  };

  // ── Return checkbox ──────────────────────────────────────────────────────

  const onChange: CheckboxProps['onChange'] = (e) => {
    const checked = e.target.checked;
    setWantToReturn(checked);
    setReturnDistance(distance);

    if (checked && outbound.pickupLocation && outbound.dropOffLocation) {
      // Pre-fill return journey as the reverse of outbound
      const reversed = [...outbound.locations]
        .reverse()
        .map((l) => ({ ...l, id: crypto.randomUUID() }));
      ret.setLocations(reversed);

      const currentDate = form.getFieldValue('date');
      const currentTime = form.getFieldValue('time');
      form.setFieldsValue({
        returnDate: currentDate || dayjs(),
        returnTime: currentTime || dayjs(),
      });
      setReturnIsAsap(isAsap);

      const hasOutboundStops =
        addStops && outbound.locations.filter((l) => l.lat !== null).length > 2;

      if (hasOutboundStops) {
        setReturnAddStops(true);
      }
    }
  };

  // ── Submit ───────────────────────────────────────────────────────────────

  const { mutate, isLoading } = useMutation(createBooking, {
    onSuccess: (res: any) => {
      if (res?.url) {
        form.resetFields();
        outbound.reset();
        ret.reset();
        router.push(res?.url);
      } else {
        message.success(res?.message);
        form.resetFields();
        outbound.reset();
        ret.reset();
        router.push(
          `/bookings/success?bookingId=${res?.bookingId}${
            res?.returnBookingId ? `&returnBookingId=${res.returnBookingId}` : ''
          }`
        );
      }
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message);
    },
  });

  const onFinish = async (values: any) => {
    await form.validateFields();
    const validOutbound = outbound.locations.filter((l) => l.lat !== null);
    if (validOutbound.length < 2) {
      message.error('Please add at least a pickup and a drop-off location.');
      return;
    }
    if (wantToReturn) {
      const validReturn = ret.locations.filter((l) => l.lat !== null);
      if (validReturn.length < 2) {
        message.error(
          'Please add at least a pickup and a drop-off location for the return journey.'
        );
        return;
      }
    }

    const now = moment();
    const {
      fullName,
      email,
      phone,
      noOfPassengers,
      instructions,
      returnNoOfPassengers,
      returnInstructions,
      date,
      returnDate,
      returnTime,
    } = values;

    try {
      const formattedPhone = formatPhoneNumber(phone);
      const stops = outbound.toBookingStops().map(({ order, ...rest }) => rest);

      const base: any = {
        bookingType: 'PREBOOKED',
        name: `${fullName}`,
        email,
        phone: formattedPhone,
        noOfPassengers,
        instructions,
        ...(selectedVehicles?.length > 0 && { vehicleTypes: selectedVehicles }),
        stops,
        distance: String(distance),
        estimatedCost: `${outboundTotalFare}`,
        isReturnBooking: wantToReturn,
        isPaymentOnline: pay === 'pay_online',
        isAsap,
        date:
          date &&
          moment
            .tz(
              moment(date?.toDate()).format('YYYY-MM-DD HH:mm:ss'),
              'YYYY-MM-DD HH:mm:ss',
              'Europe/London'
            )
            .format(),
        time: isAsap
          ? moment
              .tz(moment(now).format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss', 'Europe/London')
              .format()
          : moment
              .tz(
                moment(bookingTime?.toDate()).format('YYYY-MM-DD HH:mm:ss'),
                'YYYY-MM-DD HH:mm:ss',
                'Europe/London'
              )
              .format(),
      };

      if (wantToReturn) {
        const returnStops = ret.toBookingStops().map(({ order, ...rest }) => rest);
        Object.assign(base, {
          returnNoOfPassengers,
          returnVehicleTypes: selectedReturnVehicles,
          retrunInstructions: returnInstructions,
          returnStops,
          returnDistance: String(returnDistance),
          returnEstimatedCost: `${returnTotalFare}`,
          returnDate:
            returnDate &&
            moment
              .tz(
                moment(returnDate?.toDate()).format('YYYY-MM-DD HH:mm:ss'),
                'YYYY-MM-DD HH:mm:ss',
                'Europe/London'
              )
              .format(),
          returnTime: returnIsAsap
            ? moment
                .tz(
                  moment(now).format('YYYY-MM-DD HH:mm:ss'),
                  'YYYY-MM-DD HH:mm:ss',
                  'Europe/London'
                )
                .format()
            : moment
                .tz(
                  moment(returnTime?.toDate()).format('YYYY-MM-DD HH:mm:ss'),
                  'YYYY-MM-DD HH:mm:ss',
                  'Europe/London'
                )
                .format(),
        });
      }

      mutate(base);
    } catch (err: any) {
      message.error('Failed to submit booking. Please try again.');
    }
  };

  // ── Fare summary ─────────────────────────────────────────────────────────

  const parsedFare = Number((outboundTotalFare ?? 0).toFixed(2));
  const parsedReturnFare = Number((returnTotalFare ?? 0).toFixed(2));

  const totalPayment = parsedFare + (wantToReturn ? parsedReturnFare : 0);

  const options: PayOption[] = [
    { label: 'Pay Online', value: 'pay_online' },
    { label: 'Pay in Vehicle', value: 'pay_in_vehicle' },
  ];

  const filteredOptions =
    addStops || returnAddStops ? options.filter((opt) => opt.value !== 'pay_online') : options;

  const onRadioChange = (e: RadioChangeEvent) => {
    setPay(e.target.value);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col text-white items-center h-full w-full">
      <div className="bg-[#265EA6] sm:p-6 p-3 w-full max-w-[500px]">
        <h3 className="text-center text-[30px] font-[600] mb-6">Book A Ride</h3>

        {!bookingsEnabled && (
          <div className="mb-4">
            <Alert
              message="Booking Unavailable"
              description={
                disabledMessage || 'Bookings are currently disabled. Please try again later.'
              }
              type="warning"
              showIcon
              className="rounded-md"
            />
          </div>
        )}

        <Spin spinning={isLoading} className="w-full h-full">
          <Form
            layout="vertical"
            onFinish={onFinish}
            form={form}
            disabled={!bookingsEnabled || isLoading}
            className="bookingForm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
          >
            {/* ════════════ OUTBOUND ROUTE (multi-stop) ════════════ */}
            {isLoaded && (
              <LocationList
                locations={outbound.locations}
                activeMapIndex={outbound.activeMapIndex}
                setActiveMapIndex={outbound.setActiveMapIndex}
                updateLocation={outbound.updateLocation}
                addStop={outbound.addStop}
                removeStop={outbound.removeStop}
                handleDragStart={outbound.handleDragStart}
                handleDragOver={outbound.handleDragOver}
                handleDragEnd={outbound.handleDragEnd}
                autocompleteRefs={outbound.autocompleteRefs}
                onPlaceChanged={outbound.onPlaceChanged}
                legDistances={legDistances}
                showAddStop={false}
                fieldName="locations"
              />
            )}

            {/* Outbound Map */}
            {isLoaded ? (
              <div className="mb-4">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={outbound.getCenter()}
                  zoom={12}
                  onClick={outbound.handleMapClick}
                  options={{
                    restriction: { latLngBounds: ukBounds, strictBounds: true },
                  }}
                >
                  {outbound.locations.map((loc, i) =>
                    loc.lat !== null ? (
                      <Marker
                        key={loc.id}
                        position={{ lat: loc.lat, lng: loc.lng! }}
                        label={labelForIndex(i, outbound.locations.length)}
                      />
                    ) : null
                  )}
                  {outbound.directions && !outbound.loadingDirections && (
                    <DirectionsRenderer
                      directions={outbound.directions}
                      options={{ suppressMarkers: true }}
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
                  name="date"
                  className="!mb-[10px]"
                  initialValue={dayjs()}
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
                  name="time"
                  initialValue={dayjs()}
                  className="!mb-[10px]"
                  rules={[{ required: true, message: 'Please choose time' }]}
                >
                  <ASAPTimePicker
                    value={bookingTime}
                    onChange={(time) => {
                      setBookingTime(time);
                      setIsAsap(false);
                    }}
                    onASAPClick={() => {
                      form.setFieldsValue({ date: dayjs() });
                      setIsAsap(true);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Passengers */}
            <Form.Item
              label="Number of Passengers"
              name="noOfPassengers"
              rules={[{ required: true, message: 'Please select number of passengers' }]}
              className="!mb-[10px]"
            >
              <InputNumber
                min={1}
                placeholder="Your Passengers"
                className="!rounded-[2px] !w-full"
                onChange={(e) => setPassengers(Number(e))}
              />
            </Form.Item>

            {allValues?.noOfPassengers > 0 && (
              <VehicleSelectionCards
                isReturn={false}
                bookingTime={bookingTime}
                noOfPassengers={passengers}
                selectedVehicles={selectedVehicles}
                onVehiclesChange={setSelectedVehicles}
                selectedVehicleTypes={selectedVehicleTypes}
                setSelectedVehicleTypes={setSelectedVehicleTypes}
                form={form}
              />
            )}

            {outboundTotalFare && outbound.dropOffLocation && (
              <div className="w-full flex flex-col justify-center text-center items-center costDistanceDiv text-white">
                {/* Highlighted Reason */}
                {reasons?.length > 0 && (
                  <div className="px-4 py-2 max-w-full text-center">
                    <ul className="space-y-1">
                      {reasons.map((reason, index) => (
                        <li key={index} className="text-yellow-500 text-sm font-medium break-words">
                          {reasons.length > 1 ? `• ` : ''}
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <span className="font-normal text-3xl">
                  Fare:{' '}
                  <strong className="font-semibold">£{(outboundTotalFare ?? 0).toFixed(2)}</strong>
                </span>
              </div>
            )}

            {/* Full Name */}
            <Form.Item
              label="Full Name"
              name="fullName"
              className="!mb-[10px]"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input placeholder="Full Name" className="rounded-[2px]" />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              className="!mb-[10px]"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="Enter your Email" className="rounded-[2px]" />
            </Form.Item>

            {/* Phone */}
            <Form.Item
              label="Phone"
              name="phone"
              className="!mb-[10px]"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <PhoneInput
                defaultCountry="GB"
                className="!w-full"
                value={phoneValue}
                onChange={setPhoneValue}
              />
            </Form.Item>

            {/* Additional Information */}
            <Form.Item label="Additional Information" name="instructions" className="!mb-[10px]">
              <TextArea
                rows={3}
                placeholder="Write your text here..."
                className="rounded-[2px]"
                maxLength={200}
              />
            </Form.Item>

            <Form.Item name="addStop" className="!mb-[10px]">
              <Checkbox onChange={onAddStops} checked={addStops}>
                Add Stops
              </Checkbox>
            </Form.Item>

            {addStops && (
              <>
                <LocationList
                  locations={outbound.locations}
                  activeMapIndex={outbound.activeMapIndex}
                  setActiveMapIndex={outbound.setActiveMapIndex}
                  updateLocation={outbound.updateLocation}
                  addStop={outbound.addStop}
                  removeStop={outbound.removeStop}
                  handleDragStart={outbound.handleDragStart}
                  handleDragOver={outbound.handleDragOver}
                  handleDragEnd={outbound.handleDragEnd}
                  autocompleteRefs={outbound.autocompleteRefs}
                  onPlaceChanged={outbound.onPlaceChanged}
                  legDistances={legDistances}
                  showAddStop={addStops}
                  fieldName="locations"
                />

                {isLoaded && (
                  <div className="mb-4">
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={outbound.getCenter()} // ✅ FIXED
                      zoom={12}
                      onClick={outbound.handleMapClick} // ✅ FIXED
                      options={{ restriction: { latLngBounds: ukBounds, strictBounds: true } }}
                    >
                      {outbound.locations.map(
                        (
                          loc,
                          i // ✅ FIXED
                        ) =>
                          loc.lat !== null ? (
                            <Marker
                              key={loc.id}
                              position={{ lat: loc.lat, lng: loc.lng! }}
                              label={labelForIndex(i, outbound.locations.length)}
                            />
                          ) : null
                      )}

                      {outbound.directions &&
                        !outbound.loadingDirections && ( // ✅ FIXED
                          <DirectionsRenderer
                            directions={outbound.directions}
                            options={{ suppressMarkers: true }}
                          />
                        )}
                    </GoogleMap>

                    {/* {outbound.dropOffLocation && distance > 0 && (   // ✅ FIXED
                      <div className="w-full flex flex-col justify-center items-center text-white">
                        <span className="font-normal text-3xl">
                          Distance:{' '}
                          <strong className="font-semibold text-3xl">
                            {distance} miles
                          </strong>
                        </span>
                      </div>
                    )} */}
                  </div>
                )}
              </>
            )}

            {/* Return toggle */}
            <Form.Item name="return" className="!mb-[10px]">
              <Checkbox onChange={onChange}>Add Return</Checkbox>
            </Form.Item>

            {/* ════════════ RETURN JOURNEY (multi-stop) ════════════ */}
            {wantToReturn && (
              <div className="border border-solid border-white/20 rounded p-3 mb-3">
                <h4 className="text-white font-semibold text-lg mb-3">Return Journey</h4>

                {isLoaded && (
                  <LocationList
                    locations={ret.locations}
                    activeMapIndex={ret.activeMapIndex}
                    setActiveMapIndex={ret.setActiveMapIndex}
                    updateLocation={ret.updateLocation}
                    addStop={ret.addStop}
                    removeStop={ret.removeStop}
                    handleDragStart={ret.handleDragStart}
                    handleDragOver={ret.handleDragOver}
                    handleDragEnd={ret.handleDragEnd}
                    autocompleteRefs={ret.autocompleteRefs}
                    onPlaceChanged={ret.onPlaceChanged}
                    legDistances={returnLegDistances}
                    showAddStop={false}
                    fieldName="returnLocations"
                  />
                )}

                {/* Return Map */}
                {isLoaded && (
                  <div className="mb-4">
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={ret.getCenter()}
                      zoom={12}
                      onClick={ret.handleMapClick}
                      options={{
                        restriction: { latLngBounds: ukBounds, strictBounds: true },
                      }}
                    >
                      {ret.locations.map((loc, i) =>
                        loc.lat !== null ? (
                          <Marker
                            key={loc.id}
                            position={{ lat: loc.lat, lng: loc.lng! }}
                            label={labelForIndex(i, ret.locations.length)}
                          />
                        ) : null
                      )}
                      {ret.directions && !ret.loadingDirections && (
                        <DirectionsRenderer
                          directions={ret.directions}
                          options={{ suppressMarkers: true }}
                        />
                      )}
                    </GoogleMap>
                  </div>
                )}

                {/* Return Date & Time */}
                <Row gutter={10}>
                  <Col span={12}>
                    <Form.Item
                      label="Return Date"
                      name="returnDate"
                      className="!mb-[10px]"
                      rules={[{ required: true, message: 'Please enter return date' }]}
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
                      label="Return Time"
                      name="returnTime"
                      initialValue={dayjs()}
                      className="!mb-[10px]"
                      rules={[{ required: true, message: 'Please choose return time' }]}
                    >
                      <ASAPTimePicker
                        value={bookingTime}
                        onChange={(time) => {
                          setBookingTime(time);
                          setReturnIsAsap(false);
                        }}
                        onASAPClick={() => {
                          form.setFieldsValue({ returnDate: dayjs() });
                          setReturnIsAsap(true);
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Return Passengers */}
                <Form.Item
                  label="Return Passengers"
                  name="returnNoOfPassengers"
                  className="!mb-[10px]"
                  rules={[{ required: true, message: 'Please select return passengers' }]}
                >
                  <InputNumber
                    min={1}
                    placeholder="Passengers"
                    className="!rounded-[2px] !w-full"
                    onChange={(e) => setReturnPassengers(Number(e))}
                  />
                </Form.Item>

                {allValues?.returnNoOfPassengers > 0 && (
                  <VehicleSelectionCards
                    isReturn
                    bookingTime={bookingTime}
                    noOfPassengers={returnPassengers}
                    selectedVehicles={selectedReturnVehicles}
                    onVehiclesChange={setSelectedReturnVehicles}
                    selectedVehicleTypes={selectedReturnVehicleTypes}
                    setSelectedVehicleTypes={setSelectedReturnVehicleTypes}
                    form={form}
                  />
                )}

                {returnTotalFare && (
                  <div className="w-full flex flex-col justify-center text-center items-center costDistanceDiv text-white">
                    {/* Highlighted Reason */}
                    {returnReasons?.length > 0 && (
                      <div className="px-4 py-2 max-w-full text-center">
                        <ul className="space-y-1">
                          {returnReasons.map((reason, index) => (
                            <li
                              key={index}
                              className="text-yellow-500 text-sm font-medium break-words"
                            >
                              {returnReasons.length > 1 ? `• ` : ''}
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <span className="font-normal text-3xl">
                      Fare:{' '}
                      <strong className="font-semibold">
                        {' '}
                        £{(returnTotalFare ?? 0).toFixed(2)}
                      </strong>
                    </span>
                  </div>
                )}

                {/* Return Instructions */}
                <Form.Item
                  label="Return Instructions"
                  name="returnInstructions"
                  className="!mb-[10px]"
                >
                  <TextArea
                    rows={3}
                    placeholder="Write your text here..."
                    className="rounded-[2px]"
                    maxLength={200}
                  />
                </Form.Item>

                <Form.Item name="returnAddStop" className="!mb-[10px]">
                  <Checkbox onChange={onReturnAddStops} checked={returnAddStops}>
                    Add Return Stops
                  </Checkbox>
                </Form.Item>

                {returnAddStops && (
                  <>
                    <LocationList
                      locations={ret.locations}
                      activeMapIndex={ret.activeMapIndex}
                      setActiveMapIndex={ret.setActiveMapIndex}
                      updateLocation={ret.updateLocation}
                      addStop={ret.addStop}
                      removeStop={ret.removeStop}
                      handleDragStart={ret.handleDragStart}
                      handleDragOver={ret.handleDragOver}
                      handleDragEnd={ret.handleDragEnd}
                      autocompleteRefs={ret.autocompleteRefs}
                      onPlaceChanged={ret.onPlaceChanged}
                      legDistances={returnLegDistances}
                      showAddStop={returnAddStops}
                      fieldName="returnLocations"
                    />

                    {/* Return map */}
                    {isLoaded && (
                      <div className="mb-4">
                        <GoogleMap
                          mapContainerStyle={containerStyle}
                          center={ret.getCenter()}
                          zoom={12}
                          onClick={ret.handleMapClick}
                          options={{ restriction: { latLngBounds: ukBounds, strictBounds: true } }}
                        >
                          {ret.locations.map((loc, i) =>
                            loc.lat !== null ? (
                              <Marker
                                key={loc.id}
                                position={{ lat: loc.lat, lng: loc.lng! }}
                                label={labelForIndex(i, ret.locations.length)}
                              />
                            ) : null
                          )}
                          {ret.directions && !ret.loadingDirections && (
                            <DirectionsRenderer
                              directions={ret.directions}
                              options={{ suppressMarkers: true }}
                            />
                          )}
                        </GoogleMap>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Payment Method */}
            <Form.Item name="paymentMethod" className="!mb-[10px]">
              <Radio.Group options={filteredOptions} onChange={onRadioChange} defaultValue={pay} />
            </Form.Item>

            {/* Fare Summary */}
            <div className="bg-[#F7F7F8] text-[#000000] py-[13px] rounded-[2px] border-1 border-solid border-[#E5E5EA]">
              <div className="font-semibold text-[28px] px-[10px]">Estimated Fare</div>
              <div className="text-[14px] font-normal px-[10px]">For full and return bookings</div>

              <div className="mt-7 px-[10px]">
                {!wantToReturn ? (
                  <div className="flex items-center justify-between">
                    <div className="font-normal text-[16px]">Estimated Fare</div>
                    <div
                      className={`font-medium text-[20px] ${
                        reasons?.length > 0 ? 'text-red-500 bg-red-100 px-2 py-1 rounded-md' : ''
                      }`}
                    >
                      £{parsedFare?.toFixed(2)}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="font-normal text-[16px]">Outbound Estimated Fare</div>
                      <div
                        className={`font-medium text-[20px] ${
                          reasons?.length > 0 ? 'text-red-500 bg-red-100 px-2 py-1 rounded-md' : ''
                        }`}
                      >
                        £{parsedFare?.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="font-normal text-[16px]">Return Fare</div>
                      <div
                        className={`font-medium text-[20px] ${
                          returnReasons?.length > 0
                            ? 'text-red-500 bg-red-100 px-2 py-1 rounded-md'
                            : ''
                        }`}
                      >
                        £{(returnTotalFare ?? 0).toFixed(2)}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-5 border-t border-solid border-[#8E8E93]">
                <div className="flex items-center justify-between px-[10px] mt-[10px]">
                  <div className="font-normal text-[16px]">Total Payment</div>
                  <div
                    className={`font-medium text-[20px] ${
                      wantToReturn
                        ? returnReasons?.length > 0
                          ? 'text-red-500 bg-red-100 px-2 py-1 rounded-md'
                          : ''
                        : reasons?.length > 0
                          ? 'text-red-500 bg-red-100 px-2 py-1 rounded-md'
                          : ''
                    }`}
                  >
                    £{totalPayment?.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center w-full">
              <Form.Item className="!mb-1 mt-5">
                <Button
                  disabled={!bookingsEnabled}
                  type="primary"
                  className="!bg-[#FEC601] hover:!bg-[#FEC601] !text-lg font-semibold !h-[35px] !w-[187px] flex text-center justify-center items-center"
                  htmlType="submit"
                  block
                >
                  {bookingsEnabled ? 'Book Now' : 'Bookings Disabled'}
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Spin>
      </div>
    </div>
  );
}
