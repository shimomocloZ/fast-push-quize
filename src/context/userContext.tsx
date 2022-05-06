/**
 * User Context
 */
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase/clientApp'

type UserContextType = {
  user: User | null
  isLoading?: boolean
  setUser?: Dispatch<SetStateAction<User>>
}

const UserContext = createContext<UserContextType>({ user: null })

type Props = {
  children?: JSX.Element
}

export default function UserContextComp({ children }: Props): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Helpful, to update the UI accordingly.
  useEffect(() => {
    // Listen authenticated user
    const unSubscriber = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is signed in.
          const { uid, displayName, email, photoURL } = user
          // You could also look for the user doc in your Firestore (if you have one):
          // const userDoc = await firebase.firestore().doc(`users/${uid}`).get()
          setUser(user)
          // ユーザーのレコード作成
          const registeredUser = await getDoc(doc(db, `users`, user.uid))
          if (!registeredUser.exists()) {
            await setDoc(doc(db, 'users', user.uid), {
              username: user.displayName ?? 'anonymous',
              user_permission: user.isAnonymous ? 'anonymous' : 'general',
              profile_url: '',
              created_at: serverTimestamp(),
              updated_at: serverTimestamp(),
            })
          }
        } else setUser(null)
      } catch (error) {
        // Most probably a connection error. Handle appropriately.
      } finally {
        setIsLoading(false)
      }
    })

    // Unsubscribe auth listener on unmount
    return () => unSubscriber()
  }, [])

  return (
    <UserContext.Provider value={{ user: user, setUser: setUser, isLoading: isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook that shorthands the context!
export const useUser = () => useContext(UserContext)
