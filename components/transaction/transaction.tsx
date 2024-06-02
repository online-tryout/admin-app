"use client";

import { FC } from "react";
import TransactionList from "./list/transaction-list";
import TransactionDetail from "./detail/transaction-detail";
import React from "react";

interface TransactionProps {
}

const Transaction: FC<TransactionProps> = () => {
  return (
    <>
      <TransactionList />
      <TransactionDetail />
    </>
  );
};

Transaction.displayName = "Transaction";
export default Transaction;
