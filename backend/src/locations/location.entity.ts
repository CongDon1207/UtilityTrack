import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'LOCATIONS' })
export class LocationEntity {
  @PrimaryGeneratedColumn('increment', { name: 'ID', type: 'number' })
  id!: number;

  @Column({ name: 'NAME', type: 'varchar2', length: 100 })
  name!: string;

  @Column({ name: 'CODE', type: 'varchar2', length: 50, nullable: true })
  code?: string;

  @Column({ name: 'TYPE', type: 'varchar2', length: 30 })
  type!: string;

  @Column({ name: 'ADDRESS', type: 'varchar2', length: 255, nullable: true })
  address?: string;

  @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
  isActive!: number;
}
