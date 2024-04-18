import {
  RadialFab,
  RadialFabButton,
  RadialFabIcon,
} from "@/components/radial-fab";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export default async function (props: { children: ReactNode }) {
  const { children } = props;

  return (
    <>
      <header></header>
      <main className="flex-1">{children}</main>
      <footer>
        <div className="flex flex-col items-center justify-center py-[60px]">
          <RadialFab>
            <RadialFabButton>
              <RadialFabIcon className="icon-[ri--add-line]" />
            </RadialFabButton>
            <RadialFabButton variant="sub" angle={-25} radius={"5rem"}>
              <RadialFabIcon className="icon-[ri--add-line]" />
            </RadialFabButton>
          </RadialFab>
        </div>
      </footer>
    </>
  );
}
