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

@Entity({ name: 'FUEL_RECORDS' })
export class FuelRecordEntity {
  @PrimaryGeneratedColumn('increment', { name: 'ID', type: 'number' })
  id!: number;

  @Column({ name: 'VEHICLE_ID', type: 'number' })
  vehicleId!: number;

  @ManyToOne(() => VehicleEntity, { nullable: false })
  @JoinColumn({ name: 'VEHICLE_ID' })
  vehicle!: VehicleEntity;

  @Column({ name: 'FUEL_DATE', type: 'date' })
  fuelDate!: Date;

  @Column({ name: 'UNIT_PRICE', type: 'number', precision: 18 })
  unitPrice!: number;

  @Column({ name: 'LITERS', type: 'number', precision: 14, scale: 2 })
  liters!: number;

  @Column({ name: 'NOTE', type: 'varchar2', length: 500, nullable: true })
  note?: string;

  @CreateDateColumn({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT', type: 'timestamp' })
  updatedAt!: Date;
}
