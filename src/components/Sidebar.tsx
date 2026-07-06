import { Building2, LayoutDashboard, Users, FileBarChart2 } from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { label: "Dashboard", href: "#top", Icon: LayoutDashboard },
    { label: "Properties", href: "#properties", Icon: Building2 },
    { label: "Users", href: "#users", Icon: Users },
    { label: "Reports", href: "#reports", Icon: FileBarChart2 },
  ];

  return (
    <aside className="sticky top-[57px] z-30 -mx-4 border-b border-slate-200 bg-white p-2 shadow-sm sm:mx-0 sm:rounded-3xl sm:border sm:p-4 lg:top-24 lg:h-fit">
      <nav className="flex justify-around gap-1 sm:justify-start sm:gap-2 lg:flex-col">
        {menuItems.map((item) => {
          const IconComponent = item.Icon;
          return (
            <a
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 sm:flex-row sm:justify-start sm:px-4 sm:py-3 sm:text-sm lg:w-full"
            >
              <IconComponent size={16} className="shrink-0 text-slate-400 lg:size-5" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

