import { cn } from "@/utils/cn";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useMemo,
} from "react";
import { DateTime } from "luxon";
import { Button } from "@/components/ui/button";

const Month = forwardRef<
  ElementRef<"div">,
  Omit<ComponentPropsWithoutRef<"div">, "children"> & {
    referenceDate?: DateTime;
  }
>((props, ref) => {
  const { className, referenceDate = DateTime.now(), ...rest } = props;

  const startOfMonth = referenceDate?.startOf("month");
  const weeks = useMemo(() => {
    let weeks: DateTime[] = [];
    let current = startOfMonth;
    while (current.hasSame(startOfMonth, "month")) {
      weeks.push(current);
      current = current.plus({ week: 1 });
    }
    return weeks;
  }, [startOfMonth.month]);

  return (
    <div {...rest} className={cn("flex flex-col gap-10", className)}>
      {weeks.map((x, i) => (
        <Week key={i} referenceDate={x} />
      ))}
    </div>
  );
});

const Week = forwardRef<
  ElementRef<"div">,
  Omit<ComponentPropsWithoutRef<"div">, "children"> & {
    referenceDate?: DateTime;
  }
>((props, ref) => {
  const { className, referenceDate = DateTime.now(), ...rest } = props;

  const startOfWeek = referenceDate?.startOf("week");
  const days = useMemo(() => {
    let days: DateTime[] = [];
    let current = startOfWeek;
    while (current.hasSame(startOfWeek, "week")) {
      days.push(current);
      current = current.plus({ day: 1 });
    }
    return days;
  }, [startOfWeek.weekNumber]);

  return (
    <div {...rest} className={cn("flex flex-col gap-1", className)}>
      {days.map((x, i) => (
        <Day key={i} referenceDate={x} />
      ))}
    </div>
  );
});

const Day = forwardRef<
  ElementRef<"div">,
  Omit<ComponentPropsWithoutRef<"div">, "children"> & {
    referenceDate?: DateTime;
  }
>((props, ref) => {
  const { className, referenceDate = DateTime.now(), ...rest } = props;

  const startOfDay = referenceDate?.startOf("day");
  const slots = useMemo(() => {
    let slots: DateTime[] = [];
    let current = startOfDay;
    while (current.hasSame(startOfDay, "day")) {
      slots.push(current);
      current = current.plus({ minutes: 15 });
    }
    return slots;
  }, [startOfDay.weekNumber]);

  return (
    <div {...rest} className={cn("flex flex-row gap-1", className)}>
      {slots.map((x, i) => (
        <Slot key={i} referenceDate={x} />
      ))}
    </div>
  );
});

const Slot = forwardRef<
  ElementRef<"div">,
  Omit<ComponentPropsWithoutRef<"div">, "children"> & {
    referenceDate?: DateTime;
  }
>((props, ref) => {
  const { className, referenceDate = DateTime.now(), ...rest } = props;

  return (
    <div
      {...rest}
      className={cn(
        "flex flex-row items-center gap-1 justify-center flex-1 bg-secondary aspect-square border cursor-pointer",
        className
      )}
    ></div>
  );
});

export default async function () {
  return (
    <div className="px-[2rem] flex-1 flex flex-col justify-center gap-6">
      <div className="flex flex-row items-center justify-start gap-4">
        <Button variant={"outline"}>Sleep</Button>
        <Button variant={"outline"}>Cry</Button>
        <Button variant={"outline"}>Feed</Button>
        <Button variant={"outline"}>Diaper Check</Button>
      </div>
      <Week />
    </div>
  );
}
