"use server";

import { Transaction, TransactionDetail } from "@/models/model";
import { serverAxios } from "@/utils/axios";
import { cookies } from "next/headers";

export async function getTransactions(): Promise<Transaction[]> {
  "use server";
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const { data } = await serverAxios.get<Transaction[]>("/api/payment/transactions", { 
      headers: { Authorization: `Bearer ${accessToken}` } 
    });
    for (const transaction of data) {
      const response = await serverAxios.get<TransactionDetail>(`/api/payment/transaction/detail/${transaction.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const detailData = response.data;
      transaction.bank = detailData.bank;
      transaction.account_number = detailData.account_number;
      transaction.tryout_name = detailData.tryout_name;
    }

    return data;

  } catch (error) {
    throw error;
  }
}

export async function getTransactionProof(transactionId: string): Promise<string> {
  "use server";
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const { data } = await serverAxios.get(`/api/payment/proof/${transactionId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: "arraybuffer",
    });
    
    const base64 = btoa(
      new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
    return `data:image/png;base64,${base64}`;

  } catch (error) {
    throw error;
  }
}

export async function approveTransaction(transaction: Transaction): Promise<Transaction> {
  "use server";
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const { data } = await serverAxios.post<Transaction>(`/api/payment/approve/${transaction.id}`, {}, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    data.bank = transaction.bank;
    data.account_number = transaction.account_number;
    data.tryout_name = transaction.tryout_name;
    return data;

  } catch (error) {
    throw error;
  }
}

export async function rejectTransaction(transaction: Transaction): Promise<Transaction> {
  "use server";
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const { data } = await serverAxios.post<Transaction>(`/api/payment/reject/${transaction.id}`, {}, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    data.bank = transaction.bank;
    data.account_number = transaction.account_number;
    data.tryout_name = transaction.tryout_name;
    return data;

  } catch (error) {
    throw error;
  }
}
