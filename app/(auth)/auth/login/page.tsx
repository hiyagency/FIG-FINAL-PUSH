import { LoginPanel } from "@/components/forms/login-panel";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const params = await searchParams;

  return <LoginPanel registered={params.registered === "1"} />;
}
