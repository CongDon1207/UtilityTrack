import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto'

export interface Location {
    id: string;
    name: string;
    code?: string;
    type: string;
    address?: string;
    isActive: boolean;
}

@Injectable()
export class LocationsService {
    private locations: Location[] = [
        {
            id: '1',
            name: 'Van phong Ha Noi',
            code: 'HN-OFFICE',
            type: 'office',
            address: 'Ha Noi',
            isActive: true,
        },
        {
            id: '2',
            name: 'Xuong san xuat 1',
            code: 'FACTORY-01',
            type: 'factory',
            address: 'Bac Ninh',
            isActive: true,
        },
    ];

    findAll() {
        return this.locations;
    }

    findOne(id: string) {
        const location = this.locations.find((location) => location.id === id);

        if (!location) {
            throw new NotFoundException(`Location with id ${id} not found`);
        }

        return location;
    }

    create(data: CreateLocationDto) {
        const newLocation: Location = {
            id: String(this.locations.length + 1),
            name: data.name,
            code: data.code,
            type: data.type,
            address: data.address,
            isActive: true,
        };

        this.locations.push(newLocation);
        return newLocation;
    }

    update(id: string, data: UpdateLocationDto) {
        const location = this.findOne(id);

        Object.assign(location, data);

        return location;
    }

    remove(id: string) {
        const location = this.findOne(id);

        location.isActive = false;

        return location;
    }


}
