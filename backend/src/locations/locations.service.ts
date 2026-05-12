import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { LocationEntity } from './location.entity';


@Injectable()
export class LocationsService {
    constructor(
        @InjectRepository(LocationEntity)
        private readonly locationsRepository: Repository<LocationEntity>,
    ){}


    async findAll() {
        return await this.locationsRepository.find();
    }

    

    async findOne(id: string) {
        const location = await this.locationsRepository.findOne({
            where: {id: Number(id)}
        });

        if(!location) {
            throw new NotFoundException(`Location with id ${id} not found`);
        }
        return location;
    }



    create(data: CreateLocationDto){
        const newLocation = this.locationsRepository.create({
            name: data.name,
            code: data.code,
            type: data.type,
            address: data.address,
            isActive: 1,
        });
        return this.locationsRepository.save(newLocation);
    }
   
    async update(id: string, data: UpdateLocationDto) {
        const location = await this.findOne(id);

        Object.assign(location, data);
        return this.locationsRepository.save(location);
    }

   

    async remove(id: string){
        const location = await this.findOne(id);

        location.isActive = 0;

        return this.locationsRepository.save(location);
    }


}
