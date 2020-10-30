import { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as gtag from '../lib/gtag'
import { UserContext, SnackbarContext } from '../lib/contexts.js';
import { firebase } from '../lib/firebase.js';
import Header from '../components/Header.js'
import SnackbarProvider from 'react-simple-snackbar'
import "../styles/tailwind.css"

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  const [user, setUser] = useState();

  firebase.auth().onAuthStateChanged((u) => {
    setUser(u);
  })

  useEffect(() => {
    // Google Analytics
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, []);

  return pageProps.noLayout ? (
      <>
        <Head>
          <title>THE LEAGUE (ザ・リーグ) | 簡単・便利な総当りリーグ表作成サービス</title>
        </Head>
        <Component {...pageProps} />
      </>
    ) : (
      <UserContext.Provider value={[user, setUser]}>
        <SnackbarProvider>
          <Head>
            <title>THE LEAGUE (ザ・リーグ) | 簡単・便利な総当りリーグ表作成サービス</title>
          </Head>

          <div className="text-gray-700">
            <Header />

            <div className="max-w-screen-lg mx-auto px-4 sm:px-0">
              <Component {...pageProps} />
            </div>

            { router.pathname != '/leagues/[...edit]' &&
              <footer className="bg-gray-900 text-gray-200 text-center py-12 mt-32">
                <div className="max-w-screen-lg mx-auto px-4 sm:px-0">
                  <div className="mb-4">
                    <h5>
                      <Link href="/">
                        <a className="text-lg">THE LEAGUE</a>
                      </Link>
                    </h5>
                    <small className="text-xs text-gray-500">簡単・便利な総当りリーグ表作成サービス</small>
                  </div>
                  <ul className="flex flex-col sm:flex-row justify-center sm:space-x-4 text-sm mb-4 text-gray-300">
                    <li className="text-gray-500">利用規約</li>
                    <li className="text-gray-500">プライバシーポリシー</li>
                    <li className="text-gray-500">特定商取引法に基づく表示</li>
                    <li><a href="" target="_blank" className="hover:text-white">運営</a></li>
                    <li><a href="" target="_blank" className="hover:text-white">お問い合わせ</a></li>
                  </ul>
                  <p className="text-sm text-gray-500">
                    © 2020 THE LEAGUE by NOT SO BAD, LLC. All Rights Reserved.
                  </p>
                </div>
              </footer>
            }
          </div>

          <style global jsx>{`
            .full-bleed {
              width: 100vw;
              margin-left: 50%;
              transform: translateX(-50%);
            }
          `}</style>
        </SnackbarProvider>
      </UserContext.Provider>
    );
}

export default App
