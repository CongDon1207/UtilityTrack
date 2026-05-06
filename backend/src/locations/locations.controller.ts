import { Controller, Get, Param, Body, Post} from '@nestjs/common';
import {LocationsService} from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';


@Controller('locations')
export class LocationsController {
    constructor(private readonly locationService: LocationsService) {}

    @Get()
    findAll() {
        return this.locationService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        return this.locationService.findOne(id);
    }

    @Post()
    create(@Body() body: CreateLocationDto){
        return this.locationService.create(body);
    }
}

