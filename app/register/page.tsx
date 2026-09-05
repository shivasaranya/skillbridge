import RegisterClient from "@/components/auth/RegisterClient";

export const dynamic = "force-dynamic";

export default function RegisterPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log(">>> RegisterPage received searchParams:", searchParams);
  const roleParam = typeof searchParams?.role === "string" ? searchParams.role : undefined;
  return <RegisterClient initialRole={roleParam} />;
}


