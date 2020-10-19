import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router'
import { UserContext } from '../lib/contexts.js';
import { firebase } from '../lib/firebase.js'


export default function Login() {
  const router = useRouter();
  const [user, setUser] = useContext(UserContext);
  const [signinUrl, setSigninUrl] = useState();

  React.useEffect(() => {
    const url = `${window.location.protocol}//${window.location.host}/auth`;
    setSigninUrl(url);

    if(user && !user.isAnonymous) { router.push(`/mypage`); }
  }, [user]);

  // リダイレクト後のエラー処理
  firebase.auth().getRedirectResult().catch(error => {
    // ゲストから登録済みのユーザーに紐付けようとしたとき
    if(error.code == 'auth/credential-already-in-use') {
      const alertMessage = 'すでに登録済みのアカウントに、ゲストユーザーのデータを引き継ぐことはできません。ログインすると現在ゲストで作成したデータは失われますが、よろしいですか？'
      if(confirm(alertMessage)) {
        firebase.auth().signInWithCredential(error.credential);
      }else {
        // setSnackbar({open: true, message: 'ログインをキャンセルしました。現在ゲストで作成しているトーナメント表を引き継ぎたい場合、運営までお問い合わせください。'});
      }
    // その他のエラー
    }else {
      // setSnackbar({open: true, message: `【エラー】${error.message}`});
      console.log(error)
    }
  });

  const snsLogin = (providerName) => {
    let provider;
    switch(providerName) {
      case 'twitter':
        provider = new firebase.auth.TwitterAuthProvider();
        break;
      case 'facebook':
        provider = new firebase.auth.FacebookAuthProvider();
        break;
      case 'google':
        provider = new firebase.auth.GoogleAuthProvider();
        break;
    }

    firebase.auth().signInWithRedirect(provider)
  }

  const magicAuth = (e) => {
    e.preventDefault();
    const emailField = document.getElementById('emailField');
    const email = emailField.value;
    const newPassword = Math.random().toString(36).slice(-12)

    firebase.auth().createUserWithEmailAndPassword(email, newPassword).then(function(){
      //新規ユーザーの場合
      firebase.auth().sendPasswordResetEmail(email)
      // setSnackbar({open: true, message: 'ログイン用のメールを送信しました。メール内のリンクをクリックしてログインしてください。'});
    }).catch(function(error) {
      //アドレスが既に登録済みの場合
      if(error.code == 'auth/email-already-in-use') {
        firebase.auth().sendPasswordResetEmail(email)
        // setSnackbar({open: true, message: 'ログイン用のメールを送信しました。メール内のリンクをクリックしてログインしてください。'});
      //validationエラーなど
      }else {
        // setSnackbar({open: true, message: error.message});
      }
    })
  }


  return (
    <div>
      <div>
        <form onSubmit={magicAuth}>
          <h3>メールアドレスでログイン</h3>
          <div>
            <input id="emailField" type="email" required />
          </div>
          <button type="submit">ログイン</button>
          <div>
            入力したメールアドレスに、ログインURLが届きます。
          </div>
        </form>
      </div>

      <div>
        <h3>SNSログイン</h3>
        <button onClick={()=>{snsLogin('twitter');}}>Twitterログイン</button>
        <button onClick={()=>{snsLogin('google');}}>Googleログイン</button>
        <div>
          もちろん勝手に投稿したりしませんのでご安心ください。
        </div>
      </div>
    </div>
  );
}
