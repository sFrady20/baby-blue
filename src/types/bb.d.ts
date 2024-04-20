declare type ActivityEvent = { timestamp: string } & (
  | {
      type: "feed";
      amount: number;
    }
  | {
      type: "check";
      pee?: boolean;
      poo?: boolean;
      replaced?: boolean;
    }
  | {
      type: "cry";
    }
  | { type: "sleep" }
);

declare type Activity = ActivityEvent[];
