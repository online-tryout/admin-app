"use client";

import { FC, useState } from "react";
import TryoutList from "./list/tryout-list";
import { Tryout } from "@/models/model";
import TryoutDetail from "./detail/tryout-details-list";

interface TryoutProps {
  tryouts: Tryout[];
}

const Tryouts: FC<TryoutProps> = ({ tryouts }) => {
  const [curTryout, setCurTryout] = useState<Tryout[] | null>(tryouts);
  const [activeTryout, setActiveTryout] = useState<Tryout | null>(null);

  const historyRowClickedHandler = async (id: string) => {
    setActiveTryout(tryouts.filter((to) => to.id === id)?.[0]);
  };

  return (
    <>
      <TryoutList
        tryouts={curTryout}
        onChatHistoryRowClicked={historyRowClickedHandler}
      />
      <TryoutDetail tryout={activeTryout} />
    </>
  );
};

Tryouts.displayName = "Tryout";
export default Tryouts;
