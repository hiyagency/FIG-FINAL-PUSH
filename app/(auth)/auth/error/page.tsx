export default function AuthErrorPage() {
  return (
    <div className="flex h-full flex-col justify-center">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Authentication error</p>
      <h1 className="mt-3 font-display text-4xl text-slate-950">We could not complete that sign-in attempt.</h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
        Check provider configuration, callback URLs, or SMTP credentials, then
        try again.
      </p>
    </div>
  );
}
