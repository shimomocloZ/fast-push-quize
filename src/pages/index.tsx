import { signOut } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Button, Col, Container } from 'reactstrap'
import { useUser } from '../context/userContext'
import { auth } from '../firebase/clientApp'

const Home = () => {
  const { isLoading, user } = useUser()
  const router = useRouter()

  const onClickLogout = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    await signOut(auth)
    router.push('/login')
  }

  useEffect(() => {
    if (!isLoading) {
      // You know that the user is loaded: either logged in or out!
      console.log(user)
    }
    // You also have your firebase app initialized
  }, [isLoading, user])

  return (
    <div>
      {isLoading ? (
        <p>...ロード中</p>
      ) : (
        <Container>
          <Col md={4}>
            <Button color='primary'>ルームを作成</Button>
            <Link href={`/gameroom/1`} passHref>
              <Button color='primary'>ルームに参加</Button>
            </Link>
          </Col>
          <Button color='secondary' onClick={onClickLogout}>
            ログアウト
          </Button>
        </Container>
      )}
    </div>
  )
}

export default Home
