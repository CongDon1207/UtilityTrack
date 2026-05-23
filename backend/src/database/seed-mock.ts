import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { ElectricityRecordEntity } from '../electricity/electricity-record.entity';
import { VehicleEntity } from '../vehicles/vehicle.entity';
import { FuelRecordEntity } from '../vehicles/fuel-record.entity';
import { VehicleKmRecordEntity } from '../vehicles/vehicle-km-record.entity';

interface JsonVehicle {
  vehicleName: string;
  isActive: number;
}

interface JsonElectricity {
  recordYear: number;
  recordMonth: number;
  departmentGroup: string;
  kwhUsed: number;
  totalCost: number;
  note?: string;
}

interface JsonFuel {
  vehicleName: string;
  fuelDate: string;
  unitPrice: number;
  liters: number;
  note?: string;
}

interface JsonKm {
  vehicleName: string;
  tripDate: string;
  driverName?: string;
  tripPurpose?: string;
  departureTime?: string;
  departureOdometer: number;
  arrivalTime?: string;
  arrivalOdometer: number;
  note?: string;
}

function loadEnv(): void {
  const envPath = path.join(__dirname, '../../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        process.env[key] = val;
      }
    });
  }
}

loadEnv();

function readJsonFile<T>(fileName: string): T {
  const filePath = path.join(__dirname, 'mock-data', fileName);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Fatal: Failed to read or parse JSON file: ${fileName}`);
    throw error;
  }
}

function isStringFieldEqual(
  dbVal: string | null | undefined,
  jsonVal: string | null | undefined,
): boolean {
  const normDb = dbVal ? dbVal.trim() : '';
  const normJson = jsonVal ? jsonVal.trim() : '';
  return normDb === normJson;
}

async function main(): Promise<void> {
  console.log('Starting JSON-based seed process...');

  const dataSource = new DataSource({
    type: 'oracle',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 1522),
    username: process.env.DB_USERNAME || 'UTILITYTRACK',
    password: process.env.DB_PASSWORD || 'utilitytrack123',
    serviceName: process.env.DB_SERVICE_NAME || 'XEPDB1',
    entities: [
      ElectricityRecordEntity,
      VehicleEntity,
      FuelRecordEntity,
      VehicleKmRecordEntity,
    ],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('Database connection initialized successfully.');

  let invalidRowsSkipped = 0;

  try {
    const vehicleRepo = dataSource.getRepository(VehicleEntity);
    const elecRepo = dataSource.getRepository(ElectricityRecordEntity);
    const fuelRepo = dataSource.getRepository(FuelRecordEntity);
    const kmRepo = dataSource.getRepository(VehicleKmRecordEntity);

    // 1. Seed Vehicles
    const jsonVehicles = readJsonFile<JsonVehicle[]>('vehicles.json');
    const existingVehicles = await vehicleRepo.find();
    const vehicleMap = new Map<string, VehicleEntity>();
    existingVehicles.forEach((v) => {
      vehicleMap.set(v.vehicleName.normalize('NFC').toLowerCase(), v);
    });

    let vehiclesInserted = 0;
    let vehiclesUpdated = 0;

    for (const v of jsonVehicles) {
      const name = v.vehicleName.trim();
      if (!name) {
        console.warn(`Warning: Skipped empty vehicle name.`);
        invalidRowsSkipped++;
        continue;
      }
      const key = name.normalize('NFC').toLowerCase();
      if (vehicleMap.has(key)) {
        const existing = vehicleMap.get(key)!;
        if (existing.isActive !== v.isActive) {
          existing.isActive = v.isActive;
          await vehicleRepo.save(existing);
          vehiclesUpdated++;
        }
      } else {
        const newVehicle = vehicleRepo.create({
          vehicleName: name,
          isActive: v.isActive,
        });
        const saved = await vehicleRepo.save(newVehicle);
        vehicleMap.set(key, saved);
        vehiclesInserted++;
      }
    }

    // Helper to get or create vehicle during seeding
    const getOrCreateVehicle = async (rawName: string): Promise<number> => {
      let name = rawName.trim();
      if (name.normalize('NFC').toLowerCase() === '19_c') {
        name = '19C';
      }
      const key = name.normalize('NFC').toLowerCase();
      if (vehicleMap.has(key)) {
        return vehicleMap.get(key)!.id;
      }
      const newV = vehicleRepo.create({ vehicleName: name, isActive: 1 });
      const saved = await vehicleRepo.save(newV);
      vehicleMap.set(key, saved);
      vehiclesInserted++;
      return saved.id;
    };

    // 2. Seed Electricity Records
    const jsonElec = readJsonFile<JsonElectricity[]>(
      'electricity-records.json',
    );
    const existingElec = await elecRepo.find();
    const makeElecKey = (year: number, month: number, dept: string) =>
      `${year}_${month}_${dept.normalize('NFC').toLowerCase()}`;

    const elecMap = new Map<string, ElectricityRecordEntity>();
    existingElec.forEach((r) => {
      elecMap.set(
        makeElecKey(r.recordYear, r.recordMonth, r.departmentGroup),
        r,
      );
    });

    let elecInserted = 0;
    let elecUpdated = 0;

    for (const r of jsonElec) {
      if (
        r.recordMonth < 1 ||
        r.recordMonth > 12 ||
        r.kwhUsed < 0 ||
        r.totalCost < 0 ||
        !r.departmentGroup
      ) {
        console.warn(
          `Warning: Skipped invalid electricity record: Month=${r.recordMonth}, kWh=${r.kwhUsed}, Cost=${r.totalCost}, Group=${r.departmentGroup}`,
        );
        invalidRowsSkipped++;
        continue;
      }

      const key = makeElecKey(r.recordYear, r.recordMonth, r.departmentGroup);
      if (elecMap.has(key)) {
        const existing = elecMap.get(key)!;
        let hasChange = false;
        if (existing.kwhUsed !== r.kwhUsed) {
          existing.kwhUsed = r.kwhUsed;
          hasChange = true;
        }
        if (existing.totalCost !== r.totalCost) {
          existing.totalCost = r.totalCost;
          hasChange = true;
        }
        if (!isStringFieldEqual(existing.note, r.note)) {
          existing.note = r.note || undefined;
          hasChange = true;
        }
        if (hasChange) {
          await elecRepo.save(existing);
          elecUpdated++;
        }
      } else {
        const newRecord = elecRepo.create({
          recordYear: r.recordYear,
          recordMonth: r.recordMonth,
          departmentGroup: r.departmentGroup,
          kwhUsed: r.kwhUsed,
          totalCost: r.totalCost,
          note: r.note,
        });
        await elecRepo.save(newRecord);
        elecInserted++;
      }
    }

    // 3. Seed Fuel Records
    const jsonFuel = readJsonFile<JsonFuel[]>('fuel-records.json');
    const existingFuel = await fuelRepo.find();
    const makeFuelKey = (
      vehicleId: number,
      dateStr: string,
      price: number,
      liters: number,
    ) => {
      const dateOnly = new Date(dateStr).toISOString().split('T')[0];
      return `${vehicleId}_${dateOnly}_${price}_${Number(liters).toFixed(2)}`;
    };

    const fuelMap = new Map<string, FuelRecordEntity>();
    existingFuel.forEach((f) => {
      const dateStr =
        f.fuelDate instanceof Date
          ? f.fuelDate.toISOString()
          : String(f.fuelDate);
      fuelMap.set(makeFuelKey(f.vehicleId, dateStr, f.unitPrice, f.liters), f);
    });

    let fuelInserted = 0;
    let fuelSkipped = 0;
    let fuelUpdated = 0;

    for (const f of jsonFuel) {
      if (f.unitPrice < 0 || f.liters < 0 || !f.vehicleName || !f.fuelDate) {
        console.warn(
          `Warning: Skipped invalid fuel record: Price=${f.unitPrice}, Liters=${f.liters}, Vehicle=${f.vehicleName}, Date=${f.fuelDate}`,
        );
        invalidRowsSkipped++;
        continue;
      }

      const vehicleId = await getOrCreateVehicle(f.vehicleName);
      const key = makeFuelKey(vehicleId, f.fuelDate, f.unitPrice, f.liters);

      if (fuelMap.has(key)) {
        const existing = fuelMap.get(key)!;
        if (!isStringFieldEqual(existing.note, f.note)) {
          existing.note = f.note || undefined;
          await fuelRepo.save(existing);
          fuelUpdated++;
        } else {
          fuelSkipped++;
        }
      } else {
        const newRecord = fuelRepo.create({
          vehicleId,
          fuelDate: new Date(f.fuelDate),
          unitPrice: f.unitPrice,
          liters: f.liters,
          note: f.note || 'Seeded from fuel workbook',
        });
        await fuelRepo.save(newRecord);
        fuelInserted++;
      }
    }

    // 4. Seed KM Records
    const jsonKm = readJsonFile<JsonKm[]>('vehicle-km-records.json');
    const existingKm = await kmRepo.find();
    const makeKmKey = (
      vehicleId: number,
      dateStr: string,
      depOdo: number,
      arrOdo: number,
    ) => {
      const dateOnly = new Date(dateStr).toISOString().split('T')[0];
      return `${vehicleId}_${dateOnly}_${depOdo}_${arrOdo}`;
    };

    const kmMap = new Map<string, VehicleKmRecordEntity>();
    existingKm.forEach((k) => {
      const dateStr =
        k.tripDate instanceof Date
          ? k.tripDate.toISOString()
          : String(k.tripDate);
      kmMap.set(
        makeKmKey(k.vehicleId, dateStr, k.departureOdometer, k.arrivalOdometer),
        k,
      );
    });

    let kmInserted = 0;
    let kmSkipped = 0;
    let kmUpdated = 0;

    for (const k of jsonKm) {
      if (
        k.arrivalOdometer < k.departureOdometer ||
        k.departureOdometer < 0 ||
        k.arrivalOdometer < 0 ||
        !k.vehicleName ||
        !k.tripDate
      ) {
        console.warn(
          `Warning: Skipped invalid KM record: DepOdo=${k.departureOdometer}, ArrOdo=${k.arrivalOdometer}, Vehicle=${k.vehicleName}, Date=${k.tripDate}`,
        );
        invalidRowsSkipped++;
        continue;
      }

      const vehicleId = await getOrCreateVehicle(k.vehicleName);
      const key = makeKmKey(
        vehicleId,
        k.tripDate,
        k.departureOdometer,
        k.arrivalOdometer,
      );

      if (kmMap.has(key)) {
        const existing = kmMap.get(key)!;
        let hasChange = false;
        if (!isStringFieldEqual(existing.driverName, k.driverName)) {
          existing.driverName = k.driverName || undefined;
          hasChange = true;
        }
        if (!isStringFieldEqual(existing.tripPurpose, k.tripPurpose)) {
          existing.tripPurpose = k.tripPurpose || undefined;
          hasChange = true;
        }
        if (!isStringFieldEqual(existing.departureTime, k.departureTime)) {
          existing.departureTime = k.departureTime || undefined;
          hasChange = true;
        }
        if (!isStringFieldEqual(existing.arrivalTime, k.arrivalTime)) {
          existing.arrivalTime = k.arrivalTime || undefined;
          hasChange = true;
        }
        if (!isStringFieldEqual(existing.note, k.note)) {
          existing.note = k.note || undefined;
          hasChange = true;
        }

        if (hasChange) {
          await kmRepo.save(existing);
          kmUpdated++;
        } else {
          kmSkipped++;
        }
      } else {
        const newRecord = kmRepo.create({
          vehicleId,
          tripDate: new Date(k.tripDate),
          driverName: k.driverName,
          tripPurpose: k.tripPurpose,
          departureTime: k.departureTime,
          departureOdometer: k.departureOdometer,
          arrivalTime: k.arrivalTime,
          arrivalOdometer: k.arrivalOdometer,
          note: k.note,
        });
        await kmRepo.save(newRecord);
        kmInserted++;
      }
    }

    console.log('\n--- Seed Process Summary ---');
    console.log(
      `Vehicles: ${vehiclesInserted} inserted, ${vehiclesUpdated} updated.`,
    );
    console.log(
      `Electricity: ${elecInserted} inserted, ${elecUpdated} updated.`,
    );
    console.log(
      `Fuel Records: ${fuelInserted} inserted, ${fuelUpdated} updated, ${fuelSkipped} skipped.`,
    );
    console.log(
      `KM Records: ${kmInserted} inserted, ${kmUpdated} updated, ${kmSkipped} skipped.`,
    );
    console.log(`Invalid records skipped overall: ${invalidRowsSkipped}`);
    console.log('----------------------------\n');
  } catch (error) {
    console.error('Error during seeding process:', error);
  } finally {
    await dataSource.destroy();
    console.log('Database connection closed.');
  }
}

main().catch((err) => {
  console.error('Fatal seed script error:', err);
});
