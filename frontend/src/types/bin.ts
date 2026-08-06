export interface Bin {
  id?: string;
  binCode: string;
  location: string;
  fillLevel: 'Empty' | 'Half Full' | 'Full' | 'Overflowing' | string;
  status: 'ACTIVE' | 'UNDER_MAINTENANCE' | string;
}