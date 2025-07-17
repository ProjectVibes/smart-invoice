export interface User {
  id: string;
  email: string;
}

export interface AuthFormData {
  email: string;
  password: string;
}

export interface Invoice {
  id: string;
  customer: string;
  total: number;
  due_date: string;
  is_paid: "paid" | "unpaid";
  created_at: string;
}

export interface InvoiceItem {
  description: string;
  price: number;
}

export interface InvoiceFormData {
  customer: string;
  email: string;
  items: InvoiceItem[];
  total: number;
  due_date: string;
  coupon_code?: string;
  is_paid: boolean;
}
