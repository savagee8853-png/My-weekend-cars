import "./globals.css";

export const metadata = {
  title: "Cold Start",
  description: "Mechanic garage and street racing game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
