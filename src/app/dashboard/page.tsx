import { createClient } from '@/utils/supabase/server'
import FlashcardClient from '@/components/FlashcardClient'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ limit?: string, mode?: string, filter?: string, level?: string }> }) {
  const params = await searchParams;
  
  if (!params.limit || !params.mode || !params.filter || !params.level) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto py-8 lg:py-4">
        <h1 className="text-3xl font-bold mb-2 text-white text-center">Session Settings</h1>
        <p className="text-zinc-400 mb-6 text-center">Configure your practice session.</p>
        
        <form action={async (formData: FormData) => {
          'use server'
          const limit = formData.get('limit')
          const mode = formData.get('mode')
          const filter = formData.get('filter')
          const level = formData.get('level')
          redirect(`/dashboard?limit=${limit}&mode=${mode}&filter=${filter}&level=${level}`)
        }} className="w-full space-y-6 bg-zinc-900 border border-zinc-800 p-5 md:p-8 rounded-2xl shadow-xl mb-12 md:mb-0">
          
          <div>
            <h3 className="text-base font-semibold mb-2">1. Study Style</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <input type="radio" name="mode" value="classic" className="peer sr-only" defaultChecked />
                <div className="p-3 rounded-xl border border-zinc-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 hover:bg-zinc-800 transition text-center h-full flex flex-col justify-center">
                  <div className="font-bold text-white mb-0.5">Classic</div>
                  <div className="text-xs text-zinc-400">Read & Flip</div>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="mode" value="quiz" className="peer sr-only" />
                <div className="p-3 rounded-xl border border-zinc-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 hover:bg-zinc-800 transition text-center h-full flex flex-col justify-center">
                  <div className="font-bold text-white mb-0.5">Quiz Mode</div>
                  <div className="text-xs text-zinc-400">Type it</div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-2">2. Focus Area</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="cursor-pointer">
                <input type="radio" name="filter" value="balanced" className="peer sr-only" defaultChecked />
                <div className="p-3 rounded-xl border border-zinc-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 hover:bg-zinc-800 transition text-center h-full flex flex-col justify-center">
                  <div className="font-bold text-white">Balanced</div>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="filter" value="weaknesses" className="peer sr-only" />
                <div className="p-3 rounded-xl border border-zinc-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 hover:bg-zinc-800 transition text-center h-full flex flex-col justify-center">
                  <div className="font-bold text-white">Weaknesses</div>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="filter" value="new" className="peer sr-only" />
                <div className="p-3 rounded-xl border border-zinc-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 hover:bg-zinc-800 transition text-center h-full flex flex-col justify-center">
                  <div className="font-bold text-white">Learn New</div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-2">3. Difficulty Level</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <label className="cursor-pointer">
                <input type="radio" name="level" value="all" className="peer sr-only" defaultChecked />
                <div className="p-3 rounded-xl border border-zinc-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 hover:bg-zinc-800 transition text-center h-full flex flex-col justify-center">
                  <div className="font-bold text-white mb-1">Mixed</div>
                  <div className="text-[10px] text-zinc-400">All Levels</div>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="level" value="a1" className="peer sr-only" />
                <div className="p-3 rounded-xl border border-zinc-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 hover:bg-zinc-800 transition text-center h-full flex flex-col justify-center">
                  <div className="font-bold text-white mb-1">A1 Beginner</div>
                  <div className="text-[10px] text-zinc-400">Top 300 words</div>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="level" value="a2" className="peer sr-only" />
                <div className="p-3 rounded-xl border border-zinc-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 hover:bg-zinc-800 transition text-center h-full flex flex-col justify-center">
                  <div className="font-bold text-white mb-1">A2 Medium</div>
                  <div className="text-[10px] text-zinc-400">Rank 301 - 800</div>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="level" value="b1" className="peer sr-only" />
                <div className="p-3 rounded-xl border border-zinc-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 hover:bg-zinc-800 transition text-center h-full flex flex-col justify-center">
                  <div className="font-bold text-white mb-1">B1 Advanced</div>
                  <div className="text-[10px] text-zinc-400">Rank 801 - 1200</div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-2">4. Amount</h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <label className="cursor-pointer">
                <input type="radio" name="limit" value="10" className="peer sr-only" defaultChecked />
                <div className="p-3 text-center rounded-xl border border-zinc-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 hover:bg-zinc-800 transition font-bold text-lg">10</div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="limit" value="25" className="peer sr-only" />
                <div className="p-3 text-center rounded-xl border border-zinc-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 hover:bg-zinc-800 transition font-bold text-lg">25</div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="limit" value="50" className="peer sr-only" />
                <div className="p-3 text-center rounded-xl border border-zinc-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 hover:bg-zinc-800 transition font-bold text-lg">50</div>
              </label>
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition shadow-lg shadow-indigo-500/20">
            Start Session
          </button>
        </form>
      </div>
    )
  }

  const limit = parseInt(params.limit) || 10;
  const isQuizMode = params.mode === 'quiz';
  const filterType = params.filter || 'balanced';
  const level = params.level || 'all';

  let minId = 1;
  let maxId = 1200;
  if (level === 'a1') { maxId = 300; } 
  else if (level === 'a2') { minId = 301; maxId = 800; } 
  else if (level === 'b1') { minId = 801; maxId = 1200; }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  let currentCards: any[] = []

  if (filterType === 'weaknesses') {
    let { data: weakCards } = await supabase
      .from('user_progress')
      .select('*, words(*)')
      .eq('user_id', user.id)
      .lte('next_review_date', new Date().toISOString())
      .gte('word_id', minId)
      .lte('word_id', maxId)
      .limit(limit)
      
    currentCards = weakCards || []
  } else if (filterType === 'new') {
    const { data: learnedIds } = await supabase
      .from('user_progress')
      .select('word_id')
      .eq('user_id', user.id)
    
    const ids = learnedIds?.map(l => l.word_id) || []
    let query = supabase.from('words')
      .select('*')
      .gte('id', minId)
      .lte('id', maxId)
      .limit(limit)

    if (ids.length > 0) query = query.filter('id', 'not.in', `(${ids.join(',')})`)
    
    const { data: newWords } = await query
    currentCards = (newWords || []).map(w => ({ id: undefined, word_id: w.id, user_id: user.id, words: w }))
  } else {
    let { data: dueProgress } = await supabase
      .from('user_progress')
      .select('*, words(*)')
      .eq('user_id', user.id)
      .lte('next_review_date', new Date().toISOString())
      .gte('word_id', minId)
      .lte('word_id', maxId)
      .limit(limit)
    
    currentCards = dueProgress || []

    if (currentCards.length < limit) {
      const needed = limit - currentCards.length
      const { data: learnedIds } = await supabase
        .from('user_progress')
        .select('word_id')
        .eq('user_id', user.id)
      
      const ids = learnedIds?.map(l => l.word_id) || []

      let query = supabase.from('words')
        .select('*')
        .gte('id', minId)
        .lte('id', maxId)
        .limit(needed)

      if (ids.length > 0) {
        query = query.filter('id', 'not.in', `(${ids.join(',')})`)
      }

      const { data: newWords } = await query
      
      if (newWords && newWords.length > 0) {
        const mappedNewWords = newWords.map(w => ({
          id: undefined,
          word_id: w.id,
          user_id: user.id,
          words: w
        }))
        currentCards = [...currentCards, ...mappedNewWords] as any
      }
    }
  }

  if (!currentCards || currentCards.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">You're all caught up!</h2>
          <p className="text-zinc-400">No <strong className="text-indigo-400 uppercase">{level}</strong> words remaining for today.</p>
          <Link href="/dashboard" className="mt-6 inline-block bg-indigo-600 px-6 py-2 rounded-lg text-white font-bold hover:bg-indigo-500">Go Back</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center flex-1 h-full max-w-2xl mx-auto w-full pt-8">
      <div className="mb-10 w-full flex justify-between items-center px-4">
        <div>
          <h1 className="text-2xl font-bold">Study Session</h1>
          <p className="text-zinc-400 text-sm mt-0.5 capitalize">{params.mode} • {params.filter} • {level}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-indigo-400">{currentCards.length}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Remaining</div>
        </div>
      </div>
      
      <FlashcardClient dueCards={currentCards} isQuizMode={isQuizMode} />
    </div>
  )
}
