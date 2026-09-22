import "./globals.css";

export const metadata = {
  title: "Cold Start — Beta",
  description: "Cold Start is an original mechanic garage and street racing game in beta testing.",
};

function BetaBanner() {
  return (
    <div className="fixed inset-x-0 top-0 z-[200] flex min-h-9 items-center justify-center gap-3 border-b border-amber-300/25 bg-[#17130b]/95 px-3 py-2 text-center text-[10px] uppercase tracking-[0.18em] text-amber-100 shadow-lg backdrop-blur-md">
      <span className="rounded-full border border-amber-300/60 bg-amber-300/15 px-2 py-0.5 font-bold text-amber-200">Beta</span>
      <span className="hidden sm:inline">Cold Start is in active development</span>
      <a href="mailto:cold-start-feedback@example.com?subject=Cold%20Start%20Beta%20Feedback" className="text-cyan-200 underline decoration-cyan-200/50 underline-offset-4 hover:text-cyan-100">
        Send feedback
      </a>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <BetaBanner />
        <div className="pt-9">{children}</div>
      </body>
    </html>
  );
}
