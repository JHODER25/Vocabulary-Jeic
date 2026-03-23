'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

function calculateSM2(quality: number, repetition: number, interval: number, easeFactor: number) {
  let nextRepetition = repetition
  let nextInterval = interval
  let nextEaseFactor = easeFactor

  if (quality >= 3) {
    if (repetition === 0) {
      nextInterval = 1
    } else if (repetition === 1) {
      nextInterval = 6
    } else {
      nextInterval = Math.round(interval * easeFactor)
    }
    nextRepetition += 1
  } else {
    nextRepetition = 0
    nextInterval = 1
  }

  nextEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (nextEaseFactor < 1.3) nextEaseFactor = 1.3

  return { nextRepetition, nextInterval, nextEaseFactor }
}

export async function submitReview({ wordId, quality, progressId }: { wordId: number, quality: number, progressId?: number }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const smQuality = quality === 0 ? 1 : quality + 2

  let currentRepetition = 0
  let currentInterval = 0
  let currentEase = 2.5

  if (progressId) {
    const { data: currentProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('id', progressId)
      .single()
    
    if (currentProgress) {
      currentRepetition = currentProgress.repetition
      currentInterval = currentProgress.interval
      currentEase = currentProgress.ease_factor
    }
  }

  const { nextRepetition, nextInterval, nextEaseFactor } = calculateSM2(
    smQuality,
    currentRepetition,
    currentInterval,
    currentEase
  )

  const nextReviewDate = new Date()
  if (smQuality >= 3) {
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval)
  }

  const { error: upsertError } = await supabase
    .from('user_progress')
    .upsert({
      ...(progressId ? { id: progressId } : {}),
      user_id: user.id,
      word_id: wordId,
      repetition: nextRepetition,
      interval: nextInterval,
      ease_factor: nextEaseFactor,
      next_review_date: nextReviewDate.toISOString()
    }, {
      onConflict: 'user_id,word_id'
    })
    
  if (upsertError) {
    console.error("UPSERT PROGRESS ERROR:", upsertError)
  } else {
    console.log("Progress perfectly saved for word:", wordId)
  }

  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const xpEarned = smQuality >= 3 ? 10 : 2
  
  if (stats) {
    const { error: sErr } = await supabase.from('user_stats').update({
      xp: (stats.xp || 0) + xpEarned,
      last_study_date: new Date().toISOString()
    }).eq('user_id', user.id)
    if (sErr) console.error("STATS UPDATE ERROR:", sErr)
  } else {
    const { error: sErr } = await supabase.from('user_stats').insert({
      user_id: user.id,
      xp: xpEarned,
      streak: 1,
      last_study_date: new Date().toISOString()
    })
    if (sErr) console.error("STATS INSERT ERROR:", sErr)
  }

  revalidatePath('/dashboard')
}
