import Link from 'next/link';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Mountain, 
  Settings, 
  LogOut, 
  Bell,
  Search
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-stone-800 bg-stone-950/50 backdrop-blur-xl flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-stone-800">
          <Link href="/admin" className="flex items-center gap-2 font-extrabold text-xl">
            <span className="text-2xl">🪨</span>
            <span className="text-white">Admin</span><span className="text-emerald-500">Panel</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest px-4 mb-4">Menu Principale</p>
          
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 transition-all">
            <LayoutDashboard size={20} />
            <span className="font-semibold">Dashboard</span>
          </Link>
          
          <Link href="/admin/prenotazioni" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-400 hover:bg-stone-900 hover:text-white transition-all">
            <CalendarDays size={20} />
            <span className="font-semibold">Prenotazioni</span>
          </Link>
          
          <Link href="/admin/grotte" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-400 hover:bg-stone-900 hover:text-white transition-all">
            <Mountain size={20} />
            <span className="font-semibold">Gestione Grotte</span>
          </Link>

          <div className="pt-8">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest px-4 mb-4">Sistema</p>
            <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-400 hover:bg-stone-900 hover:text-white transition-all">
              <Settings size={20} />
              <span className="font-semibold">Impostazioni</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-stone-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={20} />
            <span className="font-semibold">Esci</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-stone-800 bg-stone-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 bg-stone-900/50 border border-stone-800 px-4 py-2 rounded-full w-96">
            <Search size={18} className="text-stone-500" />
            <input 
              type="text" 
              placeholder="Cerca prenotazioni, grotte..." 
              className="bg-transparent border-none focus:outline-none text-sm text-stone-200 w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-stone-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-stone-950"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
