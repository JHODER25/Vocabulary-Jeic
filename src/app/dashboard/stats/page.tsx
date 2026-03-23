import { createClient } from '@/utils/supabase/server'
import { Trophy, Flame, Brain, Target } from 'lucide-react'

export default async function StatsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)

  const totalStudied = progress?.length || 0
  const masteredCount = progress?.filter(p => p.interval > 21).length || 0
  const learningCount = totalStudied - masteredCount

  return (
    <div className="max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8 text-white">Your Progress</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-zinc-400 text-sm font-medium mb-1">Total XP</div>
            <div className="text-2xl font-bold">{stats?.xp || 0}</div>
          </div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-zinc-400 text-sm font-medium mb-1">Day Streak</div>
            <div className="text-2xl font-bold">{stats?.streak || 0}</div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="text-zinc-400 text-sm font-medium mb-1">Words Mastered</div>
            <div className="text-2xl font-bold">{masteredCount}</div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-zinc-400 text-sm font-medium mb-1">Words Learning</div>
            <div className="text-2xl font-bold">{learningCount}</div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6">Vocabulary Milestone</h2>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-zinc-400">1200 Core Words Goal</span>
          <span className="font-medium text-indigo-400">{totalStudied} / 1200 ({Math.round((totalStudied/1200)*100) || 0}%)</span>
        </div>
        <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-500 h-full rounded-full" 
            style={{ width: `${(totalStudied / 1200) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
