import Image from "next/image";
import { FC } from "react";
import { useRouter } from "next/navigation";
import React from "react";

interface TransactionDetailProps {}

const TransactionDetail: FC<TransactionDetailProps> = ({}) => {
  const router = useRouter();

  const userDetail = () => (
    <div
      className="h-[calc(100vh-52px)] overflow-y-scroll flex gap-2 flex-col items-center justify-center"
      style={{ scrollbarColor: "#CFD8DC #FFF", scrollbarWidth: "thin" }}
    >
      {/* <Avatar className="w-[250px] h-[250px] aspect-square mb-4">
        <AvatarImage src={user?.avatar} />
        <AvatarFallback> {getUserFallbackHandler(user?.name)}</AvatarFallback>
      </Avatar>
      <div className="font-bold text-lg">{user?.name}</div>
      <div className="font-semibold text-base">{user?.email}</div>
      <div className="text-sm">{`Joined from ${formatIsoDate(
        user?.created_at ?? ""
      )}`}</div>
      <Button
        className="flex gap-2 mt-2"
        onClick={() => router.push(`/?uid=${user?.uid}&name=${user?.name}`)}
      >
        Send Message <PaperPlaneIcon className="-rotate-45" />
      </Button> */}
    </div>
  );

  const emptyState = () => (
    <div className="h-[calc(100vh-52px)] flex flex-col items-center justify-center">
      <Image src={"/img/asset-empty.png"} width={500} height={500} alt="" />
      <div className="text-base font-bold">Select User to see the Detail</div>
    </div>
  );

  return (
    <div className="flex h-full max-h-screen flex-col w-1/2 relative">
      <div className="flex flex-1 flex-col">
        <div className="flex gap-2 flex-start items-center p-4 sticky top-0 left-0 w-full h-[52px] text-lg font-semibold bg-[#FFF] z-2">
          Transaction Detail
        </div>
        <div className="shrink-0 bg-border h-[1px] w-full mt-auto" />
        {/* {user ? userDetail() : emptyState()} */}
        {emptyState()}
      </div>
    </div>
  );
};

TransactionDetail.displayName = "Transaction Details";
export default TransactionDetail;
