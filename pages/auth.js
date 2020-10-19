import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../lib/firebase.js';
import Head from 'next/head';

export default function Auth() {
  const router = useRouter();

  // 最初routerが空の状態で来ちゃうのを考慮
  React.useEffect(() => {
    const q = router.query;
    if(!q.oobCode) { return; }
    firebase.auth().verifyPasswordResetCode(q.oobCode).then((email) => {
      const newPassword = Math.random().toString(36).slice(-12)
      firebase.auth().confirmPasswordReset(q.oobCode, newPassword).then(() => {
        firebase.auth().signInWithEmailAndPassword(email, newPassword);
        // setSnackbar({open: true, message: 'ログインしました'});
        router.push('/mypage');
      });
    }).catch((error) => {
      // setSnackbar({open: true, message: 'ログインに失敗しました。。'});
      router.push('/login');
    });
  }, [router]);

  return (
    <>
      <Head>
        <title>Auth - THE TIMELINE</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="mt-16 text-center">
        <div>Loading...</div>
      </div>
    </>
  );
}
