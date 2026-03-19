import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "戰情室 — TestPlanning",
  description: "LargeHome 即時數據戰情室",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      {children}
    </div>
  );
}
