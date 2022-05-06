import 'bootstrap/dist/css/bootstrap.min.css'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import UserProvider, { useUser } from '../context/userContext'

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }) {
  // const { setAuthenticated } = useAppState()
  const { isLoading, user } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (router.pathname === '/signup') return
    if (router.pathname === '/login') return
    if (isLoading) {
      return
    }
    // You know that the user is loaded: either logged in or out!
    console.log('User', user)
    if (user === null) {
      // setAuthenticated(false)
      router.push({ pathname: '/login', query: { redirected: 'yes' } })
    }

    // setAuthenticated(true)
    // You also have your firebase app initialized
  }, [user, isLoading])

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}
