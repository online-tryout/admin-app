import { Transaction } from "@/models/model";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import TransactionRow from "./transaction-row";
import { FC, useEffect, useState } from "react";

interface TransactionListProps {
  transactions: Transaction[] | null;
  onRowClicked: (id: string) => void;
}

const TransactionList: FC<TransactionListProps> = ({
  transactions,
  onRowClicked,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [curTransactions, setCurTransactions] = useState<Transaction[] | null>(transactions);

  useEffect(() => {
    if (searchValue.trim().length) {
      let newTransaction = transactions?.filter((transaction) => {
        const sv = searchValue.toLowerCase();
        return transaction.tryout_name?.toLowerCase().includes(sv);
      });

      if (newTransaction) {
        setCurTransactions(newTransaction);
      }
    } else {
      setCurTransactions(transactions);
    }
  }, [searchValue, transactions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="relative shrink basis-0 grow-[40] border-x">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center px-4 py-2  h-[52px]">
          <h1 className="text-xl font-bold">Transactions</h1>
        </div>

        <div className="shrink-0 bg-border h-[1px] w-full"></div>

        <form className="p-4">
          <div className="relative">
            <div className="absolute top-1/2 left-3 -translate-y-1/2">
              <MagnifyingGlassIcon />
            </div>
            <input
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8"
              placeholder="Search by Tryout Name"
              onChange={(e) => setSearchValue(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </form>
      </div>
      <div
        className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 m-0"
        style={{ animationDuration: "0s" }}
      >
        <div
          className="relative h-full chat-container overflow-y-scroll max-h-[calc(100vh-120px)]"
          style={{ scrollbarColor: "#CFD8DC", scrollbarWidth: "thin" }}
        >
          <div className="w-full rounded-lg">
            <div className="min-w-full table">
              <div className="flex flex-col gap-2 p-4 pt-4">
                {curTransactions?.map((transaction) => (
                  <div
                    key={transaction.id}
                    onClick={() => onRowClicked(transaction.id)}
                  >
                    <TransactionRow transaction={transaction} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 m-0"></div>
    </div>
  );
};

TransactionList.displayName = "Transaction List";
export default TransactionList;
