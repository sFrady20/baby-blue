declare type ActivityEvent = { timestamp: string } & (
  | {
      type: "milk";
      amount: number;
    }
  | {
      type: "check";
      pee?: boolean;
      poo?: boolean;
      replaced?: boolean;
    }
  | { type: "sleep"; hours: number }
);

declare type Activity = ActivityEvent[];
