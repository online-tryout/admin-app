export interface User {
  avatar: string;
  created_at: string;
  email: string;
  uid: string;
  name: string;
  provider: string;
}

export interface History {
  id: string;
  latest_content: string;
  latest_created_at: string;
  receiver_name: string;
  receiver_uid: string;
  sender_name: string;
  sender_uid: string;
}

export interface Chat {
  content: string;
  created_at: string;
  id: string;
  receiver: User;
  receiver_uid: string;
  sender: User;
  sender_uid: string;
}

export interface Option {
  id: string;
  content: string;
  isTrue: boolean;
  optionOrder: number;
}

export interface Question {
  id: string;
  content: string;
  questionOrder: number;
  options: Option[];
}

export interface Module {
  id: string;
  title: string;
  moduleOrder: number;
  questions: Question[];
}

export interface Tryout {
  id: string;
  title: string;
  price: number;
  status: string;
  startedAt: string;
  endedAt: string;
  modules: Module[];
}

export interface Transaction {
  id: string;
  tryout_id: string;
  tryout_name: string | null;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  bank: string | null;
  account_number: string | null;
  proof: string | null;
}

export interface TransactionDetail {
  bank: string;
  account_number: string;
  tryout_name: string;
}