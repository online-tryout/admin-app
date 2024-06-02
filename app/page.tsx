import { getTryOut } from "./action";
import Tryouts from "@/components/tryout/tryout";

export default async function Home() {
  const { tryouts } = await getTryOut();
  
  return <Tryouts tryouts={tryouts} />;
}
