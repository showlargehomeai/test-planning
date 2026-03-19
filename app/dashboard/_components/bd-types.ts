export interface Vendor {
  id: string;
  name: string;
  bdId: string;
  stage: string;
  startDate: string;
  productCount: number;
  serviceCount: number;
  notes: string;
}

export interface BD {
  id: string;
  name: string;
  avatar: string;
}

export interface Stage {
  id: string;
  label: string;
  color: string;
}

export interface VendorsData {
  stages: Stage[];
  bds: BD[];
  vendors: Vendor[];
  updatedAt: string;
}
