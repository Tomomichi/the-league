import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../lib/contexts.js';
import { firebase } from '../lib/firebase.js';
import Head from 'next/head';
import { useSnackbar } from 'react-simple-snackbar'

export default function Auth() {
  const router = useRouter();
  const [openSnackbar, closeSnackbar] = useSnackbar({position: 'bottom-left'});
  const [user, setUser] = useContext(UserContext);

  // 最初routerが空の状態で来ちゃうのを考慮
  React.useEffect(() => {
    if (!firebase.auth().isSignInWithEmailLink(window.location.href)) { return; }

    var email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      email = window.prompt('確認のため、ログインに使用するメールアドレスを再度入力してください');
    }
    // The client SDK will parse the code from the link for you.
    firebase.auth().signInWithEmailLink(email, window.location.href)
      .then(function(result) {
        window.localStorage.removeItem('emailForSignIn');
        openSnackbar('ログインしました');
        router.push('/mypage');
      })
      .catch(function(error) {
        openSnackbar('ログインに失敗しました。。');
        router.push('/login');
      });
  }, [router]);

  return (
    <>
      <Head>
        <title>Auth - THE LEAGUE</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="mt-16 text-center">
        <div>Loading...</div>
      </div>
    </>
  );
}
