import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'ELECTRICITY_RECORDS' })
export class ElectricityRecordEntity {
  @PrimaryGeneratedColumn('increment', { name: 'ID', type: 'number' })
  id!: number;

  @Column({ name: 'RECORD_YEAR', type: 'number', precision: 4 })
  recordYear!: number;

  @Column({ name: 'RECORD_MONTH', type: 'number', precision: 2 })
  recordMonth!: number;

  @Column({ name: 'DEPARTMENT_GROUP', type: 'varchar2', length: 150 })
  departmentGroup!: string;

  @Column({ name: 'KWH_USED', type: 'number', precision: 14, scale: 2 })
  kwhUsed!: number;

  @Column({ name: 'TOTAL_COST', type: 'number', precision: 18, scale: 2 })
  totalCost!: number;

  @Column({ name: 'NOTE', type: 'varchar2', length: 500, nullable: true })
  note?: string;

  @CreateDateColumn({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT', type: 'timestamp' })
  updatedAt!: Date;
}
