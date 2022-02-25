import { lazy, Suspense } from 'react'
import { Mmorpg } from '../src/ui/Mmorpg'

export default function Game() {
  if (typeof window !== 'undefined') {
    const Component = lazy(() => import('../src/ui/Mmorpg'))
    return (
      <Suspense fallback={<div>Loading game...</div>}>
        <Component />
      </Suspense>
    )
  }
  return <div />
}
