import { kv } from "@vercel/kv";
import { getActivity } from "./get-activity";
import { ACTIVITY_KEY } from "@/vars";

export async function addActivity(params: {
  time: string;
  event: ActivityEvent;
}) {
  const { time, event } = params;

  const activity = await getActivity();

  activity[time] = event;

  kv.set(`${ACTIVITY_KEY}`, JSON.stringify(activity));

  return activity;
}
