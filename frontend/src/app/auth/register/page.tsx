"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Radar, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Radar className="h-8 w-8 text-[var(--primary)]" />
            <span className="text-xl font-bold">HotRadar AI</span>
          </Link>
          <CardTitle className="text-2xl">注册</CardTitle>
          <CardDescription>创建你的 HotRadar AI 账户</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">姓名</label>
            <Input placeholder="你的姓名" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">邮箱</label>
            <Input type="email" placeholder="your@email.com" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">密码</label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} placeholder="至少 8 位字符" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">
            注册即表示你同意我们的 <a href="#" className="text-[var(--primary)] hover:underline">服务条款</a> 和 <a href="#" className="text-[var(--primary)] hover:underline">隐私政策</a>
          </div>
          <Button className="w-full" size="lg">创建账户</Button>
          <div className="text-center text-sm text-[var(--muted-foreground)]">
            已有账户？ <Link href="/auth/login" className="text-[var(--primary)] hover:underline">登录</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
