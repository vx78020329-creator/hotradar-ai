"use client";
import { EventCard } from "@/components/shared/event-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockEvents } from "@/lib/mock-data";
import { Star, Plus } from "lucide-react";
import Link from "next/link";

export default function FollowingPage() {
  const followed = mockEvents.slice(0, 6);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">我的关注</h1><p className="text-[var(--muted-foreground)] mt-1">追踪你关注的事件和话题</p></div>
        <Link href="/events"><Button variant="outline" className="gap-2"><Plus className="h-4 w-4" /> 添加关注</Button></Link>
      </div>
      {followed.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {followed.map((event) => (<EventCard key={event.id} event={event} />))}
        </div>
      ) : (
        <Card><CardContent className="p-12 text-center"><Star className="h-12 w-12 mx-auto text-[var(--muted-foreground)] mb-4" /><p className="text-[var(--muted-foreground)]">还没有关注任何事件</p><Link href="/events"><Button className="mt-4">浏览事件</Button></Link></CardContent></Card>
      )}
    </div>
  );
}
