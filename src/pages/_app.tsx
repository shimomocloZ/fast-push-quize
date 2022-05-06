import 'bootstrap/dist/css/bootstrap.min.css'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import UserProvider, { useUser } from '../context/userContext'

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }) {
  const { isLoading, user } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (isLoading) {
      return
    }
    // You know that the user is loaded: either logged in or out!
    console.log(user)
    if (user === null) {
      router.push('/login')
    }
    // You also have your firebase app initialized
  }, [])

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}
