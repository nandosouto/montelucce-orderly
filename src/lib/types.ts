
export type Order = {
  id: string;
  customerName: string;
  email: string;
  cpf: string;
  zipCode: string;
  address: string;
  addressNumber: string;
  addressComplement?: string;
  productPrice: number;
  productBrand: string;
  shippingCost: number;
  date: Date;
  calculatedProfit?: number;
  productCost?: number;
  sellingPrice?: number;
};

export type PeriodFilter = 
  | 'today' 
  | 'yesterday' 
  | 'last7days' 
  | 'last30days' 
  | 'last3months' 
  | 'last6months' 
  | 'lastyear';

export type DashboardMetric = {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
};
