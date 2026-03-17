export default function VerifyRequestPage() {
  return (
    <div className="flex h-full flex-col justify-center">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Check your inbox</p>
      <h1 className="mt-3 font-display text-4xl text-slate-950">Verification email sent</h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
        If this email can be used, a 6-digit verification code has been sent. The latest code expires in 10
        minutes and replaces any earlier code.
      </p>
    </div>
  );
}
