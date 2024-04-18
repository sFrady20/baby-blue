"use server";

import { kv } from "@vercel/kv";
import { DATA_PREFIX } from "@/vars";
import { RemoteState } from "@/remote.store";

export async function updateRemoteState(key: string, remote: RemoteState) {
  try {
    await kv.set(`${DATA_PREFIX}${key}`, JSON.stringify(remote));
    console.log("SAVING", remote);
  } catch (err) {
    console.error(`Error setting remote data`, err);
  }
}
