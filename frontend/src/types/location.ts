export type LocationType = 
    | 'home'
    | 'factory'
    | 'office'
    | 'warehouse'
    | 'rental_room'
    | 'other';

export type Location = {
    id: string;
    name: string;
    code?: string;
    type: LocationType;
    address?: string;
    isActive: boolean;
};

export type CreateLocationInput = {
  name: string;
  code?: string;
  type: LocationType;
  address?: string;
};
