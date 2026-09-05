import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import IndustrySidebar from "@/components/industry/IndustrySidebar";
import IndustryTopbar from "@/components/industry/IndustryTopbar";

export default async function IndustryLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "INDUSTRY") redirect("/login");

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.id },
    select: {
      id: true,
      companyName: true,
      domain: true,
      city: true,
      state: true,
      website: true,
      isVerified: true,
      contactPerson: true,
      phone: true,
    },
  });

  // Count pending/new applications as "unread" notifications
  const newAppsCount = await prisma.application.count({
    where: {
      opportunity: { company: { userId: session.id } },
      status: "APPLIED",
      studentId: { not: null },
    },
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <IndustrySidebar company={company} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <IndustryTopbar company={company} unreadCount={newAppsCount} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
