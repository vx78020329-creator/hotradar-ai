"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Radar, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Radar className="h-8 w-8 text-[var(--primary)]" />
            <span className="text-xl font-bold">HotRadar AI</span>
          </Link>
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>欢迎回来，请登录你的账户</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">邮箱</label>
            <Input type="email" placeholder="your@email.com" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">密码</label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} placeholder="输入密码" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded" /> 记住我
            </label>
            <a href="#" className="text-[var(--primary)] hover:underline">忘记密码？</a>
          </div>
          <Button className="w-full" size="lg">登录</Button>
          <div className="text-center text-sm text-[var(--muted-foreground)]">
            还没有账户？ <Link href="/auth/register" className="text-[var(--primary)] hover:underline">免费注册</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
