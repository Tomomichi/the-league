import React, { useState, useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { UserContext } from '../lib/contexts.js';
import { firebase } from '../lib/firebase.js'
import { useSnackbar } from 'react-simple-snackbar'


export default function Login() {
  const router = useRouter();
  const [user, setUser] = useContext(UserContext);
  const [openSnackbar, closeSnackbar] = useSnackbar({position: 'bottom-left'});

  React.useEffect(() => {
    if(user && !user.isAnonymous) { router.push(`/mypage`); }
  }, [user]);

  // リダイレクト後の処理
  firebase.auth().getRedirectResult().then(res => {
    setUser(res.user);
    openSnackbar('ログインしました');
    router.push(`/mypage`);
  }).catch(error => {
    // ゲストから登録済みのユーザーに紐付けようとしたとき
    if(error.code == 'auth/credential-already-in-use') {
      const alertMessage = 'すでに登録済みのアカウントに、ゲストユーザーのデータを引き継ぐことはできません。ログインすると現在ゲストで作成したデータは失われますが、よろしいですか？'
      if(confirm(alertMessage)) {
        firebase.auth().signInWithCredential(error.credential);
      }else {
        openSnackbar('ログインをキャンセルしました。現在ゲストで作成しているトーナメント表を引き継ぎたい場合、運営までお問い合わせください。');
      }
    // その他のエラー
    }else {
      openSnackbar(`【エラー】${error.message}`);
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
      openSnackbar('ログイン用のメールを送信しました。メール内のリンクをクリックしてログインしてください。');
    }).catch(function(error) {
      //アドレスが既に登録済みの場合
      if(error.code == 'auth/email-already-in-use') {
        firebase.auth().sendPasswordResetEmail(email)
        openSnackbar('ログイン用のメールを送信しました。メール内のリンクをクリックしてログインしてください。');
      //validationエラーなど
      }else {
        openSnackbar(error.message);
      }
    })
  }


  return (
    <>
      <Head>
        <title>Login - THE LEAGUE</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div>
        <div className="mt-12">
          <div className="rounded bg-blue-100 border border-blue-500 mb-12 px-4 py-3 text-blue-900 text-xs sm:text-sm">
            <svg className={`inline-block mr-1 w-5 h-5 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>            </svg>
            <span className="flex-1">
              THE TOURNAMENTと同じアカウントでログインできます。将来的に両サイトを統合し、まとめて管理できるようにする予定です。
            </span>
          </div>

          <form onSubmit={magicAuth}>
            <div className="mb-20">
              <h3 className="font-bold text-lg mb-4">メールアドレスでログイン</h3>
              <div className="flex w-full mb-4">
                <input id="emailField" className="border rounded-l px-2 py-2 flex-1" type="email" required placeholder="メールアドレス" />
                <button type="submit" className="rounded-r bg-pink-600 hover:bg-pink-700 text-white px-4 text-sm">送信</button>
              </div>
              <div className="rounded bg-yellow-100 border border-yellow-500 mt-4 px-4 py-3 text-yellow-900 text-xs sm:text-sm">
                <svg className={`inline-block mr-1 w-5 h-5 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path>
                </svg>
                <span className="flex-1">
                  メールで届くログインURLの先頭部分を「https://<span className="font-bold text-red-600">league.</span>the-tournament.jp」に変えてアクセスしてください。
                </span>
              </div>
              <div className="text-sm mt-4">
                ※こちらはベータ期間中のみの暫定措置で、本リリース後は不要になります。ご不便おかけしますがご了承ください。
              </div>
            </div>
          </form>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">SNSアカウントでログイン</h3>
          <div className="mb-4">
            <button className="rounded bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mr-0 sm:mr-4 mb-2 sm:mb-0 w-full sm:w-auto" onClick={()=>{snsLogin('twitter');}}>Twitterログイン</button>
            <button className="rounded bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 mr-0 sm:mr-4 mb-2 sm:mb-0 w-full sm:w-auto" onClick={()=>{snsLogin('facebook');}}>Facebookログイン</button>
            <button className="rounded bg-red-600 hover:bg-red-700 text-white px-4 py-2 w-full sm:w-auto" onClick={()=>{snsLogin('google');}}>Googleログイン</button>
          </div>
          <div className="text-sm">
            ※ログイン完了後、自動でマイページに遷移します。数秒程度かかる場合がありますがそのままお待ちください。
            <br />
            ※許可なく投稿などはいたしませんのでご安心ください。
          </div>
        </div>
      </div>
    </>
  );
}
