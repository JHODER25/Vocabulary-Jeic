import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LogOut, Home, BarChart2 } from 'lucide-react'
import Link from 'next/link'
import { logout } from '@/app/login/actions'
import { Logo } from '@/components/Logo'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch stats quickly
  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-3 mb-8">
          <Logo />
          <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Vocab Jeic</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md bg-zinc-900 text-zinc-100 font-medium">
            <Home className="w-5 h-5 text-indigo-400" /> Practice
          </Link>
          <Link href="/dashboard/stats" className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 font-medium transition-colors">
            <BarChart2 className="w-5 h-5" /> Statistics
          </Link>
        </nav>

        <div className="pt-6 border-t border-zinc-800">
          <div className="mb-4">
            <div className="text-xs text-zinc-500 uppercase font-semibold tracking-wider mb-2">My Progress</div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-zinc-400">Streak 🔥</span>
              <span className="font-medium">{stats?.streak || 0} days</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-zinc-400">XP ⭐</span>
              <span className="font-medium">{stats?.xp || 0}</span>
            </div>
          </div>
          <form action={logout}>
            <button className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:bg-red-950/30 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" /> Log out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative pb-16 md:pb-0">
        <header className="h-16 border-b border-zinc-800 flex items-center gap-3 px-6 md:hidden bg-zinc-950 z-20">
            <Logo />
            <span className="font-bold text-lg">Vocab Jeic</span>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-12 relative z-10">
          {children}
        </div>
        {/* Decorative background blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.5) 0%, rgba(0,0,0,0) 70%)' }}></div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between px-2 z-50">
        <Link href="/dashboard" className="flex flex-col items-center justify-center w-full h-full text-indigo-400">
          <Home className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold">Practice</span>
        </Link>
        <Link href="/dashboard/stats" className="flex flex-col items-center justify-center w-full h-full text-zinc-500 hover:text-zinc-300 transition-colors">
          <BarChart2 className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold tracking-wide">Stats</span>
        </Link>
        <form action={logout} className="w-full h-full">
          <button className="flex flex-col items-center justify-center w-full h-full text-zinc-500 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Log out</span>
          </button>
        </form>
      </div>
    </div>
  )
}
