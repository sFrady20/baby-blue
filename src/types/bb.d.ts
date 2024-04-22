declare type ActivityEvent = { timestamp: string } & (
  | {
      type: "feed";
      amount: number;
      balance: number;
    }
  | {
      type: "check";
      pee?: boolean;
      poo?: boolean;
      replaced?: boolean;
    }
  | { type: "sleep"; hours: number; balance: number }
);

declare type Activity = ActivityEvent[];
