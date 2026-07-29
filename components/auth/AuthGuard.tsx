"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/shared/auth/auth.service";
import { useMounted } from "@/shared/hooks/useMounted";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();
  const redirected = useRef(false);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated() && !redirected.current) {
      redirected.current = true;
      router.replace(`/login-usuario?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [mounted, pathname, router]);

  if (!mounted) return null;
  if (!isAuthenticated()) return null;

  return <>{children}</>;
}
