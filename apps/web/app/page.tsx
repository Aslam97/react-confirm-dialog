import React from 'react'
import { Installation } from './components/installation'
import { Usage } from './components/usage'
import { Types } from './components/types'
import { Hero } from './components/hero'

export default function Home() {
  return (
    <div className="px-4 py-12 sm:py-24">
      <main className="mx-auto w-full max-w-2xl">
        <Hero />
        <div className="mt-12 flex flex-col gap-12 sm:mt-24">
          <Installation />
          <Types />
          <Usage />
        </div>
      </main>
    </div>
  )
}
