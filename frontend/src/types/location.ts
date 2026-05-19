export type LocationType = 
    | 'home'
    | 'factory'
    | 'office'
    | 'warehouse'
    | 'rental_room'
    | 'other';

export type Location = {
    id: number;
    name: string;
    code?: string;
    type: LocationType;
    address?: string;
    isActive: number;
};

export type CreateLocationInput = {
  name: string;
  code?: string;
  type: LocationType;
  address?: string;
};

export type UpdateLocationInput = Partial<CreateLocationInput>;
