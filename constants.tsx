
import { RoomStatus, BarItem, Room, UnitType } from './types';

export const INITIAL_BAR_ITEMS: BarItem[] = [
  // --- BIÈRES (Classiques Camerounais) ---
  { 
    id: 'b1', name: 'Kadji Beer', category: 'Bière',
    purchasePriceBatch: 16800, batchSize: 24, costPriceUnit: 700, price: 1500,
    stockQuantity: 48, minStockLevel: 12, lastRestockDate: Date.now()
  },
  { 
    id: 'b2', name: 'Castel Beer 65cl', category: 'Bière',
    purchasePriceBatch: 15600, batchSize: 12, costPriceUnit: 1300, price: 2000,
    stockQuantity: 36, minStockLevel: 12, lastRestockDate: Date.now()
  },
  { 
    id: 'b3', name: 'Beaufort Lager', category: 'Bière',
    purchasePriceBatch: 18000, batchSize: 24, costPriceUnit: 750, price: 1500,
    stockQuantity: 72, minStockLevel: 24, lastRestockDate: Date.now()
  },
  { 
    id: 'b4', name: 'Guinness Smooth', category: 'Bière',
    purchasePriceBatch: 21600, batchSize: 24, costPriceUnit: 900, price: 2000,
    stockQuantity: 48, minStockLevel: 12, lastRestockDate: Date.now()
  },
  { 
    id: 'b5', name: 'Mutzig', category: 'Bière',
    purchasePriceBatch: 18000, batchSize: 24, costPriceUnit: 750, price: 1500,
    stockQuantity: 48, minStockLevel: 12, lastRestockDate: Date.now()
  },
  { 
    id: 'b6', name: 'Heineken 33cl', category: 'Bière',
    purchasePriceBatch: 24000, batchSize: 24, costPriceUnit: 1000, price: 2500,
    stockQuantity: 48, minStockLevel: 12, lastRestockDate: Date.now()
  },

  // --- JUS CASSABLE (Verre consignés / UCB / SABC) ---
  { 
    id: 'jc1', name: 'Special UCB Pamplemousse', category: 'Jus Cassable',
    purchasePriceBatch: 9600, batchSize: 24, costPriceUnit: 400, price: 1000,
    stockQuantity: 48, minStockLevel: 12, lastRestockDate: Date.now()
  },
  { 
    id: 'jc2', name: 'Top Pamplemousse', category: 'Jus Cassable',
    purchasePriceBatch: 8400, batchSize: 24, costPriceUnit: 350, price: 800,
    stockQuantity: 48, minStockLevel: 12, lastRestockDate: Date.now()
  },
  { 
    id: 'jc3', name: 'Top Grenadine', category: 'Jus Cassable',
    purchasePriceBatch: 8400, batchSize: 24, costPriceUnit: 350, price: 800,
    stockQuantity: 24, minStockLevel: 12, lastRestockDate: Date.now()
  },
  { 
    id: 'jc4', name: 'Vimto Verre', category: 'Jus Cassable',
    purchasePriceBatch: 10800, batchSize: 24, costPriceUnit: 450, price: 1000,
    stockQuantity: 24, minStockLevel: 6, lastRestockDate: Date.now()
  },

  // --- JUS BOUTEILLES (PET / Plastique / Eaux) ---
  { 
    id: 'jb1', name: 'Coca-Cola 50cl', category: 'Jus Bouteilles',
    purchasePriceBatch: 7200, batchSize: 12, costPriceUnit: 600, price: 1000,
    stockQuantity: 24, minStockLevel: 6, lastRestockDate: Date.now()
  },
  { 
    id: 'jb2', name: 'Fanta Orange 50cl', category: 'Jus Bouteilles',
    purchasePriceBatch: 7200, batchSize: 12, costPriceUnit: 600, price: 1000,
    stockQuantity: 24, minStockLevel: 6, lastRestockDate: Date.now()
  },
  { 
    id: 'jb3', name: 'Eau Minérale 1.5L', category: 'Jus Bouteilles',
    purchasePriceBatch: 3000, batchSize: 6, costPriceUnit: 500, price: 1000,
    stockQuantity: 30, minStockLevel: 12, lastRestockDate: Date.now()
  },

  // --- VINS ---
  { 
    id: 'v1', name: 'Merlot (Bouteille)', category: 'Vins',
    purchasePriceBatch: 30000, batchSize: 6, costPriceUnit: 5000, price: 12000,
    stockQuantity: 12, minStockLevel: 2, lastRestockDate: Date.now()
  },
  { 
    id: 'v2', name: 'Chardonnay (Verre)', category: 'Vins',
    purchasePriceBatch: 24000, batchSize: 12, costPriceUnit: 2000, price: 5000,
    stockQuantity: 12, minStockLevel: 4, lastRestockDate: Date.now()
  },

  // --- WYSKI (Spiritueux & Forts) ---
  { 
    id: 'w1', name: 'K$$ (K-Drink)', category: 'Wyski',
    purchasePriceBatch: 15000, batchSize: 10, costPriceUnit: 1500, price: 3000,
    stockQuantity: 20, minStockLevel: 5, lastRestockDate: Date.now()
  },
  { 
    id: 'w2', name: 'Jack Daniels (Shot)', category: 'Wyski',
    purchasePriceBatch: 45000, batchSize: 15, costPriceUnit: 3000, price: 7000,
    stockQuantity: 15, minStockLevel: 3, lastRestockDate: Date.now()
  },
  { 
    id: 'w3', name: 'Black Label (Shot)', category: 'Wyski',
    purchasePriceBatch: 52500, batchSize: 15, costPriceUnit: 3500, price: 8000,
    stockQuantity: 15, minStockLevel: 3, lastRestockDate: Date.now()
  }
];

export const INITIAL_ROOMS: Room[] = [
  { id: 1, number: '101', name: 'Chambre Standard', type: UnitType.ROOM, status: RoomStatus.FREE, barBill: [] },
  { id: 2, number: '102', name: 'Chambre Standard', type: UnitType.ROOM, status: RoomStatus.FREE, barBill: [] },
  { id: 3, number: '103', name: 'Suite Junior', type: UnitType.ROOM, status: RoomStatus.FREE, barBill: [] },
  { id: 4, number: '104', name: 'Chambre Staff', type: UnitType.ROOM, status: RoomStatus.FREE, barBill: [] },
  { id: 5, number: '105', name: 'Suite Terracotta', type: UnitType.ROOM, status: RoomStatus.FREE, barBill: [] },
];

export const STATUS_COLORS = {
  [RoomStatus.FREE]: 'bg-green-100 text-green-700 border-green-200',
  [RoomStatus.OCCUPIED_CLIENT]: 'bg-orange-100 text-orange-700 border-orange-200',
  [RoomStatus.OCCUPIED_RESIDENT]: 'bg-blue-100 text-blue-700 border-blue-200',
  [RoomStatus.OCCUPIED_STAFF]: 'bg-gray-100 text-gray-700 border-gray-200',
  [RoomStatus.CLEANING]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

export const STATUS_DOTS = {
  [RoomStatus.FREE]: 'bg-green-500',
  [RoomStatus.OCCUPIED_CLIENT]: 'bg-orange-500',
  [RoomStatus.OCCUPIED_RESIDENT]: 'bg-blue-500',
  [RoomStatus.OCCUPIED_STAFF]: 'bg-gray-500',
  [RoomStatus.CLEANING]: 'bg-yellow-500',
};
