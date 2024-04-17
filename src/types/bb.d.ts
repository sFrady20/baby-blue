declare type ActivityEvent =
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
  | { type: "sleep" };

declare type Activity = { [time: string]: ActivityEvent };
