"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Palette, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-3xl font-bold">设置</h1><p className="text-[var(--muted-foreground)] mt-1">管理你的账户和偏好</p></div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />个人资料</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium mb-1.5 block">姓名</label><Input defaultValue="张三" /></div>
            <div><label className="text-sm font-medium mb-1.5 block">邮箱</label><Input defaultValue="user@example.com" /></div>
          </div>
          <div><label className="text-sm font-medium mb-1.5 block">简介</label><Textarea defaultValue="AI 爱好者，关注大模型和机器人领域" /></div>
          <Button>保存更改</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />通知设置</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "热点事件推送", desc: "当有新的爆发事件时通知" },
            { label: "每日摘要", desc: "每天早上发送热点摘要" },
            { label: "报告发布", desc: "新报告发布时通知" },
            { label: "关注更新", desc: "关注的事件有更新时通知" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-[var(--muted-foreground)]">{item.desc}</p></div>
              <div className="h-6 w-11 rounded-full bg-[var(--primary)] relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />安全</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">修改密码</Button>
          <Button variant="outline">启用两步验证</Button>
        </CardContent>
      </Card>
    </div>
  );
}
