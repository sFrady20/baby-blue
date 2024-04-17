import { kv } from "@vercel/kv";
import { ACTIVITY_KEY } from "@/vars";

export async function getActivity() {
  try {
    var activity = JSON.parse(
      (await kv.get(`${ACTIVITY_KEY}`)) || "{}"
    ) as Activity;
  } catch (err) {
    console.error(`Error getting activity key store`, err);
    activity = {};
  }

  return activity;
}
