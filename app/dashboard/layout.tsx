import Dashboard from "@/components/dashboard/Dashboard";
import AuthGuard from "@/components/auth/AuthGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Dashboard>{children}</Dashboard>
    </AuthGuard>
  );
}
