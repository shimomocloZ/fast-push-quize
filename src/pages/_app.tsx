import 'bootstrap/dist/css/bootstrap.min.css'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import UserProvider, { useUser } from '../context/userContext'
import { auth } from '../firebase/clientApp'

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }) {
  // const { setAuthenticated } = useAppState()
  const { isLoading } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (router.pathname === '/signup') return
    if (router.pathname === '/login') return
    if (isLoading) {
      return
    }
    // You know that the user is loaded: either logged in or out!
    auth.onAuthStateChanged((user) => {
      if (user === null) {
        router.push({ pathname: '/login', query: { redirected: 'yes' } })
      }
    })

    // setAuthenticated(true)
    // You also have your firebase app initialized
  }, [])

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}
