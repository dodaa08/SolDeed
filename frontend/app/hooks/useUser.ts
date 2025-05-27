import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const useUser = () => {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null)
    })

    return () => authListener?.subscription.unsubscribe()
  }, [])

  return user
}

export default useUser;