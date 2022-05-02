import Link from 'next/link'
import React, { useEffect } from 'react'
import { Button, Col, Container } from 'reactstrap'
import { useUser } from '../context/userContext'

const Home = () => {
  const { isLoading, user } = useUser()

  useEffect(() => {
    if (!isLoading) {
      // You know that the user is loaded: either logged in or out!
      console.log(user)
    }
    // You also have your firebase app initialized
  }, [isLoading, user])

  return (
    <div>
      <Container>
        <Col md={4}>
          <Button color='primary'>ルームを作成</Button>
          <Link href={`/gameroom/1`} passHref>
            <Button color='primary'>ルームに参加</Button>
          </Link>
        </Col>
      </Container>
    </div>
  )
}

export default Home
