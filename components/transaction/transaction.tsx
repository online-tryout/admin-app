"use client";

import { FC, useState } from "react";
import TransactionList from "./list/transaction-list";
import TransactionDetail from "./detail/transaction-detail";
import React from "react";
import { Transaction } from "@/models/model";

interface TransactionProps {
  transactions: Transaction[];
}

const Transactions: FC<TransactionProps> = ({transactions}) => {
  const [curTransaction, setCurTransaction] = useState<Transaction[] | null>(transactions);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);

  const rowClickedHandler = async (id: string) => {
    setActiveTransaction(transactions.filter((to) => to.id === id)?.[0]);
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
