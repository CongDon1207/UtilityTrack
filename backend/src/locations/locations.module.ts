import { Module} from '@nestjs/common'
import { LocationsController} from './locations.controller'
import {LocationsService} from './locations.service'
import { LocationEntity } from './location.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [TypeOrmModule.forFeature([LocationEntity])],
    controllers: [LocationsController],
    providers: [LocationsService],


})

export class LocationsModule {}