import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VehicleEntity } from './vehicle.entity';

@Entity({ name: 'VEHICLE_KM_RECORDS' })
export class VehicleKmRecordEntity {
  @PrimaryGeneratedColumn('increment', { name: 'ID', type: 'number' })
  id!: number;

  @Column({ name: 'VEHICLE_ID', type: 'number' })
  vehicleId!: number;

  @ManyToOne(() => VehicleEntity, { nullable: false })
  @JoinColumn({ name: 'VEHICLE_ID' })
  vehicle!: VehicleEntity;

  @Column({ name: 'TRIP_DATE', type: 'date' })
  tripDate!: Date;

  @Column({
    name: 'DRIVER_NAME',
    type: 'varchar2',
    length: 100,
    nullable: true,
  })
  driverName?: string;

  @Column({
    name: 'TRIP_PURPOSE',
    type: 'varchar2',
    length: 300,
    nullable: true,
  })
  tripPurpose?: string;

  @Column({
    name: 'DEPARTURE_TIME',
    type: 'varchar2',
    length: 5,
    nullable: true,
  })
  departureTime?: string;

  @Column({
    name: 'DEPARTURE_ODOMETER',
    type: 'number',
    precision: 10,
  })
  departureOdometer!: number;

  @Column({ name: 'ARRIVAL_TIME', type: 'varchar2', length: 5, nullable: true })
  arrivalTime?: string;

  @Column({ name: 'ARRIVAL_ODOMETER', type: 'number', precision: 10 })
  arrivalOdometer!: number;

  @Column({ name: 'NOTE', type: 'varchar2', length: 500, nullable: true })
  note?: string;

  @CreateDateColumn({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT', type: 'timestamp' })
  updatedAt!: Date;
}
