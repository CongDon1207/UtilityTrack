import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'VEHICLES' })
export class VehicleEntity {
  @PrimaryGeneratedColumn('increment', { name: 'ID', type: 'number' })
  id!: number;

  @Column({ name: 'VEHICLE_NAME', type: 'varchar2', length: 100, unique: true })
  vehicleName!: string;

  @Column({ name: 'IS_ACTIVE', type: 'number', precision: 1, default: 1 })
  isActive!: number;

  @CreateDateColumn({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT', type: 'timestamp' })
  updatedAt!: Date;
}
