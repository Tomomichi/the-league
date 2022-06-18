import { useContext, useRef, useState, useEffect } from 'react'
import Head from 'next/head';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { firebase, getItems } from '../lib/firebase.js'
import { UserContext } from '../lib/contexts.js'
import Breadcrumb from '../components/Breadcrumb.js'
import { useSnackbar } from 'react-simple-snackbar'

export default function Password() {
  const router = useRouter();
  const [user, setUser] = useContext(UserContext);
  const [menu, setMenu] = useState('login');
  const [openSnackbar, closeSnackbar] = useSnackbar({position: 'bottom-left'});
  const formRef = useRef();
  const inputRef = useRef();

  const breadcrumbs = [
    { name: 'ログイン' },
  ];

  const loginWithPassword = (e) => {
    e.preventDefault()
    if(user && !user.isAnonymous) { return }
    const formData = new FormData(formRef.current);
    const params = {
      email: formData.get(`email`),
      password: formData.get(`password`),
    }

    firebase.auth().signInWithEmailAndPassword(params['email'], params['password']).then(function(){
      openSnackbar('ログインしました');
      router.push('/mypage');
    }).catch(function(error) {
      openSnackbar(error.message);
      console.log(error)
    });
  }

  const updatePassword = (e) => {
    e.preventDefault()
    if(!user || user.isAnonymous) { return }
    const formData = new FormData(formRef.current);
    const params = {
      password: formData.get(`password`),
    }

    user.updatePassword(params['password']).then(function() {
      openSnackbar('パスワードを変更しました！');
      inputRef.current.value = ''
    }).catch(function(error) {
      openSnackbar(error.message);
    });
  }

  return (
    <>
      <Head>
        <title>ログイン - {process.env.NEXT_PUBLIC_SITE_NAME}</title>
        <meta key="robots" name="robots" content="noindex" />
      </Head>

      <Breadcrumb items={breadcrumbs} />

      <div className="max-w-screen-lg mx-auto px-4 sm:px-0">
        <h1 className="flex items-center text-lg font-bold mb-8">
          パスワードログイン
        </h1>

        <div className="flex border-b mb-6">
          <div className={`px-6 pb-1 border-gray-700 ${menu == 'login' ? 'border-b-2' : 'cursor-pointer'}`} onClick={()=>setMenu('login')}>ログイン</div>
          <div className={`px-6 pb-1 border-gray-700 ${menu == 'setting' ? 'border-b-2' : 'cursor-pointer'}`} onClick={()=>setMenu('setting')}>パスワード設定</div>
        </div>

        <div>
          { menu == 'login' &&
            <form ref={formRef} onSubmit={loginWithPassword} className='space-y-4'>
              <input type="email" name="email" className="w-full rounded border p-2" placeholder='メールアドレス' required disabled={ user && !user.isAnonymous } />
              <input type="password" name="password" className="w-full rounded border p-2" placeholder='パスワード' required disabled={ user && !user.isAnonymous } />
              <input type="submit" className={`bg-blue-600 text-white text-sm px-4 py-2 mr-2 rounded ${ (user && !user.isAnonymous) ? 'opacity-50' : 'hover:opacity-75 cursor-pointer'}`} value="ログイン" disabled={ user && !user.isAnonymous } />
              { (user && !user.isAnonymous) && (
                <div className='text-sm'>※すでにログインしています</div>
              ) }
            </form>
          }
          { menu == 'setting' &&
            <form ref={formRef} onSubmit={updatePassword} className='space-y-4'>
              <input ref={inputRef} type="password" name="password" className="w-full rounded border p-2" placeholder='パスワード' required disabled={ !user || user.isAnonymous } />
              <input type="submit" className={`bg-red-600 text-white text-sm px-4 py-2 mr-2 rounded ${ (!user || user.isAnonymous) ? 'opacity-50' : 'hover:opacity-75 cursor-pointer'}`} value="設定" />
              { (!user || user.isAnonymous) && (
                <div className='text-sm'>※ログインしていません</div>
              ) }
            </form>
          }
        </div>
      </div>
    </>
  )
}
