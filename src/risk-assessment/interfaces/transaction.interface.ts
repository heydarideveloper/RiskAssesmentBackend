export interface Transaction {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  type: 'DEBIT' | 'CREDIT';
  channel: 'ONLINE' | 'ATM' | 'BRANCH' | 'POS';
  timestamp: Date;
  description: string;
  location?: string;
}
