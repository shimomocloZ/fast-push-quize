import { signInWithEmailAndPassword } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Toast, ToastBody, ToastHeader } from 'reactstrap'
import { auth } from '../../firebase/clientApp'

const Login = () => {
  const router = useRouter()
  const { redirected } = router.query
  const isAuthenticated = redirected !== 'yes'
  const [showToast, setShowToast] = useState(true)
  const toggleToast = () => setShowToast(!showToast)
  const handleSubmit = (event: any) => {
    event.preventDefault()

    const { email, password } = event.target.elements
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((user) => {
        console.log('ログイン成功=', user.user.uid)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div>
      {!isAuthenticated ? (
        <Toast className='bg-danger' style={{ width: '100%' }} isOpen={showToast}>
          <ToastHeader toggle={toggleToast}>
            ログインしていないため、リダイレクトされました。ログインしてください。
          </ToastHeader>
          <ToastBody>ログインしてください。</ToastBody>
        </Toast>
      ) : (
        <></>
      )}
      <h1>ログイン</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>メールアドレス</label>
          <input name='email' type='email' placeholder='email' />
        </div>
        <div>
          <label>パスワード</label>
          <input name='password' type='password' placeholder='password' />
        </div>
        <hr />
        <div>
          <button>ログイン</button>
        </div>
        <hr />
        <div>
          <Link href={'/signup'} passHref>
            <button>Register</button>
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Login
