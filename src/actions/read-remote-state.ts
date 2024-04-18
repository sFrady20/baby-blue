"use server";

import { kv } from "@vercel/kv";
import { DATA_PREFIX } from "@/vars";
import { RemoteState } from "@/remote.store";

export async function readRemoteState(key: string): Promise<RemoteState> {
  try {
    var remote = (await kv.get(`${DATA_PREFIX}${key}`)) as RemoteState;
    console.log("LOADED", remote);
  } catch (err) {
    console.error(`Error getting remote data`, err);
    remote = {};
  }

  return remote;
}
