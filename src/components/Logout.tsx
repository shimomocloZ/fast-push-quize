import { signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase/clientApp'

export default function Logout() {
    const clickLogout = async () => {
      signOut(auth).then(()=>{
        console.log("ログアウトしました");
      })
      .catch( (error)=>{
        console.log(`ログアウト時にエラーが発生しました (${error})`);
      });
    }
    return (
        <>
        <p onClick={ async () => { await clickLogout() } }>ログアウト</p>
        </>
    )
}

