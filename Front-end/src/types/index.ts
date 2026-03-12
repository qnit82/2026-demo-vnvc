export interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
  token: string;
}

export interface Customer {
  id: string;
  pid: string;
  fullName: string;
  dob: string;
  gender: string;
  phone?: string;
  address?: string;
  email?: string;
}

export interface Vaccine {
  vaccineId: string;
  vaccineName: string;
  price: number;
  lotNumber?: string;
  expiryDate?: string;
  usageCount?: number;
}

export interface ScreeningVisit extends Customer {
  visitId: string;
  checkInTime: string;
  hasScreeningResult: boolean;
  temperature?: number;
  weight?: number;
  height?: number;
  heartRate?: number;
  respiratoryRate?: number;
  bloodPressure?: string;
  clinicalAssessment?: string;
  isEligible?: boolean;
  doctorNote?: string;
  medicalHistory?: string;
  preSelectedVaccines: Vaccine[];
}

export interface InvoiceItem {
  vaccineName: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  visitId: string;
  fullName: string;
  pid: string;
  phone: string;
  paymentStatus: number;
  totalAmount: number;
  items: InvoiceItem[];
}

export interface Commune {
  code: string;
  name: string;
  provinceName: string;
  administrativeLevel: string;
}

export interface PaymentQueueItem {
  visitId: string;
  pid: string;
  fullName: string;
  dob: string;
  gender: string;
  totalAmount: number;
  requestTime: string;
}

export interface VaccineBatch {
  batchId: string;
  batchNumber: string;
  expiryDate: string;
  quantityInStock: number;
}

export interface PrescribedVaccine {
  prescriptionId: string;
  vaccineId: string;
  vaccineName: string;
  doseNumber: number;
  isInjected: boolean;
  availableBatches: VaccineBatch[];
}

export interface InjectionQueueItem {
  visitId: string;
  pid: string;
  fullName: string;
  dob: string;
  gender: string;
  screeningTime: string;
  doctorNote: string;
}

export interface InjectionDetail extends InjectionQueueItem {
  prescribedVaccines: PrescribedVaccine[];
}

export interface VaccineInventory {
  id: string;
  name: string;
  description: string;
  totalStock: number;
  price: number;
  batches: VaccineBatch[];
}

export interface ReportOverview {
  totalRevenue: number;
  totalVisits: number;
  totalInjections: number;
  adverseReactionRate: number;
}

export interface RevenueChartPoint {
  date: string;
  amount: number;
}

export interface TopVaccineUsage {
  vaccineId: string;
  vaccineName: string;
  usageCount: number;
}

export interface FunnelData {
  registered: number;
  screened: number;
  paid: number;
  injected: number;
}

export interface VisitDetail {
  visitId: number;
  vaccineId: number;
  pid: string;
  fullName: string;
  dob: string;          // ISO date string
  gender: string;
  screeningTime: string; // ISO datetime string
  doctorNote: string;
}