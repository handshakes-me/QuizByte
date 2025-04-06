import Sidebar from "@/components/common/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="grid grid-cols-[240px,1fr]">
        <Sidebar />
        <div className="w-full min-h-screen bg-main-50 text-main-900 p-12">
          {children}
        </div>
      </div>
  );
}
