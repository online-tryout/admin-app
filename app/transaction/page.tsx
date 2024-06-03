import Transaction from "@/components/transaction/transaction";
import { getTransactions } from "./action";

export default async function TransactionPage() {
  const transactions = await getTransactions();

  return <Transaction transactions={transactions} />;
}
