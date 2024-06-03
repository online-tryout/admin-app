"use client";

import { FC, useEffect, useState } from "react";
import TransactionList from "./list/transaction-list";
import TransactionDetail from "./detail/transaction-detail";
import React from "react";
import { Transaction } from "@/models/model";
import { useToast } from "@/components/ui/use-toast";

interface TransactionProps {
  transactions: Transaction[];
}

const useWebSocket = (url: string) => {
  const [latestTransaction, setLatestTransaction] = useState<Transaction>();

  useEffect(() => {
      const socket = new WebSocket(url);

      socket.onopen = () => console.log('WebSocket connected');
      socket.onmessage = (event) => setLatestTransaction(JSON.parse(event.data));
      socket.onclose = () => console.log('WebSocket disconnected');
      return () => socket.close();
  }, [url]);

  return latestTransaction;
};


const Transactions: FC<TransactionProps> = ({transactions}) => {
  const [curTransaction, setCurTransaction] = useState<Transaction[] | null>(transactions);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);

  const { toast } = useToast();
  const ip = process.env.NEXT_PUBLIC_CONTAINER_BACKEND;
  const wsUrl = ip ? ip.replace(/^http/, 'ws').replace(/^https/, 'wss') : 'ws://localhost:8000';
  const latestTransaction = useWebSocket(`${wsUrl}/api/payment/ws/`);

  useEffect(() => {
    if (latestTransaction) {
      toast({
        title: "New Transaction",
        description: `ID: ${latestTransaction.id}`,
        duration: 5000,
      });
      setCurTransaction((prevTransactions) => {
        if (prevTransactions) {
          return [latestTransaction, ...prevTransactions];
        }
        return prevTransactions;
      });
    }
  }, [latestTransaction]);

  const rowClickedHandler = async (id: string) => {
    if (curTransaction) {
      setActiveTransaction(curTransaction.filter((to) => to.id === id)?.[0]);
    }
  };

  const handleTransactionUpdate = (updatedTransaction: Transaction) => {
    setCurTransaction((prevTransactions) => {
      if (prevTransactions) {
        return prevTransactions.map((transaction) => transaction.id === updatedTransaction.id ? updatedTransaction : transaction)
      }
      return prevTransactions;
    });
  };

  return (
    <>
      <TransactionList
        transactions={curTransaction}
        onRowClicked={rowClickedHandler}
      />
      <TransactionDetail transaction={activeTransaction} onTransactionUpdate={handleTransactionUpdate} />
    </>
  );
};

Transactions.displayName = "Transaction";
export default Transactions;
