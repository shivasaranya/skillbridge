import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import StudentSidebar from "@/components/student/StudentSidebar";
import StudentTopbar from "@/components/student/StudentTopbar";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "STUDENT") redirect("/login");

  // Fetch minimal student data for layout
  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.id },
    select: {
      id: true,
      degree: true,
      department: true,
      graduationYear: true,
      headline: true,
      profileCompletion: true,
      readinessScore: true,
      user: {
        select: { firstName: true, lastName: true, email: true, avatarUrl: true },
      },
      institution: { select: { name: true, city: true } },
    },
  });

  // Unread notification count
  const unreadCount = await prisma.notification.count({
    where: { userId: session.id, isRead: false },
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <StudentSidebar student={student} unreadCount={unreadCount} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <StudentTopbar student={student} unreadCount={unreadCount} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
