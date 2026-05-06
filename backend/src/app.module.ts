import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [LocationsModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
