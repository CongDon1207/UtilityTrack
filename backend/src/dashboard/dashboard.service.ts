import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ElectricityRecordEntity } from '../electricity/electricity-record.entity';
import { FuelRecordEntity } from '../vehicles/fuel-record.entity';
import { VehicleKmRecordEntity } from '../vehicles/vehicle-km-record.entity';
import { VehicleEntity } from '../vehicles/vehicle.entity';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(ElectricityRecordEntity)
    private readonly electricityRecordsRepository: Repository<ElectricityRecordEntity>,
    @InjectRepository(VehicleEntity)
    private readonly vehiclesRepository: Repository<VehicleEntity>,
    @InjectRepository(VehicleKmRecordEntity)
    private readonly vehicleKmRecordsRepository: Repository<VehicleKmRecordEntity>,
    @InjectRepository(FuelRecordEntity)
    private readonly fuelRecordsRepository: Repository<FuelRecordEntity>,
  ) {}

  async getDashboardData(query: DashboardQueryDto) {
    const { year, month } = query;

    // Xác định khoảng thời gian cả năm để lấy dữ liệu vẽ biểu đồ xu hướng
    const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

    // Truy vấn dữ liệu thô song song để tối ưu hiệu năng
    const [vehicles, electricityRecords, kmRecords, fuelRecords] =
      await Promise.all([
        this.vehiclesRepository.find(),
        this.electricityRecordsRepository.find({
          where: { recordYear: year },
        }),
        this.vehicleKmRecordsRepository.find({
          where: { tripDate: Between(startDate, endDate) },
          relations: { vehicle: true },
        }),
        this.fuelRecordsRepository.find({
          where: { fuelDate: Between(startDate, endDate) },
          relations: { vehicle: true },
        }),
      ]);

    // Lọc dữ liệu theo kỳ được chọn (tháng hoặc năm) bằng JS/TS để dùng cho phần Summary & Table
    const electricityFiltered = month
      ? electricityRecords.filter((r) => r.recordMonth === month)
      : electricityRecords;

    const kmFiltered = month
      ? kmRecords.filter((r) => {
          const date = new Date(r.tripDate);
          return date.getUTCMonth() + 1 === month;
        })
      : kmRecords;

    const fuelFiltered = month
      ? fuelRecords.filter((r) => {
          const date = new Date(r.fuelDate);
          return date.getUTCMonth() + 1 === month;
        })
      : fuelRecords;

    // 1. Tính toán các chỉ số tổng quan (Overall Metrics)
    const totalElectricityKwh = electricityFiltered.reduce(
      (sum, r) => sum + Number(r.kwhUsed || 0),
      0,
    );
    const totalElectricityCost = electricityFiltered.reduce(
      (sum, r) => sum + Number(r.totalCost || 0),
      0,
    );

    const totalVehicleKm = kmFiltered.reduce(
      (sum, r) =>
        sum +
        (Number(r.arrivalOdometer || 0) - Number(r.departureOdometer || 0)),
      0,
    );

    const totalFuelLiters = fuelFiltered.reduce(
      (sum, r) => sum + Number(r.liters || 0),
      0,
    );
    const totalFuelCost = fuelFiltered.reduce(
      (sum, r) => sum + Number(r.unitPrice || 0) * Number(r.liters || 0),
      0,
    );

    const vehicleCostPerKm =
      totalVehicleKm > 0 ? totalFuelCost / totalVehicleKm : 0;
    const vehicleKmPerLiter =
      totalFuelLiters > 0 ? totalVehicleKm / totalFuelLiters : 0;

    const totalUtilityCost = totalElectricityCost + totalFuelCost;

    const overall = {
      electricity: {
        totalKwh: totalElectricityKwh,
        totalCost: totalElectricityCost,
      },
      vehicles: {
        totalKm: totalVehicleKm,
        totalLiters: totalFuelLiters,
        totalCost: totalFuelCost,
        costPerKm: vehicleCostPerKm,
        kmPerLiter: vehicleKmPerLiter,
      },
      totalUtilityCost,
    };

    // 2. Tính toán thống kê theo từng phương tiện (byVehicle)
    // Gom nhóm tất cả xe đang hoạt động và xe không hoạt động nhưng có dữ liệu trong kỳ lọc
    const vehicleMap = new Map<
      number,
      { id: number; name: string; isActive: number }
    >();
    for (const v of vehicles) {
      if (v.isActive === 1) {
        vehicleMap.set(v.id, { id: v.id, name: v.vehicleName, isActive: 1 });
      }
    }
    for (const r of kmFiltered) {
      if (!vehicleMap.has(r.vehicleId)) {
        const v = vehicles.find((x) => x.id === r.vehicleId);
        vehicleMap.set(r.vehicleId, {
          id: r.vehicleId,
          name: v?.vehicleName ?? `Vehicle #${r.vehicleId}`,
          isActive: v?.isActive ?? 0,
        });
      }
    }
    for (const r of fuelFiltered) {
      if (!vehicleMap.has(r.vehicleId)) {
        const v = vehicles.find((x) => x.id === r.vehicleId);
        vehicleMap.set(r.vehicleId, {
          id: r.vehicleId,
          name: v?.vehicleName ?? `Vehicle #${r.vehicleId}`,
          isActive: v?.isActive ?? 0,
        });
      }
    }

    const byVehicle = Array.from(vehicleMap.values()).map((v) => {
      const vKmRecords = kmFiltered.filter((r) => r.vehicleId === v.id);
      const vTotalKm = vKmRecords.reduce(
        (sum, r) =>
          sum +
          (Number(r.arrivalOdometer || 0) - Number(r.departureOdometer || 0)),
        0,
      );

      const vFuelRecords = fuelFiltered.filter((r) => r.vehicleId === v.id);
      const vTotalLiters = vFuelRecords.reduce(
        (sum, r) => sum + Number(r.liters || 0),
        0,
      );
      const vTotalCost = vFuelRecords.reduce(
        (sum, r) => sum + Number(r.unitPrice || 0) * Number(r.liters || 0),
        0,
      );

      const vCostPerKm = vTotalKm > 0 ? vTotalCost / vTotalKm : 0;
      const vKmPerLiter = vTotalLiters > 0 ? vTotalKm / vTotalLiters : 0;

      return {
        vehicleId: v.id,
        vehicleName: v.name,
        isActive: v.isActive,
        totalKm: vTotalKm,
        totalLiters: vTotalLiters,
        totalCost: vTotalCost,
        costPerKm: vCostPerKm,
        kmPerLiter: vKmPerLiter,
      };
    });

    // Sắp xếp danh sách xe theo tên tăng dần
    byVehicle.sort((a, b) => a.vehicleName.localeCompare(b.vehicleName));

    // 3. Tính toán xu hướng 12 tháng (monthlyTrend) của năm
    const monthlyTrend: any[] = [];
    for (let m = 1; m <= 12; m++) {
      const mElectricity = electricityRecords.filter(
        (r) => r.recordMonth === m,
      );
      const mKwh = mElectricity.reduce(
        (sum, r) => sum + Number(r.kwhUsed || 0),
        0,
      );
      const mElectricityCost = mElectricity.reduce(
        (sum, r) => sum + Number(r.totalCost || 0),
        0,
      );

      const mKmRecords = kmRecords.filter((r) => {
        const date = new Date(r.tripDate);
        return date.getUTCMonth() + 1 === m;
      });
      const mKm = mKmRecords.reduce(
        (sum, r) =>
          sum +
          (Number(r.arrivalOdometer || 0) - Number(r.departureOdometer || 0)),
        0,
      );

      const mFuelRecords = fuelRecords.filter((r) => {
        const date = new Date(r.fuelDate);
        return date.getUTCMonth() + 1 === m;
      });
      const mLiters = mFuelRecords.reduce(
        (sum, r) => sum + Number(r.liters || 0),
        0,
      );
      const mFuelCost = mFuelRecords.reduce(
        (sum, r) => sum + Number(r.unitPrice || 0) * Number(r.liters || 0),
        0,
      );

      monthlyTrend.push({
        month: m,
        electricityKwh: mKwh,
        electricityCost: mElectricityCost,
        vehicleKm: mKm,
        vehicleFuelLiters: mLiters,
        vehicleFuelCost: mFuelCost,
        totalUtilityCost: mElectricityCost + mFuelCost,
      });
    }

    return {
      year,
      month,
      overall,
      byVehicle,
      monthlyTrend,
    };
  }
}
