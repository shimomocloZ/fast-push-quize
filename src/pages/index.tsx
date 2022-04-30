import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useUser } from '../context/userContext'

type ChatType = {
  userName: string
  message: string
  datetime: string
}

const Home = () => {
  const [socket, _] = useState(() => io())
  const [isConnected, setIsConnected] = useState(false)
  const [newChat, setNewChat] = useState<ChatType>({
    userName: '',
    message: '',
    datetime: '',
  })
  const [chats, setChats] = useState<ChatType[]>([
    {
      userName: 'TEST BOT',
      message: 'Hello World',
      datetime: '2020-09-01 12:00:00',
    },
  ])
  const [userName, setUserName] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  // Our custom hook to get context values
  const { isLoading, user } = useUser()

  const profile = {
    username: 'shimomoclo.sys@gmail.com',
    message: 'Awesome!!',
  }

  useEffect(() => {
    if (!isLoading) {
      // You know that the user is loaded: either logged in or out!
      console.log(user)
    }
    // You also have your firebase app initialized
  }, [isLoading, user])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected!!')
      setIsConnected(true)
    })
    socket.on('disconnect', () => {
      console.log('socket disconnected!!')
      setIsConnected(false)
    })
    socket.on('update-data', (newData: ChatType) => {
      console.log('Get Updated Data', newData)
      setNewChat(newData)
    })

    return () => {
      socket.close()
    }
  }, [socket])

  useEffect(() => {
    if (newChat.message) {
      setChats([...chats, newChat])
    }
  }, [newChat])

  const handleSubmit = async () => {
    const datetime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    await fetch(location.href + 'chat', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName,
        message,
        datetime,
      }),
    })
    setMessage('')
  }

  // const createUser = async () => {
  //   const db = getFirestore()
  //   await setDoc(doc(db, 'profile', profile.username), profile)

  //   alert('User created!!')
  // }

  return (
    <div className='container'>
      <main>
        <div>
          {chats?.map((chat, index) => (
            <>
              <dl key={`${index}`}>
                <dt className='name'>{chat.userName}</dt>
                <dd>{chat.message}</dd>
                <dd>{chat.datetime}</dd>
              </dl>
            </>
          ))}
        </div>

        <input
          name='name'
          required
          type='text'
          placeholder='name'
          onChange={(event) => setUserName(event.target.value)}
        />
        <input
          name='message'
          required
          type='text'
          placeholder='message'
          onChange={(event) => setMessage(event.target.value)}
        />
        <button type='submit' onClick={handleSubmit}>
          Submit Chat
        </button>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        button {
          font-size: 1.5em;
          margin: 1em 0;
        }

        a {
          color: blue;
          font-size: 1.5em;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }
        .name {
          font-weight: 700;
          padding-right: 5px;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono,
            Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
            Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

export default Home
