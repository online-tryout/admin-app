import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { Transaction } from "@/models/model";
import { formatIsoDate } from "@/utils/formatIsoDate";
import { approveTransaction, getTransactionProof, rejectTransaction } from "@/app/transaction/action";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CheckIcon, Cross1Icon, QuestionMarkIcon } from "@radix-ui/react-icons";

interface TransactionDetailProps {
  transaction: Transaction | null;
  onTransactionUpdate?: (transaction: Transaction) => void;
}

const TransactionDetail: FC<TransactionDetailProps> = ({ transaction, onTransactionUpdate }) => {
  const [image, setImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(transaction);

  useEffect(() => {
    if (transaction) {
      setCurrentTransaction(transaction);
    }
  }, [transaction]);

  useEffect(() => {
    setImage(null);
    if (currentTransaction?.proof) {
      setImage(currentTransaction.proof);
    } else if (currentTransaction) {
      const fetchImage = async () => {
        const imageUrl = await getTransactionProof(currentTransaction?.id ?? "");
        if (currentTransaction) {
          currentTransaction.proof = imageUrl;
        }
        setImage(imageUrl);
      };
      fetchImage();
    }
  }, [currentTransaction]);

  const handleApprove = async () => {
    if (currentTransaction) {
      const currentTransactionCopy = { ...currentTransaction };
      currentTransactionCopy.proof = null;
      const responseTransaction = await approveTransaction(currentTransactionCopy);
      setCurrentTransaction(responseTransaction);
      onTransactionUpdate?.(responseTransaction);
      setOpen(false);
    }
  };

  const handleReject = async () => {
    if (currentTransaction) {
      const currentTransactionCopy = { ...currentTransaction };
      currentTransactionCopy.proof = null;
      const responseTransaction = await rejectTransaction(currentTransactionCopy);
      setCurrentTransaction(responseTransaction);
      onTransactionUpdate?.(responseTransaction);
      setOpen(false);
    }
  };

  const transactionDetail = () => (
    <div
      className="h-[calc(100vh-52px)] overflow-y-scroll flex gap-4 flex-col items-center justify-center px-4"
      style={{ scrollbarColor: "#CFD8DC #FFF", scrollbarWidth: "thin" }}
    >
      <div className="flex flex-col items-center">
        <div className="text-4xl font-bold">{currentTransaction?.tryout_name}</div>
        <div>{currentTransaction?.id ?? ""}</div>
      </div>

      <div className="w-full px-16">
        <div className="flex justify-between w-full">
          <p>Price</p>
          <p>Rp. {currentTransaction?.amount.toLocaleString() ?? ""}</p>
        </div>
        <div className="flex justify-between w-full">
          <p>Bank</p>
          <p>{currentTransaction?.bank ?? ""}</p>
        </div>
        <div className="flex justify-between w-full">
          <p>Account Number</p>
          <p>{currentTransaction?.account_number ?? ""}</p>
        </div>
        <div className="flex justify-between w-full">
          <p>Status</p>
          {currentTransaction?.status === "pending" && (
            <p>Needs Approval</p>
          )}
          {currentTransaction?.status === "approved" && (
            <p className="text-green-700">Approved</p>
          )}
          {currentTransaction?.status === "rejected" && (
            <p className="text-red-700">Rejected</p>
          )}
        </div>
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          View Proof
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              {currentTransaction?.status === "pending" && (<QuestionMarkIcon width="20" height="20" />)}
              {currentTransaction?.status === "approved" && (<CheckIcon color="green" width="20" height="20" />)}
              {currentTransaction?.status === "rejected" && (<Cross1Icon color="red" width="20" height="20" />)}
              
              <p>{currentTransaction?.id}</p>
            </DialogTitle>
            <DialogDescription className="flex justify-between text-base">
              <span>{currentTransaction?.account_number} ({currentTransaction?.bank})</span>
              <span>Rp. {currentTransaction?.amount.toLocaleString()}</span>
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[600px] max-w-[800px] h-full w-full">
              {image ? (
                  <div className="h-full">
                    <img src={image} alt="Transaction Proof" className="w-full h-full" />
                  </div>
                )
              : (
                <div className="flex justify-center items-center h-full">
                  Loading...
                </div>
              )}
          </ScrollArea>
          <DialogFooter>
            <div className="flex gap-4">
              <Button variant="destructive" onClick={handleReject}>
                Reject
              </Button>
              <Button onClick={handleApprove}>
                Approve
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between w-full px-16">
        <div className="text-sm test-start">
          <p>Creation</p>
          <p>{formatIsoDate(currentTransaction?.created_at ?? "")}</p>
        </div>
        <div className="text-sm text-end">
          <p>Last Modified</p>
          <p>{formatIsoDate(currentTransaction?.updated_at ?? "")}</p>
        </div>
      </div>
    </div>
  );

  const emptyState = () => (
    <div className="h-[calc(100vh-52px)] flex flex-col items-center justify-center">
      <Image src={"/img/asset-empty.png"} width={500} height={500} alt="No selected transaction" />
      <div className="text-base font-bold">Select a Transaction</div>
    </div>
  );

  return (
    <div className="flex h-full max-h-screen flex-col w-1/2 relative">
      <div className="flex flex-1 flex-col">
        <div className="flex gap-2 flex-start items-center p-4 sticky top-0 left-0 w-full h-[52px] text-lg font-semibold bg-[#FFF] z-2">
          Transaction Detail
        </div>
        <div className="shrink-0 bg-border h-[1px] w-full mt-auto" />
        {currentTransaction ? transactionDetail() : emptyState()}
      </div>
    </div>
  );
};

TransactionDetail.displayName = "Transaction Details";
export default TransactionDetail;
