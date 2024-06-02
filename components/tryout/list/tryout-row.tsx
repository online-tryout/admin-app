import { Tryout } from "@/models/model";
import { formatIsoDate } from "@/utils/formatIsoDate";
import { FC } from "react";

interface TryoutRowProps {
  tryout: Tryout;
}

const TryoutRow: FC<TryoutRowProps> = ({ tryout }) => {
  return (
    <div className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent bg-[#FFF] cursor-pointer">
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="font-semibold">
              {tryout.title}
            </div>
          </div>
          <div className="ml-auto text-xs text-foreground">
            {formatIsoDate(tryout.startedAt)}
          </div>
        </div>
      </div>
      <div className="line-clamp-3 text-xs text-muted-foreground">
        {tryout.status}
      </div>
    </div>
  );
};

TryoutRow.displayName = "Tryout Row";
export default TryoutRow;
