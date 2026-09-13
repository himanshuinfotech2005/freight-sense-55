import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/overview')
}

export const dynamic = 'force-static'
