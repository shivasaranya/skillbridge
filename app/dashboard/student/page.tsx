import { redirect } from "next/navigation";

// Redirect old /dashboard/student URL to new /student/dashboard
export default function OldStudentDashboard() {
  redirect("/student/dashboard");
}
