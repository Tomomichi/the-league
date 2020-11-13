import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react';
import { UserContext } from '../lib/contexts.js';
import { firebase } from '../lib/firebase.js'
import { useSnackbar } from 'react-simple-snackbar'


export default function Drawer({drawerOpened, setDrawerOpened}){
  const router = useRouter()
  const [openSnackbar, closeSnackbar] = useSnackbar({position: 'bottom-left'});
  const [user, setUser] = useContext(UserContext);
  const displayName = (!user) ? 'ゲスト' : user.email || user.displayName || 'ゲスト';

  const createLeague = async () => {
    const newRef = firebase.firestore().collection('leagues').doc();
    // ログインしてなければ匿名ログイン
    if(!user) { await firebase.auth().signInAnonymously(); }
    router.push(`/leagues/${newRef.id}/edit`);
  }

  const logout = () => {
    firebase.auth().signOut().then(function() {
      openSnackbar('ログアウトしました');
      router.push('/');
    }).catch(function(error) {
      openSnackbar('ログアウトに失敗しました。。しばらくしてもログアウトできない場合は運営までお問い合わせください。');
      console.log(error);
    });
  }


  return (
    <>
      <div className={`z-50 fixed top-0 left-0 w-full h-full bg-black opacity-25 ${drawerOpened ? 'block' : 'hidden'}`} onClick={()=>{ setDrawerOpened(false); }}></div>

      <div className={`transform shadow top-0 fixed h-full overflow-auto ease-in-out transition-all duration-300 z-50`} style={{width: 250, right: drawerOpened ? 0 : -250}}>
        <nav className="bg-white w-full h-full absolute right-0 top-0 z-50">
          <div className="p-4 font-bold flex items-center border-b">
            <svg className={`mr-1 w-5 h-5 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
            </svg>
            <span className="truncate flex-1">{ displayName }</span>
          </div>

          <ul>
            <li className="p-4 cursor-pointer flex items-center hover:bg-gray-100" onClick={createLeague}>
              <svg className={`mr-1 w-5 h-5 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
              </svg>
              リーグ表作成
            </li>

            { user &&
              <li>
                <Link href='/mypage'>
                  <a className="p-4 flex items-center hover:bg-gray-100" onClick={()=>{setDrawerOpened(false)}}>
                    <div className="flex items-center">
                      <svg className={`mr-1 w-5 h-5 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                      </svg>
                      マイページ
                    </div>
                  </a>
                </Link>
              </li>
            }

            { user &&
              <li className="p-4 cursor-pointer hover:bg-gray-100 flex items-center" onClick={logout}>
                <svg className={`mr-1 w-5 h-5 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                </svg>
                ログアウト
              </li>
            }

            { !user &&
              <li className="hover:bg-gray-100">
                <Link href='/login'>
                  <a className="p-4 flex items-center hover:opacity-75" onClick={()=>{setDrawerOpened(false)}}>
                    <div className="flex items-center">
                      <svg className={`mr-1 w-5 h-5 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                      </svg>
                      ログイン
                    </div>
                  </a>
                </Link>
              </li>
            }

            <li className="border-t hover:bg-gray-100">
              <a href="https://goo.gl/forms/xqvYet0AAsQUalI52" target="_blank" className="p-4 flex items-center hover:opacity-75">
                <svg className={`mr-1 w-5 h-5 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"></path>
                </svg>
                お問い合わせ
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};
