import { Tryout } from "@/models/model";
import { FC } from "react";
import Image from "next/image";
import { formatIsoDate } from "@/utils/formatIsoDate";

interface TryoutDetailProps {
  tryout: Tryout | null;
}

const TryoutDetail: FC<TryoutDetailProps> = ({ tryout }) => {
  const tryoutDetail = () => (
    <div
      className="h-screen overflow-y-scroll flex flex-col items-center justify-center py-4"
      style={{ scrollbarColor: "#CFD8DC #FFF", scrollbarWidth: "thin" }}
    >
      <div className="text-5xl font-bold pb-4">{tryout?.title}</div>
      <div className="text-sm">
        Started at {formatIsoDate(tryout?.started_at ?? "")}
      </div>
      <div className="text-sm">
        Ended at {formatIsoDate(tryout?.ended_at ?? "")}
      </div>
    </div>
  );

  const emptyState = () => (
    <div className="h-screen flex flex-col items-center justify-center">
      <Image src={"/img/asset-empty.png"} width={500} height={500} alt="" />
      <div className="text-base font-bold">
        Click on Tryout to See the Detail ^^
      </div>
    </div>
  );

  return (
    <div className="flex h-full max-h-screen flex-col w-1/2 relative">
      <div className="flex flex-1 flex-col">
        <div className="flex gap-2 flex-start items-center p-4 sticky top-0 left-0 w-full h-[52px] text-lg font-semibold bg-[#FFF] z-2">
          {tryout?.title ?? "Tryout Detail"}
        </div>
        <div className="shrink-0 bg-border h-[1px] w-full mt-auto" />
        {tryout ? tryoutDetail() : emptyState()}
      </div>
    </div>
  );
};

export default TryoutDetail;
