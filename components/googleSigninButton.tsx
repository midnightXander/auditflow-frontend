'use client'
import { useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'


export default function GoogleSignInButton({
    className,
    ...props }: React.HTMLAttributes<HTMLDivElement>
) {
  const { loginWithGoogle } = useAuth()
  const btnRef = useRef<HTMLDivElement | null>(null)
  

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) return

    const onLoad = () => {
      // @ts-ignore - google injected script
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: (resp: any) => {
          // resp.credential is the ID token (JWT)
          const idToken = resp?.credential
          if (idToken) {
            loginWithGoogle(idToken).catch(console.error)
          }
        },
      })
      // render a button into the ref element
      // @ts-ignore
      window.google?.accounts.id.renderButton(btnRef.current, { theme: 'outline', size: 'large', })
    }

    // load script if not present
    if (!(window as any).google) {
      const s = document.createElement('script')
      s.src = 'https://accounts.google.com/gsi/client'
      s.onload = onLoad
      document.head.appendChild(s)
    } else {
      onLoad()
    }
  }, [loginWithGoogle])

  
  return <div ref={btnRef} className={className+" --font-lexend"} {...props} />
}
