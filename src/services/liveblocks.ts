import { LIVEBLOCKS_PUBLIC_KEY } from "@/vars";
import { createClient } from "@liveblocks/client";

export const liveblocks = createClient({
  publicApiKey: LIVEBLOCKS_PUBLIC_KEY,
});
