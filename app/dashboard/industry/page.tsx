import { redirect } from "next/navigation";

// Redirect old /dashboard/industry to new /industry/dashboard
export default function OldIndustryDashboard() {
  redirect("/industry/dashboard");
}
