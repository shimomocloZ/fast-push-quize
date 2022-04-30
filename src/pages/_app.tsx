import 'bootstrap/dist/css/bootstrap.min.css'
import '../../styles/global.css'
import UserProvider from '../context/userContext'

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}
