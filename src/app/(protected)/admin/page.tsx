import { AdminDashboard } from "./common/admin-dashboard";
import { AdminDashboardEnhanced } from "./common/admin-dashboard-enhanced";

export default function AdminPage() {
  // Toggle between original and enhanced version
  const useEnhanced = true; // Set to false to see original version
  
  return useEnhanced ? <AdminDashboardEnhanced /> : <AdminDashboard />;
}
