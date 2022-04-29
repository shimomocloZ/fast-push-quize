import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { useRouter } from "next/router";
import Head from 'next/head'
import { useEffect, useState } from 'react';

type UserProfileType = {
  username: string
  message: string
}

export default function UserName() {
  const router = useRouter()
  const { username } = router.query

  const [profile, setProfile] = useState<UserProfileType | null>(null)

  const getUser = async () => {
    const db = getFirestore()
    const profileDoc = await getDoc(doc(db, 'profile', username as string))
    const data = profileDoc.data() as UserProfileType
    return data

  }
  useEffect(() => {
    const effect = async () => {
      const profile = await getUser()
      setProfile(profile)
    }
    effect()
    // You also have your firebase app initialized
  }, [])
  return (
    <div className="container">
      <Head>
        <title>Next.js w/ Firebase Client-Side</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Next.js w/ Firebase Server-Side</h1>
        <h2>{profile?.username}</h2>
        <p>{profile?.message}</p>
      </main>
    </div>
  )
}
