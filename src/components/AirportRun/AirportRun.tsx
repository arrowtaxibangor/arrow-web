'use client';
type Location = {
  lat: number;
  lng: number;
};

type Item = {
  id: number;
  airport: string;
  fare: number;
  location: Location;
};
export const predefinedLocations: Item[] = [
  {
    id: 1,
    airport: 'Manchester Airport',
    fare: 175,
    location: { lat: 53.365, lng: -2.2726 },
  },
  {
    id: 2,
    airport: 'Birmingham Airport',
    fare: 400,
    location: { lat: 52.454, lng: -1.748 },
  },
  {
    id: 3,
    airport: 'Liverpool John Lennon Airport',
    fare: 140,
    location: { lat: 53.332, lng: -2.8697 },
  },
  {
    id: 4,
    airport: 'London Heathrow',
    fare: 600,
    location: { lat: 51.47, lng: -0.4543 },
  },
];
export const AirportRun = () => {
  const locations: string[] = [
    'Gwynedd',
    'Bangor Train Station',
    'Caernarfon',
    'Snowdonia National Park',
    'Snowdon',
    'Southstack',
    'Penmon Lighthouse',
    'Porthmadog',
    'Pwllheli',
    'Beddgelert',
  ];

  return (
    <div className="w-full sm:max-w-[80vw] px-3 sm:px-0 text-primary_color airProtRuns">
      <h3 className="text-center text-[2.5rem] font-[600] my-14">Airport Runs</h3>
      <div className="flex justify-evenly gap-3 flex-wrap">
        {predefinedLocations?.map((item) => (
          <div
            className="bg-[#23477c] border-[1px] border-solid border-primary_color flex flex-col justify-center items-center rounded-lg p-4 cursor-pointer hover:bg-[#2a518b] transition-all duration-300"
            key={item?.id}
            // onClick={() => onSelectAirport(item?.location)}
          >
            <strong className="text-white text-lg font-semibold">{item?.airport}</strong>
            <span className="text-gray-300">£{item?.fare}</span>
          </div>
        ))}
      </div>

      <p className="my-14">
        Arrow Taxi Bangor is the new rising star of Gwynedd taxi services. Whether you are looking
        to book a long distance ride or a local night out, you can book with confidence. We offer
        nice clean cars and friendly professional drivers.
        <br />
        If you are a tourist looking to book a taxi for a day/week you are welcome to discuss your
        plans with the driver and they can then give you our best quote.
      </p>
      <h4 className="text-[20px] font-[600] mb-4">Popular areas we cover:</h4>
      <ul>
        {locations?.map((location, index) => (
          <li key={index}>{location}</li>
        ))}
      </ul>
    </div>
  );
};
