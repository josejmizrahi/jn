import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "./supabase";

let feedChannel: RealtimeChannel;

export function subscribeFeedChanges(callback: () => void) {
  if (feedChannel) {
    feedChannel.unsubscribe();
  }

  feedChannel = supabase
    .channel("feed_changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "feed_items",
      },
      () => {
        callback();
      }
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "engagements",
      },
      () => {
        callback();
      }
    )
    .subscribe();

  return () => {
    feedChannel.unsubscribe();
  };
}