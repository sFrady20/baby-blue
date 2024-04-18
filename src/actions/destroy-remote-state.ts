"use server";

import { kv } from "@vercel/kv";
import { DATA_PREFIX } from "@/vars";

export async function destroyRemoteState(key: string) {
  try {
    await kv.del(`${DATA_PREFIX}${key}`);
  } catch (err) {
    console.error(`Error destroying remote data`, err);
  }
}
