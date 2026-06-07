export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  totalCapacity: number;
  bookedCount: number;
  remainingCount: number;
}

export interface Visitor {
  id: string;
  name: string;
  idCard: string;
  idCardType: 'id_card' | 'passport' | 'other';
  isVerified: boolean;
  isAbsent: boolean;
  hasIdCard: boolean;
}

export interface Guide {
  id: string;
  name: string;
  phone: string;
  guideLicense: string;
  isConfirmed: boolean;
}

export interface TravelAgency {
  id: string;
  name: string;
  contactPerson: string;
  contactPhone: string;
}

export type TeamStatus = 'pending' | 'verified' | 'partial' | 'cancelled';

export interface TeamOrder {
  id: string;
  orderNo: string;
  agency: TravelAgency;
  guide: Guide;
  timeSlot: TimeSlot;
  visitDate: string;
  totalVisitors: number;
  verifiedCount: number;
  absentCount: number;
  visitors: Visitor[];
  isOverCapacity: boolean;
  missingIdCardCount: number;
  status: TeamStatus;
  createTime: string;
}

export interface GateStatus {
  id: string;
  name: string;
  isOnline: boolean;
  todayPassengerCount: number;
  currentQueueLength: number;
}

export interface RefundRecord {
  id: string;
  orderId: string;
  type: 'refund' | 'change';
  operator: string;
  reason: string;
  operateTime: string;
}

export type UserRole = 'ticket' | 'gate';
