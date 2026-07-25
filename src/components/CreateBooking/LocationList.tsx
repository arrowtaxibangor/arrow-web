/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-key */
import { Autocomplete } from '@react-google-maps/api';
import { LocationListProps } from '../../../types/location';
import { labelForIndex } from '../../../utils/bookingLocations';
import { Button, Form, Input, message } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

export default function LocationList({
  locations,
  activeMapIndex,
  setActiveMapIndex,
  updateLocation,
  addStop,
  removeStop,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  autocompleteRefs,
  onPlaceChanged,
  legDistances = [],
  showAddStop = false,
  fieldName = 'locations',
}: LocationListProps) {
  const visibleLocations = showAddStop
    ? locations.slice(1, -1)
    : [locations[0], locations[locations.length - 1]];

  const hasAddedInitialStop = useRef(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (showAddStop && locations.length === 2 && !hasAddedInitialStop.current) {
      addStop();
      hasAddedInitialStop.current = true;
    }
  }, [showAddStop, locations.length]);

  // GET CURRENT LOCATION
  const handleCurrentLocation = async () => {
    try {
      setLoadingLocation(true);

      if (!navigator.geolocation) {
        message.error('Geolocation is not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Convert lat/lng to address
            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode(
              {
                location: { lat, lng },
              },
              (results, status) => {
                setLoadingLocation(false);

                if (status === 'OK' && results && results.length > 0) {
                  const address = results[0].formatted_address;

                  // Update pickup location (index 0)
                  updateLocation(0, {
                    address,
                    lat,
                    lng,
                  });

                  message.success('Current location selected');
                } else {
                  message.error('Unable to fetch address');
                }
              }
            );
          } catch (err) {
            setLoadingLocation(false);
            message.error('Failed to get current location');
          }
        },
        (error) => {
          setLoadingLocation(false);

          if (error.code === error.PERMISSION_DENIED) {
            message.error('Location permission denied');
          } else {
            message.error('Unable to access location');
          }
        },
        {
          enableHighAccuracy: true,
        }
      );
    } catch (err) {
      setLoadingLocation(false);
      message.error('Something went wrong');
    }
  };

  const totalDistance = legDistances?.length
    ? legDistances.reduce((acc, d) => {
        const num = parseFloat(d);
        return acc + (isNaN(num) ? 0 : num);
      }, 0)
    : null;

  return (
    <div className="flex flex-col gap-2">
      {visibleLocations.map((loc, i) => {
        const index = showAddStop ? i + 1 : i === 0 ? 0 : locations.length - 1;

        const isFirst = index === 0;
        const isLast = index === locations.length - 1;

        const label = isFirst ? 'Pickup' : isLast ? 'Drop-off' : `Stop ${index}`;
        const color = isFirst ? '#22c55e' : isLast ? '#ef4444' : '#f59e0b';

        const shouldShowDistance = showAddStop
          ? index < locations.length - 2
          : index < locations.length - 1;

        const hasNextLocation =
          locations[index] &&
          locations[index + 1] &&
          locations[index].lat &&
          locations[index].lng &&
          locations[index + 1].lat &&
          locations[index + 1].lng;

        return (
          <div>
            <div
              key={loc.id}
              draggable={!isFirst && !isLast}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-2 ${
                !isFirst && !isLast ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
              }`}
              style={{
                background: isFirst && isLast ? 'rgba(255,255,255,0.08)' : '',
                borderRadius: 4,
                padding: '4px 6px',
              }}
            >
              {!isFirst && !isLast && (
                <>
                  <span
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: 18,
                      lineHeight: 1,
                      userSelect: 'none',
                    }}
                  >
                    ⋮⋮
                  </span>

                  <span
                    style={{
                      minWidth: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    {labelForIndex(index, locations.length)}
                  </span>
                </>
              )}

              <div style={{ flex: 1 }}>
                <Form.Item
                  name={[fieldName, index, 'address']}
                  label={
                    isFirst || isLast ? (
                      <div className="flex items-center justify-between gap-2">
                        <span>{label} Location</span>

                        {isFirst && (
                          <span
                            onClick={handleCurrentLocation}
                            title="Use current location"
                            style={{
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background: '#e0f4f9',
                            }}
                          >
                            <AimOutlined style={{ color: '#0d4f6e', fontSize: 18 }} />
                          </span>
                        )}
                      </div>
                    ) : null
                  }
                  className="!mb-1"
                  rules={[
                    {
                      required: isFirst || isLast,
                      message: `Please enter ${label.toLowerCase()} location`,
                    },
                  ]}
                >
                  <Autocomplete
                    onLoad={(ac) => {
                      autocompleteRefs.current[index] = ac;
                    }}
                    onPlaceChanged={() => onPlaceChanged(index)}
                    options={{
                      componentRestrictions: { country: 'uk' },
                    }}
                  >
                    <Input
                      value={loc.address}
                      onChange={(e) =>
                        updateLocation(index, {
                          address: e.target.value,
                        })
                      }
                      onFocus={() => setActiveMapIndex(index)}
                      placeholder={`Choose your ${label} Location`}
                      allowClear
                      className="rounded-[2px]"
                      suffix={isFirst && loadingLocation ? '...' : null}
                    />
                  </Autocomplete>
                </Form.Item>
              </div>

              {!isFirst && !isLast && (
                <Button
                  danger
                  size="small"
                  onClick={() => removeStop(index)}
                  style={{ flexShrink: 0 }}
                >
                  ✕
                </Button>
              )}
            </div>

            {shouldShowDistance && hasNextLocation && legDistances[index] && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: 32,
                  marginTop: 2,
                  marginBottom: 2,
                  color: '#ddd',
                  fontSize: 12,
                  gap: 6,
                }}
              >
                <span>↓</span>
                <span>
                  {showAddStop ? legDistances[index] : `${totalDistance?.toFixed(2)} miles`}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {showAddStop && locations.length < 6 && (
        <Button type="dashed" onClick={addStop} block className="my-3">
          + Add Stop
        </Button>
      )}
    </div>
  );
}
