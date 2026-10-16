import { AdminProvider } from "@/components/admin/AdminProvider";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminRouteLayout({ children }) {
  return (
    <AdminProvider>
      <AdminLayout>{children}</AdminLayout>
    </AdminProvider>
  );
}
