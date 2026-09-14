import { supabase } from './supabase'
import { getSiteUrlFor } from './site-url'

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signInWithMagicLink(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: getSiteUrlFor('/app') },
  })
  return { data, error }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
    },
  })
  return { data, error }
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getSiteUrlFor('/recuperar-senha?type=recovery'),
  })
  return { data, error }
}

export async function confirmEmail(token: string, email: string) {
  const { error } = await supabase.auth.verifyOtp({ token, type: 'email', email })
  return { error }
}

export async function recoverPassword(token: string, newPassword: string) {
  const { error } = await supabase.auth.verifyOtp({
    token,
    type: 'recovery',
    newPassword,
  } as any)
  return { error }
}

export async function resendConfirmationEmail(email: string) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: getSiteUrlFor('/app') },
  })
  return { error }
}

export async function signInWithGoogle(redirectTo?: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectTo ?? getSiteUrlFor('/auth/callback'),
    },
  })
  return { data, error }
}

export async function signInWithLinkedIn(redirectTo?: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "linkedin",
    options: {
      redirectTo: redirectTo ?? getSiteUrlFor('/auth/callback'),
    },
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}
