// components/LoginButton.tsx
import { supabase } from '../../lib/supabase';


const LoginButton = () => {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
    <button onClick={handleLogin}>
      Sign in with Google
    </button>
  )
}

export default LoginButton
