import { GoogleAuthProvider, signInAnonymously, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Button, Form, FormGroup, Input, Label, Toast, ToastHeader } from 'reactstrap'
import { auth } from '../../firebase/clientApp'

const Login = () => {
  const router = useRouter()
  const { redirected } = router.query
  const isAuthenticated = redirected !== 'yes'
  const [showToast, setShowToast] = useState<boolean>(true)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const toggleToast = () => setShowToast(!showToast)
  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>): void => setEmail(event.target.value)
  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>): void => setPassword(event.target.value)

  const onClickLogin = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('ログイン成功=', userCredential.user.uid)
        router.push('/')
      })
      .catch((error) => {
        console.error(error)
        alert('ログイン失敗！')
      })
  }

  const onClickLoginWithGoogle = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault()
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        console.log('ログイン成功=', userCredential.user.uid)
        router.push('/')
      })
      .catch((error) => {
        console.error(error)
        alert('ログイン失敗！')
      })
  }

  const onClickLoginWithAnonymous = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault()
    signInAnonymously(auth)
      .then((userCredential) => {
        console.log('ログイン成功=', userCredential.user.uid)
        router.push('/')
      })
      .catch((error) => {
        console.error(error)
        alert('ログイン失敗！')
      })
  }

  return (
    <div>
      {!isAuthenticated ? (
        <Toast className='bg-danger' style={{ width: '100%' }} isOpen={showToast}>
          <ToastHeader toggle={toggleToast}>
            ログインしていないため、リダイレクトされました。ログインしてください。
          </ToastHeader>
        </Toast>
      ) : (
        <></>
      )}
      <h1>早押しクイズ ログイン</h1>
      <Form>
        <FormGroup>
          <Label>メールアドレス</Label>
          <Input name='email' type='email' placeholder='email' onChange={onChangeEmail} />
        </FormGroup>

        <FormGroup>
          <Label>パスワード</Label>
          <Input name='password' type='password' placeholder='password' onChange={onChangePassword} />
        </FormGroup>
        <Button color='primary' type='button' onClick={onClickLogin}>
          ログイン
        </Button>
        <Button color='link' type='button' onClick={onClickLoginWithGoogle}>
          <Image
            className='google-icon'
            src={'/btn_google_signin_dark_normal_web@2x.png'}
            width={191}
            height={41}
            alt='sign in with google.'
          />
        </Button>
        <Button color='secondary' type='button' onClick={onClickLoginWithAnonymous}>
          ゲストログイン
        </Button>
        <FormGroup>
          <Link href={'/signup'} passHref>
            <a>ユーザーをお持ちでない方は、こちらから新規登録</a>
          </Link>
        </FormGroup>
      </Form>
    </div>
  )
}

export default Login
