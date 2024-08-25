import React from 'react'
import { Installation } from './components/installation'
import { Usage } from './components/usage'
import { Types } from './components/types'
import { Hero } from './components/hero'

export default function Home() {
  return (
    <div className="py-12 sm:py-24 px-4">
      <main className="w-full mx-auto max-w-2xl">
        <Hero />
        <div className="flex flex-col mt-12 sm:mt-24 gap-12">
          <Installation />
          <Types />
          <Usage />
        </div>
      </main>
    </div>
  )
}
