
export enum RoomStatus {
  FREE = 'LIBRE',
  OCCUPIED_CLIENT = 'OCCUPÉE - CLIENT',
  OCCUPIED_RESIDENT = 'OCCUPÉE - RÉSIDENT',
  OCCUPIED_STAFF = 'OCCUPÉE - PERSONNEL',
  CLEANING = 'EN NETTOYAGE'
}

export enum OccupationType {
  SIESTE = 'Sieste',
  NUITEE = 'Nuitée',
  MONTHLY = 'Mensuel',
  STAFF = 'Personnel',
  EVENT = 'Évènement',
  RENTAL = 'Location Boutique'
}

export enum UnitType {
  ROOM = 'Chambre',
  SHOP = 'Boutique',
  EVENT_SPACE = 'Espace Évènementiel',
  GARDEN = 'Jardin'
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  GERANT = 'GERANT',
  PERSONNEL = 'PERSONNEL',
  CLIENT = 'CLIENT'
}

export interface GlobalSettings {
  currency: string;
  establishmentName: string;
}

export interface BarItem {
  id: string;
  name: string;
  category: string;
  purchasePriceBatch: number;
  batchSize: number;
  costPriceUnit: number;
  price: number;
  stockQuantity: number;
  minStockLevel: number;
  lastRestockDate?: number;
}

export interface Transaction {
  itemId: string;
  itemName: string;
  price: number;
  costPrice: number;
  quantity: number;
  timestamp: number;
}

export interface Room {
  id: number;
  number: string;
  name?: string;
  type: UnitType;
  status: RoomStatus;
  occupantName?: string;
  occupationType?: OccupationType;
  checkInDate?: number;
  monthlyRate?: number;
  blockId?: string;
  subGroupId?: string;
  barBill: Transaction[];
}

export interface HistoryEvent {
  id: string;
  timestamp: number;
  type: 'CHECK_IN' | 'CHECK_OUT' | 'BAR_SALE' | 'STATUS_CHANGE' | 'PAYMENT' | 'RESTOCK' | 'CONFIG_CHANGE' | 'SECURITY_ALERT';
  description: string;
  roomId?: number;
  amount?: number;
  user: string;
  checksum?: string;
}

export interface Block {
  id: string;
  name: string;
  hourlyPrice: number;
  monthlyPrice: number;
}

export interface SubGroup {
  id: string;
  name: string;
  blockId?: string;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  contact: string;
  photoUrl?: string;
  cniScanUrl?: string;
  isValidated: boolean;
}

export interface Booking {
  id: string;
  roomId: number;
  occupantName: string;
  type: OccupationType;
  startDate: number;
  endDate: number;
  amount?: number;
}
