export interface LocationStop {
  id: string;
  lat: number | null;
  lng: number | null;
  address: string;
}

export interface LocationListProps {
  locations: LocationStop[];
  activeMapIndex: number;
  setActiveMapIndex: (i: number) => void;
  updateLocation: (i: number, patch: Partial<LocationStop>) => void;
  addStop: () => void;
  removeStop: (i: number) => void;
  handleDragStart: (i: number) => void;
  handleDragOver: (e: React.DragEvent, i: number) => void;
  handleDragEnd: () => void;
  autocompleteRefs: React.MutableRefObject<any[]>;
  onPlaceChanged: (i: number) => void;
  legDistances?: string[];
  showAddStop?: boolean;
  fieldName?: string;
}
