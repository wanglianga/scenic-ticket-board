import type { TeamOrder, TimeSlot, RefundRecord, MissingDocInfo, SplitBatch, Visitor } from '../types';

const agencies = [
  { id: 'a1', name: '阳光旅行社', contactPerson: '张经理', contactPhone: '13800138001' },
  { id: 'a2', name: '快乐假期', contactPerson: '李主管', contactPhone: '13800138002' },
  { id: 'a3', name: '环球旅游', contactPerson: '王总', contactPhone: '13800138003' },
  { id: 'a4', name: '山水之旅', contactPerson: '赵经理', contactPhone: '13800138004' },
  { id: 'a5', name: '锦绣前程', contactPerson: '刘主任', contactPhone: '13800138005' },
];

const timeSlots: TimeSlot[] = [
  { id: 's1', startTime: '08:00', endTime: '09:30', totalCapacity: 200, bookedCount: 180, remainingCount: 20 },
  { id: 's2', startTime: '09:30', endTime: '11:00', totalCapacity: 200, bookedCount: 210, remainingCount: -10 },
  { id: 's3', startTime: '11:00', endTime: '12:30', totalCapacity: 200, bookedCount: 150, remainingCount: 50 },
  { id: 's4', startTime: '13:30', endTime: '15:00', totalCapacity: 200, bookedCount: 195, remainingCount: 5 },
  { id: 's5', startTime: '15:00', endTime: '16:30', totalCapacity: 200, bookedCount: 120, remainingCount: 80 },
  { id: 's6', startTime: '16:30', endTime: '18:00', totalCapacity: 200, bookedCount: 80, remainingCount: 120 },
];

function generateVisitors(count: number, verifiedCount: number, missingIdCard: number, missingChildStatement: number = 0, missingPassport: number = 0): Visitor[] {
  const visitors: Visitor[] = [];
  const surnames = ['王', '李', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴'];
  const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛'];

  for (let i = 0; i < count; i++) {
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    
    let hasId = true;
    let idCardType: Visitor['idCardType'] = 'id_card';
    let missingDocType: Visitor['missingDocType'] = 'none';
    
    if (i >= count - missingIdCard - missingChildStatement - missingPassport) {
      if (i >= count - missingPassport) {
        hasId = false;
        idCardType = 'passport';
        missingDocType = 'passport';
      } else if (i >= count - missingPassport - missingChildStatement) {
        hasId = false;
        idCardType = 'child_statement';
        missingDocType = 'child_statement';
      } else {
        hasId = false;
        idCardType = 'id_card';
        missingDocType = 'id_card';
      }
    }
    
    visitors.push({
      id: `v${Date.now()}${i}`,
      name: surname + name,
      idCard: hasId ? `110101199${Math.floor(Math.random() * 9)}${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}` : '',
      idCardType,
      isVerified: i < verifiedCount,
      isAbsent: false,
      hasIdCard: hasId,
      missingDocType,
    });
  }
  return visitors;
}

function generateMissingDocs(visitors: Visitor[]): MissingDocInfo[] {
  return visitors
    .filter(v => !v.hasIdCard && v.missingDocType && v.missingDocType !== 'none')
    .map(v => ({
      visitorId: v.id,
      visitorName: v.name,
      missingType: v.missingDocType! as 'id_card' | 'child_statement' | 'passport',
      isSupplied: false,
    }));
}

function generateGuide(confirmed: boolean) {
  const names = ['导游小王', '导游小李', '导游小张', '导游小刘', '导游小陈'];
  return {
    id: `g${Date.now()}`,
    name: names[Math.floor(Math.random() * names.length)],
    phone: `139${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    guideLicense: `D${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
    isConfirmed: confirmed,
  };
}

export const mockTimeSlots = timeSlots;

export const mockTeams: TeamOrder[] = [
  {
    id: 't1',
    orderNo: 'TM20240606001',
    agency: agencies[0],
    guide: generateGuide(true),
    timeSlot: timeSlots[0],
    visitDate: new Date().toISOString().split('T')[0],
    totalVisitors: 45,
    verifiedCount: 45,
    absentCount: 0,
    visitors: generateVisitors(45, 45, 0),
    isOverCapacity: false,
    missingIdCardCount: 0,
    substitutes: [],
    canVerify: true,
    status: 'verified',
    createTime: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 't2',
    orderNo: 'TM20240606002',
    agency: agencies[1],
    guide: generateGuide(true),
    timeSlot: timeSlots[0],
    visitDate: new Date().toISOString().split('T')[0],
    totalVisitors: 35,
    verifiedCount: 30,
    absentCount: 2,
    visitors: generateVisitors(35, 30, 1, 0, 0),
    isOverCapacity: false,
    missingIdCardCount: 1,
    missingDocs: generateMissingDocs(generateVisitors(35, 30, 1, 0, 0)),
    supplementDeadline: new Date(Date.now() + 86400000).toISOString(),
    substitutes: [],
    canVerify: false,
    status: 'pending_docs',
    createTime: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 't3',
    orderNo: 'TM20240606003',
    agency: agencies[2],
    guide: generateGuide(false),
    timeSlot: timeSlots[1],
    visitDate: new Date().toISOString().split('T')[0],
    totalVisitors: 55,
    verifiedCount: 0,
    absentCount: 0,
    visitors: generateVisitors(55, 0, 2, 1, 0),
    isOverCapacity: true,
    overCapacityInfo: {
      overCount: 15,
      availableSlots: [timeSlots[2], timeSlots[4]],
      isSplitConfirmed: false,
    },
    missingIdCardCount: 3,
    missingDocs: generateMissingDocs(generateVisitors(55, 0, 2, 1, 0)),
    substitutes: [],
    canVerify: false,
    status: 'pending',
    createTime: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 't4',
    orderNo: 'TM20240606004',
    agency: agencies[3],
    guide: generateGuide(true),
    timeSlot: timeSlots[1],
    visitDate: new Date().toISOString().split('T')[0],
    totalVisitors: 40,
    verifiedCount: 0,
    absentCount: 0,
    visitors: generateVisitors(40, 0, 0),
    isOverCapacity: false,
    missingIdCardCount: 0,
    substitutes: [],
    canVerify: true,
    status: 'pending',
    createTime: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 't5',
    orderNo: 'TM20240606005',
    agency: agencies[4],
    guide: generateGuide(true),
    timeSlot: timeSlots[2],
    visitDate: new Date().toISOString().split('T')[0],
    totalVisitors: 25,
    verifiedCount: 0,
    absentCount: 0,
    visitors: generateVisitors(25, 0, 0),
    isOverCapacity: false,
    missingIdCardCount: 0,
    substitutes: [],
    canVerify: true,
    status: 'pending',
    createTime: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 't6',
    orderNo: 'TM20240606006',
    agency: agencies[0],
    guide: generateGuide(true),
    timeSlot: timeSlots[3],
    visitDate: new Date().toISOString().split('T')[0],
    totalVisitors: 60,
    verifiedCount: 0,
    absentCount: 0,
    visitors: generateVisitors(60, 0, 3, 1, 1),
    isOverCapacity: true,
    overCapacityInfo: {
      overCount: 20,
      availableSlots: [timeSlots[4], timeSlots[5]],
      isSplitConfirmed: true,
    },
    splitBatches: [
      {
        batchNo: 1,
        timeSlot: timeSlots[3],
        visitorCount: 40,
        visitorIds: generateVisitors(60, 0, 3, 1, 1).slice(0, 40).map(v => v.id),
        isConfirmed: true,
      },
      {
        batchNo: 2,
        timeSlot: timeSlots[4],
        visitorCount: 20,
        visitorIds: generateVisitors(60, 0, 3, 1, 1).slice(40).map(v => v.id),
        isConfirmed: true,
      },
    ],
    missingIdCardCount: 5,
    missingDocs: generateMissingDocs(generateVisitors(60, 0, 3, 1, 1)),
    supplementDeadline: new Date(Date.now() + 172800000).toISOString(),
    substitutes: [],
    canVerify: false,
    status: 'pending_docs',
    createTime: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 't7',
    orderNo: 'TM20240606007',
    agency: agencies[1],
    guide: generateGuide(true),
    timeSlot: timeSlots[4],
    visitDate: new Date().toISOString().split('T')[0],
    totalVisitors: 30,
    verifiedCount: 0,
    absentCount: 0,
    visitors: generateVisitors(30, 0, 0),
    isOverCapacity: false,
    missingIdCardCount: 0,
    substitutes: [],
    canVerify: true,
    status: 'pending',
    createTime: new Date().toISOString(),
  },
  {
    id: 't8',
    orderNo: 'TM20240606008',
    agency: agencies[2],
    guide: generateGuide(true),
    timeSlot: timeSlots[1],
    visitDate: new Date().toISOString().split('T')[0],
    totalVisitors: 70,
    verifiedCount: 0,
    absentCount: 0,
    visitors: generateVisitors(70, 0, 0),
    isOverCapacity: true,
    overCapacityInfo: {
      overCount: 30,
      availableSlots: [timeSlots[2], timeSlots[3], timeSlots[4]],
      isSplitConfirmed: false,
    },
    missingIdCardCount: 0,
    substitutes: [],
    canVerify: true,
    status: 'pending',
    createTime: new Date(Date.now() - 300000).toISOString(),
  },
];

export const mockRefundRecords: RefundRecord[] = [
  {
    id: 'r1',
    orderId: 't1',
    type: 'change',
    operator: '票务员-张三',
    reason: '游客临时增加5人',
    operateTime: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'r2',
    orderId: 't2',
    type: 'refund',
    operator: '票务员-李四',
    reason: '2名游客身体不适取消行程',
    operateTime: new Date(Date.now() - 1800000).toISOString(),
  },
];
