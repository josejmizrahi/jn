"use client";

import { FeedProvider } from "@/components/feed/feed-provider";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FeedProvider>{children}</FeedProvider>;
}