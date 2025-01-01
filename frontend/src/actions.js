'use server'
 
import { cookies } from 'next/headers'
 
function encrypt(data) {
  // Your encryption logic
  return JSON.stringify(data)
}
function decrypt(data) {
  // Your decryption logic
  return JSON.parse(data)
}
export async function handleLogin(sessionData) {
  const encryptedSessionData = encrypt(sessionData) // Encrypt your session data
  cookies().set('session', encryptedSessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // One day
    path: '/',
  })
  // Redirect or handle the response after setting the cookie
}
 
export async function getSessionData() {
  const encryptedSessionData = cookies().get('session')?.value
  return encryptedSessionData ? JSON.parse(encryptedSessionData) : null
}

export async function handleLogout() {
  cookies().set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  })
}
