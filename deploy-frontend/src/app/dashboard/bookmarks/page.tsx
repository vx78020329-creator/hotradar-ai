"use client";
import { EventCard } from "@/components/shared/event-card";
import { Card, CardContent } from "@/components/ui/card";
import { mockEvents } from "@/lib/mock-data";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BookmarksPage() {
  const bookmarked = mockEvents.slice(2, 8);
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">收藏</h1><p className="text-[var(--muted-foreground)] mt-1">你收藏的事件和内容</p></div>
      {bookmarked.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarked.map((event) => (<EventCard key={event.id} event={event} />))}
        </div>
      ) : (
        <Card><CardContent className="p-12 text-center"><Bookmark className="h-12 w-12 mx-auto text-[var(--muted-foreground)] mb-4" /><p className="text-[var(--muted-foreground)]">还没有收藏内容</p><Link href="/events"><Button className="mt-4">浏览事件</Button></Link></CardContent></Card>
      )}
    </div>
  );
}
