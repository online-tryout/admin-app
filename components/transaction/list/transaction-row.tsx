import { Transaction } from "@/models/model";
import { formatIsoDate } from "@/utils/formatIsoDate";
import { FC } from "react";

interface TransactionListRowProps {
  transaction: Transaction
}

const TransactionRow: FC<TransactionListRowProps> = ({ transaction }) => {
  return (
    <div className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent bg-[#FFF] cursor-pointer">
        <div>
          <p className="font-semibold">{transaction.id}</p>
          <p>{transaction.tryout_name}</p>
        </div>

        <div className="flex justify-between w-full">
          <div className="text-xs text-foreground">
            {formatIsoDate(transaction.created_at)}
          </div>
          <div className="text-xs text-foreground">
              {transaction?.status === "pending" && (<p>Needs Approval</p>)}
              {transaction?.status === "approved" && (<p className="text-green-700">Approved</p>)}
              {transaction?.status === "rejected" && (<p className="text-red-700">Rejected</p>)}
          </div>
        </div>
    </div>
  );
};

TransactionRow.displayName = "Transaction Row";
export default TransactionRow;
