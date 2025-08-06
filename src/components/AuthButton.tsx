import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'

export default async function AuthButton() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'

    const supabase = createClient()
    await supabase.auth.signOut()
    return redirect('/login')
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600 dark:text-gray-300">
        Hey, {user.email}!
      </span>
      <form action={signOut}>
        <Button variant="outline" size="default">
          Logout
        </Button>
      </form>
    </div>
  ) : (
    <Link href="/login">
      <Button variant="outline" size="default">
        Login
      </Button>
    </Link>
  )
}
