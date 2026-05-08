import { Controller, Get, Param, Body, Post, Patch, Delete } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';


@Controller('locations')
export class LocationsController {
    constructor(private readonly locationService: LocationsService) { }

    @Get()
    findAll() {
        return this.locationService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.locationService.findOne(id);
    }

    @Post()
    create(@Body() body: CreateLocationDto) {
        return this.locationService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: UpdateLocationDto) {
        return this.locationService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.locationService.remove(id);
    }
    
}

