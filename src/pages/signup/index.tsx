// firebase v9 auth, SignUp sample
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap'
import { auth } from '../../firebase/clientApp'

const SignUp = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isError, setIsError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const router = useRouter()

  const inputLengthZero = (): boolean => {
    if (email.length === 0) return true
    if (password.length === 0) return true
  }

  const onClickRegister = (event: React.MouseEvent<HTMLInputElement>): void => {
    event.preventDefault()
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('user created')
        console.log(userCredential) // -> isAnonymousで判定可能
        router.push('/login')
      })
      .catch((error) => {
        alert(error.message)
        console.error(error)
      })
  }

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail((beforeEmail) => {
      const email = event.target.value
      if (email.length === 0) {
        setIsError(true)
        setErrorMessage('メールアドレスを入力してください。')
      } else {
        setIsError(false)
      }

      return event.target.value
    })
  }
  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword((beforePassword) => {
      const email = event.target.value
      if (email.length === 0) {
        setIsError(true)
        setErrorMessage('パスワードを入力してください。')
      } else {
        setIsError(false)
      }

      return event.target.value
    })
  }

  useEffect(() => {
    inputLengthZero()
  }, [])

  return (
    <div>
      <h1>ユーザ登録</h1>
      <div>{isError && <p style={{ color: 'red' }}>{errorMessage}</p>}</div>
      <Form>
        <FormGroup>
          <Label>メールアドレス</Label>
          <Input name='email' type='email' placeholder='email' onChange={onChangeEmail} onBlur={onChangeEmail} />
        </FormGroup>
        <FormGroup>
          <Label>パスワード</Label>
          <Input
            name='password'
            type='password'
            placeholder='password'
            onChange={onChangePassword}
            onBlur={onChangePassword}
          />
        </FormGroup>
        <FormGroup>
          <Button color='primary' onClick={onClickRegister} disabled={isError || inputLengthZero()}>
            登録
          </Button>
        </FormGroup>
      </Form>
    </div>
  )
}

export default SignUp
