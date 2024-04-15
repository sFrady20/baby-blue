import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Button className="gap-2">
        <i className="icon-[svg-spinners--3-dots-fade]" />
        <div>Hello</div>
      </Button>
    </main>
  );
}
